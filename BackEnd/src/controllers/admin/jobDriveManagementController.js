import { getTotalJobPostedCount, getAll } from "../../services/jobPostingService.js";
import HackathonHostingService from "../../services/hackathonHostingService.js";
import WorkShopHostingService from "../../services/workshopService.js";
import CaseStudyHostingService from "../../services/casestudyService.js";
import { JobPostingTable } from "../../models/jobPostingsModel.js";

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

    const totalEventInvitation = totalHackathon + totalWorkshop + totalCaseStudy;

    return res.status(200).json({
      success: true,
      message: "Job drive overview fetched successfully",
      data: {
        total,
        totalJobInvitation,
        totalInterInvitation,
        totalOffCampusDrives,
        totalOnCampusDrives,
        totalEventInvitation,
        totalHackathon,
        totalWorkshop,
        totalCaseStudy
      }
    });
  } catch (error) {
    console.error("Error fetching job drive overview:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * @desc    Get all jobs with pagination and filtering
 * @route   POST /api/admin/job-n-drive/jobs-board
 * @access  Private (Admin)
 */
export const getJobsBoardOverView = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", jobType = "all" } = req.body;

    // Build filter
    const filter = {};

    if (jobType && jobType !== "all") {
      filter.jobType = jobType;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch jobs with pagination and populate company info
    const jobs = await JobPostingTable.find(filter)
      .populate({
        path: 'companyPosted',
        select: 'companyName'
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Format jobs with proper field names
    const formattedJobs = jobs.map(job => ({
      _id: job._id,
      jobTitle: job.jobTitle || 'N/A',
      companyName: job.companyPosted?.companyName || 'N/A',
      location: Array.isArray(job.location) ? job.location.join(', ') : job.location || 'N/A',
      jobType: job.jobType || 'N/A',
      jobStatus: job.jobStatus || 'Pending',
      createdAt: job.createdAt
    }));

    // Get total count for pagination
    const totalJobs = await JobPostingTable.countDocuments(filter);

    // Get counts by type
    const [
      totalCount,
      fullTimeCount,
      internshipCount,
      oncampusCount,
      offcampusCount
    ] = await Promise.all([
      getTotalJobPostedCount(),
      getTotalJobPostedCount({ jobType: "Full-time" }),
      getTotalJobPostedCount({ jobType: "Internship" }),
      getTotalJobPostedCount({ jobType: "On-campus" }),
      getTotalJobPostedCount({ jobType: "Off-campus" })
    ]);

    return res.status(200).json({
      success: true,
      message: "Jobs board overview fetched successfully",
      data: {
        jobs: formattedJobs,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalJobs / limit),
          totalJobs,
          jobsPerPage: parseInt(limit)
        },
        statistics: {
          total: totalCount,
          fullTime: fullTimeCount,
          internship: internshipCount,
          oncampus: oncampusCount,
          offcampus: offcampusCount
        }
      }
    });
  } catch (error) {
    console.error("Error fetching jobs board overview:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
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