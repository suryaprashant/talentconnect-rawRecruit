import {Queue} from "bullmq";
import { redisConnection } from "../common/redis.js";


export const resolveInfoQueue = new Queue("resolvinfo-req", {
  connection: redisConnection,
});