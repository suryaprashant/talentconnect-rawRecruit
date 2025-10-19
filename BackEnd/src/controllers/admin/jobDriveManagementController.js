import { getTotalJobPostedCount , getAll} from "../../services/jobPostingService.js";
import HackathonHostingService from "../../services/hackathonHostingService.js";
import WorkShopHostingService from "../../services/workshopService.js";
import CaseStudyHostingService from "../../services/casestudyService.js";
export const getJobDriveOverView = async (req, res) => {
  try {
    const [
      total,
      totalJobInvitation,
      totalInterInvitation,
      totalOffCampusDrives,
      totalOnCampusDrives,
      totalHackathon,
      totalWorkshop,
      totalCaseStudy
    ] = await Promise.all([
      getTotalJobPostedCount(),
      getTotalJobPostedCount({ jobType: { $in: ["Pool-campus", "Job-listing", "Referral"] } }),
      getTotalJobPostedCount({ jobType: "Internship" }),
      getTotalJobPostedCount({ jobType: "Off-campus" }),
      getTotalJobPostedCount({ jobType: "On-campus" }),
      HackathonHostingService.getTotalHackathonCount(),
      WorkShopHostingService.getTotalWorkShopCount(),
      CaseStudyHostingService.getTotalCaseStudyCount(),
    ]);

    // ✅ Total event invitations is the sum of the three counts
    const totalEventInvitation = totalHackathon + totalWorkshop + totalCaseStudy;

    return res.status(200).json({
      success: true,
      message: "User status counts fetched successfully",
      data: {
        total,
        totalJobInvitation,
        totalInterInvitation,
        totalOffCampusDrives,
        totalOnCampusDrives,
        totalEventInvitation
      }
    });
  } catch (error) {
    console.error("Error fetching user status counts:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAllPositions = async (req, res) => {
  try {
    const jobs = await getAll();
    return res.status(200).json({
      success: true,
      message: "Job postings fetched successfully",
      data: jobs,
    });
  } catch (error) {
    console.error("❌ Error in getAllPositions controller:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error while fetching job postings",
      error: error.message,
    });
  }
};