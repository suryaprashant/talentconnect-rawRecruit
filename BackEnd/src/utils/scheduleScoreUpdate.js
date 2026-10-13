// src/utils/scheduleScoreUpdate.js

import { scoreQueue } from "../queue/scoreQueue.js";

export const scheduleScoreUpdate = async (userId) => {
  console.log("📩 Job scheduled for:", userId);
  try {
    await scoreQueue.add(
      "calculate-score",
      { userId },
      {
        jobId: `score-${userId}`,  // 🔥 ensures single job per user
        delay: 60000,              // ⏳ 60 sec debounce
        removeOnComplete: true,
        removeOnFail: true
      }
    );
  } catch (error) {
    console.error("Error scheduling score update:", error);
  }
};