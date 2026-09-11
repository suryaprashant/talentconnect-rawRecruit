import { Queue } from "bullmq";
import { redisConnection } from "../common/redis.js";


export const newInfoReqQueue = new Queue("newinfo-req", {
  connection: redisConnection,
});