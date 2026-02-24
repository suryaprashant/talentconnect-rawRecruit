import {
  getUserCount,
  getCompanyCount,
  getCollegeCount,
  getCandidateCount,
  getStatusCountByUserType,
} from "../../services/authService.js";
import {getTotalJobPostedCount} from "../../services/jobPostingService.js";
import {getTotalJobApplicationSubmited} from "../../services/applicationService.js";
import InterviewSchedule from "../../models/InterviewSchedule.Model.js";
import { JobPostingTable } from "../../models/jobPostingsModel.js";

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


export async function scheduleInterviewByAdmin(req, res) {
  try {
    const adminAuthId = req.user._id;

    const {
      applicationId,
      jobId,
      applicantProfileId,
      applicantAuthId,
      applicantType,
      data,
    } = req.body;

    if (!data) {
      return res.status(400).json({ msg: "Interview data missing" });
    }

    const { date, time, meetLink, message } = data;

    // 🔒 ONE INTERVIEW RULE
    const alreadyScheduled = await InterviewSchedule.findOne({ applicationId });
    if (alreadyScheduled) {
      return res.status(400).json({ msg: "Interview already scheduled" });
    }

    // 🔹 Fetch job (for company name)
    const job = await JobPostingTable.findById(jobId)
      .populate("candidatePosted", "userId currentCompany");

    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }

    const companyAuthId = job.candidatePosted.userId;

    const companyName = job.candidatePosted?.currentCompany || "N/A";

    // 🔹 Applicant snapshot
    const applicantSnapshot = {
      name: req.body.applicantName || "",
      profileType: applicantType,
    };

    const interview = await InterviewSchedule.create({
      jobId,
      jobType: job.jobType || "Off-campus",
      applicationId,

      companyAuthId: companyAuthId, // 👈 admin scheduled

      applicantType,
      applicantAuthId,
      applicantProfileId,
      applicantSnapshot,

      companySnapshot: {
        companyName,
        scheduledBy: {
          name: "Admin",
          email: req.user.email,
          designation: "Admin",
        },
      },

      date,
      time,
      meetLink,
      message,
      status: "Scheduled",
      emailStatus: "PENDING",
    });

    return res.status(200).json({
      success: true,
      msg: "Interview scheduled by admin",
      data: interview,
    });

  } catch (err) {
    console.error("❌ admin schedule error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
}


//interview scheduled for afmin get call
export const getAdminScheduledInterviews = async (req, res) => {
  try {
    const adminEmail = req.user.email; // THIS is the only identifier you have

    const interviews = await InterviewSchedule.find({
      "companySnapshot.scheduledBy.designation": "Admin",
      "companySnapshot.scheduledBy.email": adminEmail,
    })
      .populate("jobId", "jobTitle jobType")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: interviews,
    });
  } catch (err) {
    console.error("getAdminScheduledInterviews error:", err);
    return res.status(500).json({ success: false });
  }
};