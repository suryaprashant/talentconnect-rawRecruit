import { Worker } from "bullmq";
import { redisConnection } from "../common/redis.js";
import { resolveInfoEmail } from "../utils/sendOtpEmail.js";

console.log("🚀 Welcome Email Worker Started");

new Worker(
  "resolvinfo-req",
  async (job) => {
    console.log("data", job.data);
    const { email, name, adminMessage, meetingLink } = job.data;

    await resolveInfoEmail(email, name, adminMessage, meetingLink);

    console.log(`✅ Welcome email sent to ${email}`);
  },
  {
    connection: redisConnection,
  },
);
