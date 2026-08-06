import { Worker } from "bullmq";
import { redisConnection } from "../common/redis.js";
import {sendWelcomeEmail} from "../utils/sendOtpEmail.js";


console.log("🚀 Welcome Email Worker Started");

new Worker(
  "welcome-email",
  async (job) => {
     console.log("📩 Processing:", job.name);
     console.log("data",job.data);
    const {email, usertype } = job.data;

    await sendWelcomeEmail(email, usertype);

    console.log(`✅ Welcome email sent to ${email}`);
  },
  {
    connection: redisConnection,
  },
);
