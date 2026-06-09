import {
  discoverCompanyJobsForCandidate,
  getSavedDiscoveredJobs,
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

export const getDiscoveredJobs = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id || req.query.userId;

    const companyName = String(req.params.companyName || "").trim();

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User ID not found.",
      });
    }
    if (!companyName) {
      return res.status(401).json({
        success: false,
        message: "companyName required!",
      });
    }

    const jobs = await getSavedDiscoveredJobs({
      userId,
      companyName: companyName || undefined,
    });

    return res.status(200).json({
      success: true,
      message: "Discovered jobs fetched successfully",
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("getDiscoveredJobs error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get discovered jobs",
    });
  }
};
