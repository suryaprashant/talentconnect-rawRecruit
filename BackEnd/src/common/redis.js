// common/redis.js (this file is for reuse, use this connection in both BullMQ and 
// anywhere else you need Redis)

import IORedis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

export const redisConnection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

// Debug logs
redisConnection.on("connect", () => {
  console.log("✅ Redis connected");
});

redisConnection.on("error", (err) => {
  console.error("❌ Redis error:", err);
});