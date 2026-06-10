import {
  discoverCompanyJobsForCandidate,
  saveSelectedDiscoveredJob,
} from "../services/companyDiscoveryService.js";

export const discoverCompanyJobs = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id || req.body.userId;

    const companyName = String(req.body.companyName || "").trim();

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User ID not found.",
      });
    }

    if (!companyName) {
      return res.status(400).json({
        success: false,
        message: "companyName is required",
      });
    }

    const result = await discoverCompanyJobsForCandidate({
      userId,
      companyName,
    });

    return res.status(200).json({
      success: true,
      message: "Company jobs discovered successfully",
      data: result,
    });
  } catch (error) {
    console.error("discoverCompanyJobs error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to discover company jobs",
    });
  }
};

export const saveDiscoveredJob = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id || req.body.userId;

    const job = req.body.job || req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User ID not found.",
      });
    }

    if (!job || typeof job !== "object") {
      return res.status(400).json({
        success: false,
        message: "Job data is required",
      });
    }

    const savedJob = await saveSelectedDiscoveredJob({
      userId,
      job,
    });

    return res.status(201).json({
      success: true,
      message: "Discovered job saved successfully",
      job: savedJob,
    });
  } catch (error) {
    console.error("saveDiscoveredJob error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to save discovered job",
    });
  }
};