import { Worker } from "bullmq";
import { redisConnection } from "../common/redis.js";
import { extractJobFromUrl } from "../services/extractionPipeline.js";

const connection = redisConnection.duplicate({ maxRetriesPerRequest: null });
export const jobExtractionWorker = new Worker("job-extraction", async job => {
  const { url, userId, cacheKey, statusKey, ownerKey } = job.data;
  await connection.set(statusKey, JSON.stringify({ status: "processing", userId }), "EX", 3600);
  try {
    const data = await extractJobFromUrl(url);
    const ttl = Math.max(60, Number(process.env.EXTRACTION_CACHE_TTL || 172800));
    await connection.set(cacheKey, JSON.stringify(data), "EX", ttl);
    await connection.set(statusKey, JSON.stringify({ status: "completed", userId, data }), "EX", 3600);
    await connection.set(ownerKey, String(userId), "EX", 3600);
    const domain = new URL(url).hostname.toLowerCase();
    await connection.set(`job-extract:domain-source:${domain}`, data.source, "EX", 604800);
    await connection.del(`job-extract:failures:${domain}`);
    return data;
  } catch (err) {
    const domain = new URL(url).hostname.toLowerCase();
    const failureKey = `job-extract:failures:${domain}`;
    const failures = await connection.incr(failureKey);
    if (failures === 1) await connection.expire(failureKey, 3600);
    if (failures >= 3) await connection.set(`job-extract:manual-only:${domain}`, "1", "EX", 86400);
    const safeError = "Couldn't auto-extract job details — please fill the form manually.";
    await connection.set(statusKey, JSON.stringify({ status: "failed", userId, error: safeError }), "EX", 3600);
    throw err;
  }
}, { connection, concurrency: Number(process.env.JOB_EXTRACT_CONCURRENCY || 5) });

jobExtractionWorker.on("error", err => console.error("Job extraction worker error:", err.message));
