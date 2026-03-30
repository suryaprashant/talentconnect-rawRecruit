import CareerInsights from "../models/careerInsightsModel.js";
import { calculateHiringScoreService } from "../services/hiringScoreService.js";
import { updateUserRanking } from "../services/rankingService.js";

export const getCareerInsightsWithHiringScore = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        error: "Unauthorized"
      });
    }

    const userId = req.user._id;

    // 🔹 STEP 1: Fetch insights
    let insights = await CareerInsights.findOne({ userId })
      .select(`
        categorizedSkills
        resumeScore
        missingSkills
        suggestions
        hiringScore
        hiringBreakdown
        hiringInsights
        lastAnalyzedAt
        updatedAt
      `)
      .lean();

    if (!insights) {
      return res.status(404).json({
        error: "Career insights not found"
      });
    }

    // 🔥 STEP 2: If hiringScore missing → calculate
    if (
      insights.hiringScore === undefined ||
      insights.hiringScore === null
    ) {
      console.log("⚙️ Hiring score missing → calculating...");

      await calculateHiringScoreService(userId);

      // 🔹 STEP 3: Fetch updated data
      insights = await CareerInsights.findOne({ userId })
        .select(`
          categorizedSkills
          resumeScore
          missingSkills
          suggestions
          hiringScore
          hiringBreakdown
          hiringInsights
          lastAnalyzedAt
          updatedAt
        `)
        .lean();
    }

    return res.status(200).json({
      success: true,
      data: insights
    });

  } catch (error) {
    console.error("Get career insights error:", error);

    return res.status(500).json({
      error: "Failed to fetch career insights"
    });
  }
};


export const getUserRanking = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        error: "Unauthorized"
      });
    }

    const userId = req.user._id;

    // 🔹 STEP 1: Fetch required fields
    let data = await CareerInsights.findOne({ userId })
      .select("hiringScore rank percentile rankingLabel")
      .lean();

    if (!data) {
      return res.status(404).json({
        error: "Career insights not found"
      });
    }

    // 🔥 STEP 2: Ensure hiringScore exists
    if (
      data.hiringScore === undefined ||
      data.hiringScore === null
    ) {
      console.log("⚙️ Hiring score missing → calculating...");

      await calculateHiringScoreService(userId);

      // re-fetch updated data
      data = await CareerInsights.findOne({ userId })
        .select("hiringScore rank percentile rankingLabel")
        .lean();
    }

    // 🔥 STEP 3: Ensure ranking exists
    if (
      data.rank === undefined ||
      data.rank === null
    ) {
      console.log("⚙️ Rank missing → calculating...");

      await updateUserRanking(userId);

      // re-fetch updated data
      data = await CareerInsights.findOne({ userId })
        .select("rank percentile rankingLabel")
        .lean();
    }

    return res.status(200).json({
      success: true,
      data: {
        rank: data.rank,
        percentile: data.percentile,
        rankingLabel: data.rankingLabel
      }
    });

  } catch (error) {
    console.error("Get ranking error:", error);

    return res.status(500).json({
      error: "Failed to fetch ranking"
    });
  }
};