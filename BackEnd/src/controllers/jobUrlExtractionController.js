import { randomUUID } from "node:crypto";

import {
  buildExtractionCacheKey,
  extractJobFromUrl,
  SAFE_ERROR_MESSAGE,
} from "../services/extractionPipeline.js";
import {
  assertPublicHttpUrl,
  canonicalizeUrl,
  UnsafeUrlError,
} from "../services/extractors/urlSafety.js";

const MAX_URL_LENGTH = 2048;
const CACHE_TTL = Math.max(
  60,
  Number(process.env.EXTRACTION_CACHE_TTL || 172800),
);
const CACHE_TIMEOUT_MS = Math.max(
  50,
  Number(process.env.EXTRACTION_CACHE_TIMEOUT_MS || 500),
);

const userIdFrom = (req) =>
  String(req.user?._id || req.user?.id || req.user?.userId || "");

async function validatePublicUrl(raw) {
  if (typeof raw !== "string" || !raw.trim() || raw.length > MAX_URL_LENGTH) {
    throw new UnsafeUrlError("A valid URL is required.");
  }
  const url = await assertPublicHttpUrl(raw.trim(), { resolve: true });
  return canonicalizeUrl(url);
}

function log(level, stage, details) {
  const output = {
    event: "job_url_extraction_api",
    level,
    stage,
    timestamp: new Date().toISOString(),
    ...details,
  };
  (level === "error"
    ? console.error
    : level === "warn"
      ? console.warn
      : console.log)(JSON.stringify(output));
}

async function getRedisConnection() {
  const { redisConnection } = await import("../common/redis.js");
  return redisConnection;
}

async function withCacheTimeout(operation) {
  let timer;
  try {
    return await Promise.race([
      Promise.resolve().then(operation),
      new Promise((_, reject) => {
        timer = setTimeout(
          () => reject(new Error("Cache operation timed out.")),
          CACHE_TIMEOUT_MS,
        );
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

/** POST /extract-from-url body: { url } -> 200 normalized job object. */
export function createExtractionHandler({
  extract = extractJobFromUrl,
  validateUrl = validatePublicUrl,
  readCache,
  writeCache,
} = {}) {
  return async function createExtraction(req, res) {
    const requestId = randomUUID();
    const startedAt = Date.now();
    res.set("X-Request-ID", requestId);

    const userId = userIdFrom(req);
    log("info", "request_received", {
      requestId,
      authenticated: Boolean(userId),
    });

    if (!userId) {
      return res.status(401).json({ message: "Authentication required." });
    }

    let url;
    try {
      url = await validateUrl(req.body?.url);
      log("info", "url_validated", {
        requestId,
        host: url.hostname.toLowerCase(),
      });
    } catch (error) {
      log("warn", "url_rejected", {
        requestId,
        code: error?.code || null,
        message: error?.message || "Invalid URL.",
      });
      return res.status(400).json({
        message: error.message || "Invalid URL.",
      });
    }

    const normalizedUrl = url.toString();
    const cacheKey = buildExtractionCacheKey(normalizedUrl);

    try {
      let cached;
      try {
        cached = await withCacheTimeout(async () =>
          readCache
            ? readCache(cacheKey)
            : (await getRedisConnection()).get(cacheKey),
        );
      } catch (error) {
        log("warn", "cache_read_failed", {
          requestId,
          error: error?.name || "CacheError",
        });
      }

      if (cached) {
        try {
          const data = typeof cached === "string" ? JSON.parse(cached) : cached;
          log("info", "response_cached", {
            requestId,
            elapsedMs: Date.now() - startedAt,
          });
          return res.status(200).json(data);
        } catch (error) {
          log("warn", "cache_entry_invalid", {
            requestId,
            error: error?.name || "CacheParseError",
          });
        }
      }

      const data = await extract(normalizedUrl);

      try {
        if (writeCache) {
          await withCacheTimeout(() => writeCache(cacheKey, data, CACHE_TTL));
        } else {
          await withCacheTimeout(async () =>
            (await getRedisConnection()).set(
              cacheKey,
              JSON.stringify(data),
              "EX",
              CACHE_TTL,
            ),
          );
        }
      } catch (error) {
        log("warn", "cache_write_failed", {
          requestId,
          error: error?.name || "CacheError",
        });
      }

      log("info", "response_sent", {
        requestId,
        elapsedMs: Date.now() - startedAt,
        source: data.source,
        confidence: data.confidence,
      });
      return res.status(200).json(data);
    } catch (error) {
      const status =
        error?.code === "EXTRACTION_INSUFFICIENT"
          ? 422
          : error?.code === "GEMINI_NOT_CONFIGURED"
            ? 503
            : Number(error?.status) === 429
              ? 429
              : /timeout|aborted/i.test(String(error?.message))
                ? 504
                : 502;
      const message =
        status === 422
          ? SAFE_ERROR_MESSAGE
          : status === 503
            ? "Extraction service is not configured."
            : status === 429
              ? "Extraction service is rate limited. Please retry shortly."
              : status === 504
                ? "Job extraction timed out. Please retry."
                : "Could not extract job details from this URL.";

      log("error", "request_failed", {
        requestId,
        host: url.hostname.toLowerCase(),
        status,
        code: error?.code || null,
        error: error?.name || "ExtractionError",
        elapsedMs: Date.now() - startedAt,
      });
      return res.status(status).json({ message });
    }
  };
}

export const createExtraction = createExtractionHandler();
