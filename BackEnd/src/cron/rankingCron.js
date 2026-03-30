// src/cron/ranking.cron.js

import cron from "node-cron";
import { updateAllUserRankings } from "../services/rankingService.js";

export const startRankingCron = () => {
  // Runs every day at 2 AM
  cron.schedule("0 2 * * *", async () => {
    console.log("⏰ Running daily ranking job...");
    await updateAllUserRankings();
  });
};