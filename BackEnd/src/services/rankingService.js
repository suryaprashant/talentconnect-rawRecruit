// services/ranking.service.js

import CareerInsights from "../models/careerInsightsModel.js";
import { calculateHiringScoreService } from "./hiringScoreService.js";

//updateUserRanking: Calculates and updates a single user's rank, percentile, and label based on their hiring score compared to others.
export const updateUserRanking = async (userId) => {
  try {
    // 🔹 1. Get user score
    const user = await CareerInsights.findOne({ userId })
      .select("hiringScore")
      .lean();

    if (!user || user.hiringScore == null) {
      console.warn("No hiringScore found for user:", userId);
      return null;
    }

    const userScore = user.hiringScore;

    // 🔹 2. Count users with higher score
    const higherUsers = await CareerInsights.countDocuments({
      hiringScore: { $gt: userScore }
    });

    // 🔹 3. Count users with same score (tie handling)
    const sameScoreUsers = await CareerInsights.countDocuments({
      hiringScore: userScore
    });

    // 🔹 4. Total users
    const totalUsers = await CareerInsights.countDocuments({
      hiringScore: { $exists: true }
    });

    if (totalUsers === 0) return null;

    // 🔹 5. Rank calculation (competition ranking)
    const rank = higherUsers + 1;

    // 🔹 6. Percentile
    const percentile = ((totalUsers - rank + 1) / totalUsers) * 100;

    // 🔹 7. Label
    let rankingLabel = "";

    if (percentile >= 90) rankingLabel = "Top 10%";
    else if (percentile >= 80) rankingLabel = "Top 20%";
    else if (percentile >= 50) rankingLabel = "Top 50%";
    else rankingLabel = "Below 50%";

    // 🔹 8. Update DB
    await CareerInsights.updateOne(
      { userId },
      {
        $set: {
          rank,
          percentile: Math.round(percentile),
          rankingLabel
        }
      }
    );

    return {
      rank,
      percentile: Math.round(percentile),
      rankingLabel,
      totalUsers,
      sameScoreUsers
    };

  } catch (error) {
    console.error("Ranking update error:", error);
    return null;
  }
};
// updateAllUserRankings: Updates rankings for all users in the system.
export const updateAllUserRankings = async () => {
  try {
    console.log("🚀 Starting batch ranking update...");

    // 🔹 1. Find users without proper hiringScore
    const usersWithoutScore = await CareerInsights.find({
      $or: [
        { hiringScore: { $exists: false } },
        { hiringScore: 0 }
      ]
    })
      .select("userId")
      .lean();

    console.log(`🧠 Users needing score: ${usersWithoutScore.length}`);

    // 🔹 2. Calculate hiringScore ONLY for them
    for (const user of usersWithoutScore) {
      try {
        await calculateHiringScoreService(user.userId);
      } catch (err) {
        console.error(`❌ Failed score calc for ${user.userId}`, err.message);
      }
    }

    // 🔹 3. Fetch ALL users sorted by score
    const users = await CareerInsights.find({
      hiringScore: { $exists: true }
    })
      .select("userId hiringScore")
      .sort({ hiringScore: -1 })
      .lean();

    const totalUsers = users.length;

    if (totalUsers === 0) {
      console.log("⚠️ No users found for ranking");
      return;
    }

    console.log(`📊 Total users: ${totalUsers}`);

    // 🔹 4. Assign ranks
    let bulkUpdates = [];

    users.forEach((user, index) => {
      const rank = index + 1;
      const percentile = ((totalUsers - rank + 1) / totalUsers) * 100;

      let rankingLabel = "";

      if (percentile >= 90) rankingLabel = "Top 10%";
      else if (percentile >= 80) rankingLabel = "Top 20%";
      else if (percentile >= 50) rankingLabel = "Top 50%";
      else rankingLabel = "Below 50%";

      bulkUpdates.push({
        updateOne: {
          filter: { userId: user.userId },
          update: {
            $set: {
              rank,
              percentile: Math.round(percentile),
              rankingLabel,
              lastScoreUpdatedAt: new Date()
            }
          }
        }
      });
    });

    // 🔹 5. Bulk update
    await CareerInsights.bulkWrite(bulkUpdates);

    console.log("✅ Batch ranking update completed");

    return {
      totalUsers,
      scoredUsers: usersWithoutScore.length
    };

  } catch (error) {
    console.error("❌ Batch ranking error:", error);
  }
};