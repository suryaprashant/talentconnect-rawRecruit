import { Queue } from "bullmq";
import { redisConnection } from "../common/redis.js";

export const jobNotificationQueue = new Queue(
  "jobNotificationQueue",
  {
    connection: redisConnection,
  }
);