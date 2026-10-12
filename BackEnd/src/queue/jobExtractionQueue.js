import { Queue } from "bullmq";
import { redisConnection } from "../common/redis.js";
export const jobExtractionQueue = new Queue("job-extraction", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 2, backoff: { type: "exponential", delay: 1000 },
    removeOnComplete: { age: 3600, count: 1000 }, removeOnFail: { age: 86400, count: 1000 }
  }
});
export const playwrightRenderQueue = new Queue("playwright-render", {
  connection: redisConnection,
  defaultJobOptions: { attempts: 1, removeOnComplete: { age: 3600, count: 200 }, removeOnFail: { age: 86400, count: 200 } }
});
