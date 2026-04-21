
import cron from "node-cron";
import { JobPostingTable } from "../models/jobPostingsModel.js";

export const startCronJobs = () => {
    // Runs every day at midnight
    cron.schedule("0 0 * * *", async () => {
        try {
            const now = new Date();

            const result = await JobPostingTable.updateMany(
                {
                    endDate: { $lt: now },  // end date has passed
                    inactive: { $ne: true } // only update active ones
                },
                {
                    $set: { inactive: true }
                }
            );

            console.log(`[CRON] Auto-deactivated ${result.modifiedCount} expired jobs at ${now}`);
        } catch (error) {
            console.error("[CRON] Failed to deactivate expired jobs:", error.message);
        }
    });

    console.log("[CRON] Job expiry scheduler started.");
};