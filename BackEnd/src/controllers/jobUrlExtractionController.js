import { createHash } from "node:crypto";
import net from "node:net";
import { lookup } from "node:dns/promises";

import { jobExtractionQueue } from "../queue/jobExtractionQueue.js";
import { redisConnection } from "../common/redis.js";

const CACHE_TTL = Math.max(
  60,
  Number(process.env.EXTRACTION_CACHE_TTL || 172800)
);

const SAFE_ERROR =
  "Couldn't auto-extract job details — please fill the form manually.";

function userIdFrom(req) {
  return String(req.user?._id || req.user?.id || req.user?.userId || "");
}

function isPrivateIp(ip) {
  if (net.isIPv4(ip)) {
    const [a, b, c] = ip.split(".").map(Number);

    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      a >= 224 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 198 && (b === 18 || b === 19))
    );
  }

  if (net.isIPv6(ip)) {
    const normalized = ip.toLowerCase();

    return (
      normalized === "::" ||
      normalized === "::1" ||
      normalized.startsWith("fc") ||
      normalized.startsWith("fd") ||
      normalized.startsWith("fe80:") ||
      normalized.startsWith("::ffff:127.") ||
      normalized.startsWith("::ffff:10.")
    );
  }

  return true;
}

async function validatePublicUrl(raw) {
  if (typeof raw !== "string" || !raw.trim()) {
    throw new Error("A valid URL is required.");
  }

  let url;

  try {
    url = new URL(raw.trim());
  } catch {
    throw new Error("A valid URL is required.");
  }

  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password
  ) {
    throw new Error("Only public HTTP/HTTPS URLs are allowed.");
  }

  const hostname = url.hostname
    .toLowerCase()
    .replace(/^\[|\]$/g, "");

  if (
    !hostname ||
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal") ||
    hostname.endsWith(".test")
  ) {
    throw new Error("Private URLs are not allowed.");
  }

  if (net.isIP(hostname)) {
    if (isPrivateIp(hostname)) {
      throw new Error("Private IP addresses are not allowed.");
    }
  } else {
    let records;

    try {
      records = await lookup(hostname, {
        all: true,
        verbatim: true
      });
    } catch {
      throw new Error("Unable to resolve the URL hostname.");
    }

    if (
      !records.length ||
      records.some((record) => isPrivateIp(record.address))
    ) {
      throw new Error("URL host must resolve only to public IP addresses.");
    }
  }

  // Fragments are not sent to the server and should not affect cache keys.
  url.hash = "";

  return url;
}

export async function createExtraction(req, res) {
  const userId = userIdFrom(req);



  if (!userId) {
    return res.status(401).json({
      message: "Authentication required."
    });
  }

  let url;

  try {
    url = await validatePublicUrl(req.body?.url);
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Invalid URL."
    });
  }

  const normalizedUrl = url.toString();
  const domain = url.hostname.toLowerCase();

  const cacheKey = `job-extract:${createHash("sha256")
    .update(normalizedUrl)
    .digest("hex")}`;

  try {
    // Return previously extracted data directly from Redis.
    const cached = await redisConnection.get(cacheKey);

    if (cached) {
      return res.status(200).json({
        status: "completed",
        data: JSON.parse(cached),
        cached: true
      });
    }

    // Skip domains temporarily disabled by the circuit breaker.
    const manualOnly = await redisConnection.get(
      `job-extract:manual-only:${domain}`
    );

    if (manualOnly) {
      return res.status(422).json({
        status: "failed",
        error: SAFE_ERROR
      });
    }

    // Generate a unique ID for this extraction request.
    const jobId = createHash("sha256")
      .update(
        `${userId}:${normalizedUrl}:${Date.now()}:${Math.random()}`
      )
      .digest("hex");

    const statusKey = `job-extract:status:${jobId}`;
    const ownerKey = `job-extract:owner:${jobId}`;

    // Store temporary status and ownership in Redis, not MongoDB.
    await redisConnection.set(
      statusKey,
      JSON.stringify({
        status: "processing",
        userId
      }),
      "EX",
      3600
    );

    await redisConnection.set(
      ownerKey,
      userId,
      "EX",
      3600
    );

    // Queue the extraction. No extracted job details are saved to MongoDB.
    await jobExtractionQueue.add(
      "extract",
      {
        url: normalizedUrl,
        userId,
        cacheKey,
        statusKey,
        ownerKey
      },
      {
        jobId
      }
    );

    return res.status(202).json({
      jobId,
      status: "processing"
    });
  } catch (error) {
    console.error(
      "Could not queue URL extraction:",
      error.message
    );

    return res.status(503).json({
      message: "Extraction service is temporarily unavailable."
    });
  }
}

export async function getExtractionStatus(req, res) {
  const userId = userIdFrom(req);

  if (!userId) {
    return res.status(401).json({
      message: "Authentication required."
    });
  }

  const jobId = String(req.params.jobId || "");

  if (!/^[a-f0-9]{64}$/i.test(jobId)) {
    return res.status(400).json({
      message: "Invalid job ID."
    });
  }

  try {
    const statusKey = `job-extract:status:${jobId}`;

    const raw = await redisConnection.get(statusKey);

    if (!raw) {
      return res.status(404).json({
        status: "failed",
        error: SAFE_ERROR
      });
    }

    const record = JSON.parse(raw);

    // Do not disclose another user's extraction result.
    if (String(record.userId) !== userId) {
      return res.status(404).json({
        message: "Extraction job not found."
      });
    }

    if (record.status === "completed") {
      return res.status(200).json({
        status: "completed",
        data: record.data
      });
    }

    if (record.status === "failed") {
      return res.status(200).json({
        status: "failed",
        error: SAFE_ERROR
      });
    }

    return res.status(200).json({
      status: "processing"
    });
  } catch (error) {
    console.error(
      "Could not retrieve extraction status:",
      error.message
    );

    return res.status(503).json({
      message: "Extraction status is temporarily unavailable."
    });
  }
}
