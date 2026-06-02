// src/workers/alumniNetwork.worker.js

import { Worker } from "bullmq";
import { redisConnection } from "../common/redis.js";

import {
  processAlumniNetworkNotification,
} from "../services/alumniNetworkNotificationService.js";

console.log(
  "🎓 Alumni Network Worker Started..."
);

const worker = new Worker(
  "alumniNetworkQueue",

  async (job) => {
    const {
      onboardingId,
    } = job.data;

    await processAlumniNetworkNotification(
      onboardingId
    );
  },

  {
    connection:
      redisConnection,
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
      err
    );
  }
);

export default worker;