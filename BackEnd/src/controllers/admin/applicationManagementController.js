import { getAll,getTotalJobApplicationSubmited } from "../../services/applicationService.js";

export const getApplicationOverView = async (req, res) => {
  try {
    const [
      total,
      totalApplied,
      totalShortListed,
      totalAccepted,
      totalRejected,
    ] = await Promise.all([
      getTotalJobApplicationSubmited(),
      getTotalJobApplicationSubmited({
        currentStatus: { $in: ["Applied", "Application Sent", "Awaiting Recruiter Action"] }
      }),
      getTotalJobApplicationSubmited({
        currentStatus: { $in: ["Shortlisted", "Interview Scheduled", "Offer Extended"] }
      }),
      getTotalJobApplicationSubmited({
        currentStatus: { $in: ["Offer Extended", "Accepted"] }
      }),
      getTotalJobApplicationSubmited({
        currentStatus: "Rejected"
      }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Application overview fetched successfully",
      data: {
        total,
        totalApplied,
        totalShortListed,
        totalAccepted,
        totalRejected
      }
    });
  } catch (error) {
    console.error("Error fetching application overview:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAllApplications = async (req, res) => {
  try {
    const applications = await getAll();

    return res.status(200).json({
      success: true,
      message: "Applications fetched successfully",
      data: applications,
    });
  } catch (error) {
    console.error("❌ Error in getAllApplications controller:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error while fetching applications",
      error: error.message,
    });
  }
};