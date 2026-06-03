// src/workers/alumniNetwork.worker.js - UPDATED WITH DEBUGGING

import { Worker } from "bullmq";
import { redisConnection } from "../common/redis.js";
import { alumniNetworkQueue } from "../queue/alumniNetworkQueue.js"; // Make sure you import the queue

import {
  processAlumniNetworkNotification,
} from "../services/alumniNetworkNotificationService.js";

console.log(
  "🎓 Alumni Network Worker Started..."
);

// ═══════════════════════════════════════════════════════════════════════════

// DEBUG: Check queue status
console.log("📊 Checking queue status...");
const jobCounts = await alumniNetworkQueue.getJobCounts();
console.log("Queue job counts:", jobCounts);

// ═══════════════════════════════════════════════════════════════════════════

const worker = new Worker(
  "alumniNetworkQueue",

  async (job) => {
    console.error("\n🟣🟣🟣 WORKER PROCESSING JOB 🟣🟣🟣");
    console.error("Job ID:", job.id);
    console.error("Job Name:", job.name);
    console.error("Job Data:", job.data);
    
    const {
      onboardingId,
    } = job.data;

    console.error("About to call processAlumniNetworkNotification with:", onboardingId);

    try {
      const result = await processAlumniNetworkNotification(
        onboardingId
      );
      
      console.error("✅ processAlumniNetworkNotification completed successfully");
      return result;
    } catch (error) {
      console.error("❌ processAlumniNetworkNotification failed:", error.message);
      throw error;
    }
  },

  {
    connection:
      redisConnection,
  }
);

// ═══════════════════════════════════════════════════════════════════════════
// EVENT HANDLERS

worker.on(
  "ready",
  () => {
    console.log("✅ Worker is ready and listening for jobs");
  }
);

worker.on(
  "active",
  (job) => {
    console.error(`\n🟠 Worker processing job: ${job.id}`);
  }
);

worker.on(
  "completed",
  (job) => {
    console.log(
      `✅ Alumni notification completed: ${job.data.onboardingId}`
    );
  }
);

worker.on(
  "failed",
  (job, err) => {
    console.error(
      "❌ Alumni notification failed:",
      err.message
    );
    console.error(err);
  }
);

worker.on(
  "error",
  (err) => {
    console.error("❌ Worker error:", err.message);
    console.error(err);
  }
);

worker.on(
  "paused",
  () => {
    console.warn("⚠️  Worker paused");
  }
);

worker.on(
  "resumed",
  () => {
    console.log("✅ Worker resumed");
  }
);

// ═══════════════════════════════════════════════════════════════════════════

export default worker;