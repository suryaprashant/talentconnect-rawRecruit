// src/queues/score.queue.js

import { Queue } from "bullmq";
import { redisConnection } from "../common/redis.js";

export const scoreQueue = new Queue("scoreQueue", {
  connection: redisConnection,
});