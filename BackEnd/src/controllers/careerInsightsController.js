import CareerInsights from "../models/careerInsightsModel.js";
import { calculateHiringScoreService } from "../services/hiringScoreService.js";

export const getCareerInsightsWithHiringScore = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        error: "Unauthorized"
      });
    }

    const userId = req.user._id;

    // 🔥 STEP 1: Calculate latest hiring score
    await calculateHiringScoreService(userId);

    // 🔥 STEP 2: Fetch updated career insights
    const insights = await CareerInsights.findOne({ userId });

    if (!insights) {
      return res.status(404).json({
        error: "Career insights not found"
      });
    }

    res.status(200).json({
      success: true,
      data: insights
    });

  } catch (error) {
    console.error("Get career insights error:", error);

    res.status(500).json({
      error: "Failed to fetch career insights"
    });
  }
};