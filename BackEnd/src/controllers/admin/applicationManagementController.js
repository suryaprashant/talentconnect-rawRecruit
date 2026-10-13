import { getAll, getTotalJobApplicationSubmited } from "../../services/applicationService.js";
import Application from "../../models/applicationModel.js";
import { fetchReferralApplicationsService, getReferralApplicationsForAdminService, updateReferralApplicationStatusService } from "../../services/adminService.js";
import { notifyCandidateOnReferralApproval, notifyReferralJobPosterOnNewApplication } from "../../services/notificationService.js";

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

/**
 * @desc    Get all job applications with pagination and filtering
 * @route   POST /api/admin/application/applications-board
 * @access  Private (Admin)
 */
export const getApplicationsBoardOverView = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", status = "all", jobType = "all" } = req.body;

    console.log('Fetching applications with filters:', { page, limit, search, status, jobType });

    // Build filter for the unified Application collection
    const filter = {};

    if (status && status !== "all") {
      filter.currentStatus = status;
    }

    if (jobType && jobType !== "all") {
      // Map frontend jobType to database jobType
      const jobTypeMapping = {
        "off-campus": "Off-campus",
        "on-campus": "On-campus",
        "pool-campus": "Pool-campus"
      };
      filter.jobType = jobTypeMapping[jobType] || jobType;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    console.log('Querying unified Application collection with filter:', filter);

    // Use aggregation to handle dynamic population based on applicantType
    const applications = await Application.aggregate([
      { $match: filter },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: parseInt(limit) },
      // Lookup job details
      {
        $lookup: {
          from: "jobpostingtables",
          localField: "job",
          foreignField: "_id",
          as: "jobDetails"
        }
      },
      { $unwind: { path: "$jobDetails", preserveNullAndEmptyArrays: true } },
      // Lookup applicant from onboardings (for students/freshers/professionals)
      {
        $lookup: {
          from: "onboardings",
          localField: "applicant",
          foreignField: "_id",
          as: "userApplicant"
        }
      },
      // Lookup applicant from collegeonboardings
      {
        $lookup: {
          from: "collegeonboardings",
          localField: "applicant",
          foreignField: "_id",
          as: "collegeApplicant"
        }
      },
      // Lookup applicant from CompanyProfile
      {
        $lookup: {
          from: "companyprofiles",
          localField: "applicant",
          foreignField: "_id",
          as: "companyApplicant"
        }
      },
      // Lookup company details for the job
      {
        $lookup: {
          from: "companyprofiles",
          localField: "jobDetails.companyPosted",
          foreignField: "_id",
          as: "companyDetails"
        }
      }
    ]);

    console.log(`Found ${applications.length} applications from unified collection`);
    
    // Debug: Log first application to see the structure
    if (applications.length > 0) {
      console.log('First application sample:', JSON.stringify({
        applicantType: applications[0].applicantType,
        hasUserApplicant: applications[0].userApplicant?.length || 0,
        hasCollegeApplicant: applications[0].collegeApplicant?.length || 0,
        hasCompanyApplicant: applications[0].companyApplicant?.length || 0,
        hasJobDetails: !!applications[0].jobDetails,
        hasCompanyDetails: applications[0].companyDetails?.length || 0,
        collegeApplicantSample: applications[0].collegeApplicant?.[0] ? {
          keys: Object.keys(applications[0].collegeApplicant[0]),
          collegeName: applications[0].collegeApplicant[0].collegeUniversityDetails?.collegeName,
          email: applications[0].collegeApplicant[0].placementCoordinatorDetails?.officialEmail
        } : null,
        jobDetailsSample: applications[0].jobDetails ? {
          keys: Object.keys(applications[0].jobDetails),
          jobTitle: applications[0].jobDetails.jobTitle,
          jobRoles: applications[0].jobDetails.jobRoles,
          companyPosted: applications[0].jobDetails.companyPosted
        } : null,
        companyDetailsSample: applications[0].companyDetails?.[0] ? {
          keys: Object.keys(applications[0].companyDetails[0]),
          companyName: applications[0].companyDetails[0].companyDetails?.companyName || applications[0].companyDetails[0].companyName
        } : null
      }, null, 2));
    }

    // Apply search filter
    let filteredApplications = applications;
    if (search && search.trim()) {
      const searchLower = search.trim().toLowerCase();
      filteredApplications = applications.filter(app => {
        // Get applicant details based on applicantType
        let applicantName = 'N/A';
        let applicantEmail = 'N/A';

        if (app.applicantType === 'college' && app.collegeApplicant && app.collegeApplicant.length > 0) {
          const college = app.collegeApplicant[0];
          applicantName = college.collegeUniversityDetails?.collegeName || 'N/A';
          applicantEmail = college.placementCoordinatorDetails?.officialEmail || 'N/A';
        } else if ((app.applicantType === 'company' || app.applicantType === 'employer') && 
                   app.companyApplicant && app.companyApplicant.length > 0) {
          const company = app.companyApplicant[0];
          applicantName = company.companyDetails?.companyName || company.companyName || 'N/A';
          applicantEmail = company.employerDetails?.workEmail || company.email || 'N/A';
        } else if (app.userApplicant && app.userApplicant.length > 0) {
          const user = app.userApplicant[0];
          applicantName = user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A';
          applicantEmail = user.email || 'N/A';
        }

        // Get job details
        const jobTitle = app.jobDetails?.jobTitle || 
                        (Array.isArray(app.jobDetails?.jobRoles) && app.jobDetails.jobRoles.length > 0 ? 
                         app.jobDetails.jobRoles.join(', ') : 'N/A');
        const companyName = app.jobDetails?.companyName ||
                           (app.companyDetails && app.companyDetails.length > 0 ? 
                            (app.companyDetails[0].companyDetails?.companyName || app.companyDetails[0].companyName) : 
                            'N/A');

        const statusLower = (app.currentStatus || '').toLowerCase();

        return applicantName.toLowerCase().includes(searchLower) ||
               applicantEmail.toLowerCase().includes(searchLower) ||
               jobTitle.toLowerCase().includes(searchLower) ||
               companyName.toLowerCase().includes(searchLower) ||
               statusLower.includes(searchLower);
      });
    }

    // Sort by date (most recent first)
    filteredApplications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Get total count for pagination
    const totalApplications = search ? filteredApplications.length : await Application.countDocuments(filter);

    // Format applications
    const formattedApplications = filteredApplications.map(app => {
      // Get applicant details based on applicantType
      let candidateName = 'N/A';
      let candidateEmail = 'N/A';

      if (app.applicantType === 'college' && app.collegeApplicant && app.collegeApplicant.length > 0) {
        const college = app.collegeApplicant[0];
        candidateName = college.collegeUniversityDetails?.collegeName || 'N/A';
        candidateEmail = college.placementCoordinatorDetails?.officialEmail || 'N/A';
      } else if ((app.applicantType === 'company' || app.applicantType === 'employer') && 
                 app.companyApplicant && app.companyApplicant.length > 0) {
        const company = app.companyApplicant[0];
        candidateName = company.companyDetails?.companyName || company.companyName || 'N/A';
        candidateEmail = company.employerDetails?.workEmail || company.email || 'N/A';
      } else if (app.userApplicant && app.userApplicant.length > 0) {
        const user = app.userApplicant[0];
        candidateName = user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A';
        candidateEmail = user.email || 'N/A';
      }

      // Get job details - use jobPosted fields from JobPostingTable
      const jobTitle = app.jobDetails?.jobTitle || 
                      (Array.isArray(app.jobDetails?.jobRoles) && app.jobDetails.jobRoles.length > 0 ? 
                       app.jobDetails.jobRoles.join(', ') : 'N/A');
      
      // Company can come from companyPosted field
      let companyName = 'N/A';
      if (app.companyDetails && app.companyDetails.length > 0) {
        companyName = app.companyDetails[0].companyDetails?.companyName || 
                     app.companyDetails[0].companyName || 'N/A';
      }

      return {
        _id: app._id,
        candidateName,
        candidateEmail,
        jobTitle,
        companyName,
        currentStatus: app.currentStatus || 'Applied',
        jobType: app.jobType || 'N/A',
        createdAt: app.createdAt
      };
    });

    // Get counts by status from the unified collection
    const allAppsForCounts = await Application.find({}).select('currentStatus').lean();

    const statusCounts = {
      total: allAppsForCounts.length,
      applied: 0,
      shortlisted: 0,
      accepted: 0,
      rejected: 0
    };

    allAppsForCounts.forEach(app => {
      const status = (app.currentStatus || '').toLowerCase();
      if (['applied', 'application sent', 'awaiting recruiter action'].includes(status)) {
        statusCounts.applied++;
      } else if (['shortlisted', 'interview scheduled'].includes(status)) {
        statusCounts.shortlisted++;
      } else if (['offer extended', 'accepted'].includes(status)) {
        statusCounts.accepted++;
      } else if (status === 'rejected') {
        statusCounts.rejected++;
      }
    });

    return res.status(200).json({
      success: true,
      message: "Applications board overview fetched successfully",
      data: {
        applications: formattedApplications,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalApplications / limit),
          totalApplications,
          applicationsPerPage: parseInt(limit)
        },
        statistics: statusCounts
      }
    });
  } catch (error) {
    console.error("Error fetching applications board overview:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
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

// export const getReferralApplicationsForAdmin = async (req, res) => {
//   try {
//     console.log('reached here')
//     // optional query filters (future-ready)
//     const { jobId, adminApprovalStatus } = req.query;

//     if (!jobId) {
//       return res.status(400).json({
//         success: false,
//         message: "jobId is required",
//       });
//     }

//     const response = await fetchReferralApplicationsService({
//       jobId,
//       adminApprovalStatus,
//     });

//     return res.status(200).json(response);
//   } catch (error) {
//     console.error("❌ getReferralApplicationsForAdmin:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch referral applications",
//     });
//   }
// };
export const getReferralApplicationsForAdmin = async (req, res) => {
  try {
    const { jobId } = req.query;
    
    // Default to "Pending" so processed applications "disappear" from this view
    const adminApprovalStatus = req.query.adminApprovalStatus || "Pending";

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "jobId is required",
      });
    }

    const response = await fetchReferralApplicationsService({
      jobId,
      adminApprovalStatus, // Now passing "Pending" if nothing else is provided
    });

    return res.status(200).json(response);
  } catch (error) {
    console.error("❌ getReferralApplicationsForAdmin:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch referral applications",
    });
  }
};
//
export const updateReferralApplicationStatus = async (req, res) => {
  try {
    console.log('reached here')
    const { applicationId } = req.params;
    const { action,adminComment,rating } = req.body;

    if (!["Approved", "Rejected"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Invalid action",
      });
    }

    const response = await updateReferralApplicationStatusService({
      applicationId,
      action,
      adminComment,
      rating
    });

    // 🔔 Notify candidate
    await notifyCandidateOnReferralApproval({
      applicationId: response._id,
      applicantProfileId: response.applicant,
      applicantType: response.applicantType,
      action,
      adminAuthId: req.user._id
    });

    if (action === "Approved") {
      notifyReferralJobPosterOnNewApplication({
        jobId: response.job,
        applicationId: response._id,
        adminAuthId: req.user._id,
      }).catch((err) =>
        console.error("Referrer notification failed:", err.message)
      );
    }

    return res.status(200).json({
      success: true,
      message: `Application ${action.toLowerCase()} successfully`,
      data: response,
    });
  } catch (error) {
    console.error("❌ updateReferralApplicationStatus:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update application status",
    });
  }
};