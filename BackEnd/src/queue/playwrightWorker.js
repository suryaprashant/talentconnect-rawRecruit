// Dedicated render queue worker. The main pipeline currently calls the renderer directly only
// from its worker process. This queue is available for deployments that choose to offload rendering.
import { Worker } from "bullmq";
import { redisConnection } from "../common/redis.js";
import { renderJobPage } from "../services/extractors/playwrightRenderer.js";
const connection = redisConnection.duplicate({ maxRetriesPerRequest: null });
export const playwrightWorker = new Worker("playwright-render", async job => {
  const html = await renderJobPage(job.data.url);
  return { html };
}, { connection, concurrency: Math.min(3, Math.max(1, Number(process.env.PLAYWRIGHT_MAX_CONCURRENCY || 3))) });
playwrightWorker.on("error", err => console.error("Playwright worker error:", err.message));
