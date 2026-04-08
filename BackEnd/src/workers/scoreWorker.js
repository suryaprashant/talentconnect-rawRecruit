// src/workers/score.worker.js

import dotenv from "dotenv";
dotenv.config();

import Connection from "../../config/Db.js";
import { Worker } from "bullmq";
import { redisConnection } from "../common/redis.js";

import { calculateHiringScoreService } from "../services/hiringScoreService.js";
import { updateUserRanking } from "../services/rankingService.js";

export const startScoreWorker = async () => {
  console.log("🚀 Score Worker starting...");

  // ✅ Prevent multiple DB connections
  await Connection();

  const worker = new Worker(
    "scoreQueue",
    async (job) => {
      try {
        const { userId } = job.data;

        console.log("⚙️ Processing:", userId);

        await calculateHiringScoreService(userId);
        await updateUserRanking(userId);
      } catch (err) {
        console.error("🔥 Score worker error:", err);
        throw err;
      }
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

  console.log("🟢 Score worker started");
};