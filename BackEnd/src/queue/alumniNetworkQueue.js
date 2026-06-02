import { Queue } from "bullmq";
import { redisConnection } from "../common/redis.js";

export const alumniNetworkQueue =
  new Queue(
    "alumniNetworkQueue",
    {
      connection: redisConnection,
    }
  );