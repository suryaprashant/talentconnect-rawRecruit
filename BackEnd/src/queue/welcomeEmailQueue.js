import { Queue } from "bullmq";
import { redisConnection } from "../common/redis.js";


export const welcomeEmailQueue = new Queue("welcome-email", {
  connection: redisConnection,
});