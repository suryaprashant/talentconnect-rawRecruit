import { getTotalJobPostedCount, getAll } from "../../services/jobPostingService.js";
import HackathonHostingService from "../../services/hackathonHostingService.js";
import WorkShopHostingService from "../../services/workshopService.js";
import CaseStudyHostingService from "../../services/casestudyService.js";
import { JobPostingTable } from "../../models/jobPostingsModel.js";
import { getPendingReferralJobsService, updateReferralApprovalStatusService } from "../../services/adminService.js";
import { ok } from "assert";

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

    // Add search functionality
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      
      // Create a complex filter for searching across multiple fields
      filter.$or = [
        { jobTitle: searchRegex },
        { jobRoles: { $in: [searchRegex] } },
        { studentStreams: { $in: [searchRegex] } },
        { skills: { $in: [searchRegex] } },
        { jobType: searchRegex },
        { location: searchRegex },
        { venue: searchRegex }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch jobs with pagination and populate company, college, and candidate info
    const jobs = await JobPostingTable.find(filter)
      .populate({
        path: 'companyPosted',
        select: 'companyDetails.companyName employerDetails.name'
      })
      .populate({
        path: 'collegePosted',
        select: 'collegeUniversityDetails.collegeName placementCoordinatorDetails.coordinatorName'
      })
      .populate({
        path: 'candidatePosted',
        select: 'name'
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Format jobs with proper field names
    const formattedJobs = jobs.map(job => {
      // Get job title - try multiple sources
      let jobTitle = 'N/A';
      
      if (job.jobTitle) {
        jobTitle = job.jobTitle;
      } else if (job.jobRoles && job.jobRoles.length > 0) {
        jobTitle = job.jobRoles[0];
      } else if (job.studentStreams && job.studentStreams.length > 0) {
        // For college jobs, use student stream as fallback
        jobTitle = job.studentStreams[0];
      } else if (job.skills && job.skills.length > 0) {
        // Use primary skill as fallback
        jobTitle = `${job.skills[0]} Position`;
      } else if (job.jobType) {
        // Last resort: use job type
        jobTitle = job.jobType;
      }
      
      // Get poster name based on who posted (company, college, or candidate)
      let posterName = 'N/A';
      
      if (job.companyPosted) {
        posterName = job.companyPosted.companyDetails?.companyName || 
                    job.companyPosted.employerDetails?.name || 
                    'N/A';
      } else if (job.collegePosted) {
        posterName = job.collegePosted.collegeUniversityDetails?.collegeName || 
                    job.collegePosted.placementCoordinatorDetails?.coordinatorName || 
                    'N/A';
      } else if (job.candidatePosted) {
        posterName = job.candidatePosted.name || 'N/A';
      }
      
      // Get location - join array or use venue or single value
      let location = 'N/A';
      if (Array.isArray(job.location) && job.location.length > 0) {
        location = job.location.join(', ');
      } else if (job.venue) {
        location = job.venue;
      } else if (job.location) {
        location = job.location;
      }

      return {
        _id: job._id,
        jobTitle,
        companyName: posterName, // Using generic name since it could be company/college/candidate
        location,
        jobType: job.jobType || 'N/A',
        jobStatus: job.jobStatus || 'Pending',
        createdAt: job.createdAt
      };
    });

    // Get total count for pagination
    const totalJobs = await JobPostingTable.countDocuments(filter);

    // Get counts by type - show all jobs regardless of status for admin overview
    const [
      totalCount,
      internshipCount,
      oncampusCount,
      offcampusCount,
      poolCampusCount,
      jobListingCount,
      referralCount
    ] = await Promise.all([
      JobPostingTable.countDocuments({}), // Total jobs (all statuses)
      JobPostingTable.countDocuments({ jobType: "Internship" }),
      JobPostingTable.countDocuments({ jobType: "On-campus" }),
      JobPostingTable.countDocuments({ jobType: "Off-campus" }),
      JobPostingTable.countDocuments({ jobType: "Pool-campus" }),
      JobPostingTable.countDocuments({ jobType: "Job-listing" }),
      JobPostingTable.countDocuments({ jobType: "Referral" })
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
          internship: internshipCount,
          oncampus: oncampusCount,
          offcampus: offcampusCount,
          poolCampus: poolCampusCount,
          jobListing: jobListingCount,
          referral: referralCount
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

export const getPendingReferralJobsForAdmin = async (req, res) => {
  try {
    // 1. Authorization
    if (req.user.userType !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    // 2. Call service
    const jobs = await getPendingReferralJobsService();

    // 3. Response
    return res.status(200).json({
      count: jobs.length,
      data: jobs
    });

  } catch (error) {
    console.error(
      "Error in getPendingReferralJobsForAdmin:",
      error.message
    );
    return res.status(500).json({ error: "Internal server error" });
  }
};


export const updateReferralJobApprovalStatus = async (req, res) => {
  try {
    console.log('ok')
    const { jobId } = req.params;
    const { approvalStatus } = req.body;
    console.log(approvalStatus)

    // Basic validation
    if (!["Approved", "Rejected", "Pending"].includes(approvalStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid approval status",
      });
    }

    const updatedJob = await updateReferralApprovalStatusService(
      jobId,
      approvalStatus
    );

    if (!updatedJob) {
      return res.status(404).json({
        success: false,
        message: "Referral job not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Referral job ${approvalStatus.toLowerCase()} successfully`,
      data: updatedJob,
    });
  } catch (error) {
    console.error("Error updating referral approval:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
