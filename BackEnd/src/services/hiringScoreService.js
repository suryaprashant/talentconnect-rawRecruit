import CareerInsights from "../models/careerInsightsModel.js";
import Application from "../models/applicationModel.js";
import Onboarding from "../models/studentonboardingModel.js";

export const calculateHiringScoreService = async (userId) => {
  try {
    //  1. Fetch career insights
    const insights = await CareerInsights.findOne({ userId }).lean();

    if (!insights) {
      console.warn("No CareerInsights found for user:", userId);
      return null;
    }

    const {
      resumeScore = 0,
      categorizedSkills = { highInDemand: [] }
    } = insights;

    //  2. PROFILE SCORE
    const highDemandCount = categorizedSkills?.highInDemand?.length || 0;

    let profileScore =
      (resumeScore * 0.7) + (Math.min(highDemandCount, 10) * 3);

    profileScore = Math.min(100, profileScore);

    //  3. ACTIVITY SCORE (last 3 days)
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const onboarding = await Onboarding.findOne({ userId }).lean();
    if (!onboarding) {
      console.warn("No onboarding found for user:", userId);
      return null;
    }
    //  only fetch required fields (performance)
    const recentApplications = await Application.find({
      applicant: onboarding._id,
      createdAt: { $gte: threeDaysAgo },
      currentStatus: { $ne: "Saved" } // important
    })
      .select("matchScore")
      .lean();
    console.log("Applications found:", recentApplications.length);
    console.log("Applications:", recentApplications);
    const applicationCount = recentApplications.length;

    let activityScore = 0;

    if (applicationCount >= 20) activityScore = 100;
    else activityScore = applicationCount * 5;

    //  4. APPLICATION QUALITY SCORE
    let avgMatchScore = 0;

    if (applicationCount > 0) {
      const totalMatch = recentApplications.reduce(
        (sum, app) => sum + (app.matchScore || 0),
        0
      );

      avgMatchScore = totalMatch / applicationCount;
    }

    const applicationQualityScore = avgMatchScore;

    //  5. FINAL HIRING SCORE
    const hiringScore =
      (profileScore * 0.5) +
      (activityScore * 0.2) +
      (applicationQualityScore * 0.3);

    //  6. INSIGHTS
    const insightsText = [];

    if (profileScore < 60) {
      insightsText.push("Improve your skills to increase profile strength");
    }

    if (activityScore < 50) {
      insightsText.push("Apply to more jobs regularly");
    }

    if (applicationQualityScore < 60) {
      insightsText.push("Apply to jobs that better match your skills");
    }

    const finalData = {
      hiringScore: Math.round(hiringScore),
      hiringBreakdown: {
        profileScore: Math.round(profileScore),
        activityScore: Math.round(activityScore),
        applicationQualityScore: Math.round(applicationQualityScore)
      },
      hiringInsights: insightsText
    };

    //  7. SAVE IN SAME MODEL (IMPORTANT)
    await CareerInsights.findOneAndUpdate(
      { userId },
      {
        $set: finalData
      },
      { new: true }
    );

    return finalData;

  } catch (error) {
    console.error("Hiring score calculation error:", error);
    return null;
  }
};