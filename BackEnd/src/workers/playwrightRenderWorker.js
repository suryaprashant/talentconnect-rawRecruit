import { Worker } from "bullmq";
import { redisConnection } from "../common/redis.js";
import { renderJobPage  } from "../services/extractors/playwrightRenderer.js";

const WORKER_NAME = "playwright-render";

const worker = new Worker(
  WORKER_NAME,
  async (job) => {
    const { url, cacheKey } = job.data || {};
    if (!url) return null;
    const html = await renderJobPage (url);
    if (cacheKey && html) {
      await redisConnection.set(cacheKey, html, "EX", 60 * 60);
    }
    return { html };
  },
  {
    connection: redisConnection,
    concurrency: Number(process.env.PLAYWRIGHT_MAX_CONCURRENCY || 3),
  },
);

worker.on("completed", (job) => {
  console.log(`✅ Playwright render completed: ${job.id}`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Playwright render failed: ${job?.id}`, err?.message || err);
});

export default worker;
