// // common/redis.js (this file is for reuse, use this connection in both BullMQ and 
// // anywhere else you need Redis)

// import IORedis from "ioredis";
// import dotenv from "dotenv";
// dotenv.config();

// export const redisConnection = new IORedis(process.env.REDIS_URL, {
//   maxRetriesPerRequest: null,
// });

// // Debug logs
// redisConnection.on("connect", () => {
//   console.log("✅ Redis connected");
// });

// redisConnection.on("error", (err) => {
//   console.error("❌ Redis error:", err);
// });

import IORedis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

export const redisConnection = new IORedis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,

  maxRetriesPerRequest: null,

  retryStrategy(times) {
    return Math.min(times * 50, 2000);
  },

  enableReadyCheck: true,
});

redisConnection.on("connect", () => {
  console.log("✅ Redis connected");
});

redisConnection.on("ready", () => {
  console.log("🚀 Redis ready");
});

redisConnection.on("error", (err) => {
  console.error("❌ Redis error:", err);
});

redisConnection.on("close", () => {
  console.log("⚠️ Redis connection closed");
});

redisConnection.on("reconnecting", () => {
  console.log("🔄 Redis reconnecting...");
});