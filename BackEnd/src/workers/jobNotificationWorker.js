import dotenv from "dotenv";
dotenv.config();

import Connection from "../../config/Db.js";
import { Worker } from "bullmq";
import { redisConnection } from "../common/redis.js";

import { processJobNotificationService } from "../services/jobNotificationService.js";

console.log("🚀 Job Notification Worker Started...");

await Connection();

const worker = new Worker(
  "jobNotificationQueue",
  async (job) => {
    const { jobId } = job.data;

    console.log(`⚙️ Processing notifications for job ${jobId}`);

    await processJobNotificationService(jobId);
  },
  {
    connection: redisConnection,
  }
);

worker.on("completed", (job) => {
  console.log(
    `✅ Notification worker completed for job ${job.data.jobId}`
  );
});

worker.on("failed", (job, err) => {
  console.error(
    `❌ Notification worker failed for job ${job?.data?.jobId}`,
    err
  );
});

export default worker;