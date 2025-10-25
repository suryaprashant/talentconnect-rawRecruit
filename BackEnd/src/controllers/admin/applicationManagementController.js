import { getAll, getTotalJobApplicationSubmited } from "../../services/applicationService.js";
import Application from "../../models/applicationModel.js";

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
 * @desc    Get all applications with pagination and filtering
 * @route   POST /api/admin/application/applications-board
 * @access  Private (Admin)
 */
export const getApplicationsBoardOverView = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", status = "all" } = req.body;

    // Build filter
    const filter = {};

    if (status && status !== "all") {
      filter.currentStatus = status;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch applications with pagination and populate references
    const applications = await Application.find(filter)
      .populate({
        path: 'job',
        select: 'jobTitle location companyPosted',
        populate: {
          path: 'companyPosted',
          select: 'companyName'
        }
      })
      .populate({
        path: 'applicant',
        select: 'name email firstName lastName'
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Format applications with proper field names
    const formattedApplications = applications.map(app => ({
      _id: app._id,
      candidateName: app.applicant?.name || app.applicant?.firstName + ' ' + app.applicant?.lastName || 'N/A',
      candidateEmail: app.applicant?.email || 'N/A',
      jobTitle: app.job?.jobTitle || 'N/A',
      companyName: app.job?.companyPosted?.companyName || 'N/A',
      currentStatus: app.currentStatus,
      createdAt: app.createdAt
    }));

    // Get total count for pagination
    const totalApplications = await Application.countDocuments(filter);

    // Get counts by status
    const [
      totalCount,
      appliedCount,
      shortlistedCount,
      acceptedCount,
      rejectedCount
    ] = await Promise.all([
      getTotalJobApplicationSubmited(),
      getTotalJobApplicationSubmited({
        currentStatus: { $in: ["Applied", "Application Sent", "Awaiting Recruiter Action"] }
      }),
      getTotalJobApplicationSubmited({
        currentStatus: { $in: ["Shortlisted", "Interview Scheduled"] }
      }),
      getTotalJobApplicationSubmited({
        currentStatus: { $in: ["Offer Extended", "Accepted"] }
      }),
      getTotalJobApplicationSubmited({
        currentStatus: "Rejected"
      })
    ]);

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
        statistics: {
          total: totalCount,
          applied: appliedCount,
          shortlisted: shortlistedCount,
          accepted: acceptedCount,
          rejected: rejectedCount
        }
      }
    });
  } catch (error) {
    console.error("Error fetching applications board overview:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
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