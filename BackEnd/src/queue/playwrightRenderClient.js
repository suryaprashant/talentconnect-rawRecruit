import { QueueEvents } from "bullmq";
import { playwrightRenderQueue } from "./jobExtractionQueue.js";
import { redisConnection } from "../common/redis.js";

const connection = redisConnection.duplicate({ maxRetriesPerRequest: null });
const events = new QueueEvents("playwright-render", { connection });
let readyPromise;
async function ensureReady() {
  if (!readyPromise) readyPromise = events.waitUntilReady();
  return readyPromise;
}

export async function renderThroughQueue(url) {
  await ensureReady();
  const job = await playwrightRenderQueue.add("render", { url }, {
    removeOnComplete: true,
    removeOnFail: { age: 3600, count: 100 }
  });
  return job.waitUntilFinished(events, Number(process.env.PLAYWRIGHT_TASK_TIMEOUT_MS || 20000));
}
