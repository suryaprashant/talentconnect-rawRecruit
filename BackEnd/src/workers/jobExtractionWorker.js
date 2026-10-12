import { Worker } from "bullmq";
import crypto from "crypto";
import { redisConnection } from "../common/redis.js";
import extractionPipeline, {
  buildExtractionCacheKey,
} from "../services/extractionPipeline.js";

const JOB_NAME = "job-extraction";
const STATUS_TTL = Number(process.env.EXTRACTION_STATUS_TTL || 8 * 60 * 60);
const CACHE_TTL = Number(process.env.EXTRACTION_CACHE_TTL || 60 * 60 * 48);

const writeJobStatus = async (jobId, payload) => {
  if (!jobId) return;
  await redisConnection.set(
    `job-extract:status:${jobId}`,
    JSON.stringify(payload),
    "EX",
    STATUS_TTL,
  );
};

const worker = new Worker(
  JOB_NAME,
  async (job) => {
    const { url, userId, hash, domain } = job.data || {};
    const jobId = job.id || crypto.randomUUID();

    await writeJobStatus(jobId, {
      status: "processing",
      userId,
      domain,
      url,
      jobId,
    });

    try {
      const result = await extractionPipeline(url, "");
      const normalizedPayload = result?.data || result || {};
      const cacheKey = buildExtractionCacheKey(url || hash || "");
      await redisConnection.set(
        cacheKey,
        JSON.stringify(normalizedPayload),
        "EX",
        CACHE_TTL,
      );
      await writeJobStatus(jobId, {
        status: "completed",
        userId,
        domain,
        url,
        jobId,
        data: normalizedPayload,
      });
      return normalizedPayload;
    } catch (error) {
      const message =
        "Couldn't auto-extract job details — please fill the form manually.";
      await writeJobStatus(jobId, {
        status: "failed",
        userId,
        domain,
        url,
        jobId,
        error: message,
      });
      throw error;
    }
  },
  {
    connection: redisConnection,
    concurrency: 2,
  },
);

worker.on("completed", (job) => {
  console.log(`✅ Job extraction completed: ${job.id}`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job extraction failed: ${job?.id}`, err?.message || err);
});

export default worker;
