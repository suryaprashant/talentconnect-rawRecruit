import {
  getUserCount,
  getCompanyCount,
  getCollegeCount,
  getCandidateCount,
  getStatusCountByUserType,
} from "../../services/authService.js";
import {getTotalJobPostedCount} from "../../services/jobPostingService.js";
import {getTotalJobApplicationSubmited} from "../../services/applicationService.js";

/**
 * @desc    Get Admin Dashboard Overview
 * @route   GET /api/admin/overview
 * @access  Private (Admin)
 */
export const getAdminDashboardOverView = async (req, res) => {
  try {
    console.log("I reached controller");
    
    const [
      totalUsers,
      totalCompanies,
      totalColleges,
      totalCandidates,
      statusCounts,
      totalOpenJobs,
      totalJobApplicationSubmission,
    ] = await Promise.all([
      getUserCount(),
      getCompanyCount(),
      getCollegeCount(),
      getCandidateCount(),
      getStatusCountByUserType(),   // returns { total, active, pending, blocked }
      getTotalJobPostedCount(),
      getTotalJobApplicationSubmited(),
    ]);

    const totalActiveUsers = statusCounts.active; 

    return res.status(200).json({
      success: true,
      message: "Admin dashboard overview",
      data: {
        totalUsers,
        totalCompanies,
        totalColleges,
        totalCandidates,
        // totalApplications: totalCandidates + totalCompanies + totalColleges,
        totalActiveUsers,
        totalOpenJobs,
        totalJobApplicationSubmission,
      }
    });
  } catch (error) {
    console.error("Admin Dashboard Overview Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

