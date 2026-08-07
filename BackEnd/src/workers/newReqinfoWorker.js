import { Worker } from "bullmq";
import { redisConnection } from "../common/redis.js";
import {sendreqinfoEmail} from "../utils/sendOtpEmail.js";


console.log("🚀 Welcome Email Worker Started");

new Worker(
  "newinfo-req",
  async (job) => {
     console.log("📩 Processing:", job.name);
     console.log("data",job.data);
    const {email,name,message} = job.data;

    await sendreqinfoEmail(email,name,message);

    console.log(`✅ Welcome email sent to ${email}`);
  },
  {
    connection: redisConnection,
  },
);
