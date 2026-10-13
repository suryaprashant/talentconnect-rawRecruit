// src/workers/score.worker.js

import dotenv from "dotenv";
dotenv.config();

import Connection from "../../config/Db.js";
import { Worker } from "bullmq";
import { redisConnection } from "../common/redis.js";

import { calculateHiringScoreService } from "../services/hiringScoreService.js";
import { updateUserRanking } from "../services/rankingService.js";

console.log("🚀 Worker started...");

// 🔥 CONNECT DB HERE
await Connection();

const worker = new Worker(
  "scoreQueue",
  async (job) => {
    const { userId } = job.data;

    console.log("⚙️ Processing:", userId);

    await calculateHiringScoreService(userId);
    await updateUserRanking(userId);
  },
  {
    connection: redisConnection,
  }
);

worker.on("completed", (job) => {
  console.log(`✅ Done: ${job.data.userId}`);
});

worker.on("failed", (job, err) => {
  console.error("❌ Failed:", err);
});

export default worker;