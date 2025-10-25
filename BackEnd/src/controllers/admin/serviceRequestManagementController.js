import {
  getAll,
  getTotalServiceRequestCount
} from "../../services/serviceRequestService.js";
import ServiceRequest from "../../models/serviceRequestModel.js";

// Overview controller: Counts for various service request statuses
export const getServiceRequestOverView = async (req, res) => {
  try {
    const [
      totalRequests,
      totalPending,
      totalInProgress,
      totalCompleted,
      totalRejected,

      totalCareerCounseling,
      totalCareerCraft,
      totalMockInterview,
      totalSeminar,
      totalTrainingProgram,
      totalCampusBranding,
      totalCampusPlacement
    ] = await Promise.all([
      getTotalServiceRequestCount(),
      getTotalServiceRequestCount({ status: "Pending" }),
      getTotalServiceRequestCount({ status: "In Progress" }),
      getTotalServiceRequestCount({ status: "Completed" }),
      getTotalServiceRequestCount({ status: "Rejected" }),

      getTotalServiceRequestCount({ serviceRequestType: "careerCounseling" }),
      getTotalServiceRequestCount({ serviceRequestType: "careerCraft" }),
      getTotalServiceRequestCount({ serviceRequestType: "mockInterview" }),
      getTotalServiceRequestCount({ serviceRequestType: "seminar" }),
      getTotalServiceRequestCount({ serviceRequestType: "trainingProgram" }),
      getTotalServiceRequestCount({ serviceRequestType: "campusBranding" }),
      getTotalServiceRequestCount({ serviceRequestType: "campusPlacement" }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Service request overview fetched successfully",
      data: {
        // Status-based counts
        totalRequests,
        totalPending,
        totalInProgress,
        totalCompleted,
        totalRejected,

        // Type-based counts
        totalCareerCounseling,
        totalCareerCraft,
        totalMockInterview,
        totalSeminar,
        totalTrainingProgram,
        totalCampusBranding,
        totalCampusPlacement
      }
    });
  } catch (error) {
    console.error("❌ Error fetching service request overview:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * @desc    Get all service requests with pagination and filtering
 * @route   POST /api/admin/servicerequest/requests-board
 * @access  Private (Admin)
 */
export const getServiceRequestBoardOverView = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", status = "all", requestType = "all" } = req.body;

    // Build filter
    const filter = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    if (requestType && requestType !== "all") {
      filter.serviceRequestType = requestType;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch service requests with pagination and populate requester
    const requests = await ServiceRequest.find(filter)
      .populate({
        path: 'requester.id',
        select: 'name email companyName collegeName firstName lastName'
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Format requests with proper field names
    const formattedRequests = requests.map(req => ({
      _id: req._id,
      requesterName: req.requester?.id?.name || 
                     req.requester?.id?.companyName || 
                     req.requester?.id?.collegeName ||
                     (req.requester?.id?.firstName ? `${req.requester.id.firstName} ${req.requester.id.lastName || ''}`.trim() : 'N/A'),
      requesterEmail: req.requester?.id?.email || 'N/A',
      organizationName: req.requester?.id?.companyName || req.requester?.id?.collegeName || 'N/A',
      serviceRequestType: req.serviceRequestType || 'other',
      status: req.status || 'pending',
      createdAt: req.createdAt
    }));

    // Get total count for pagination
    const totalRequests = await ServiceRequest.countDocuments(filter);

    // Get counts by status
    const [
      totalCount,
      pendingCount,
      inProgressCount,
      completedCount,
      rejectedCount
    ] = await Promise.all([
      getTotalServiceRequestCount(),
      getTotalServiceRequestCount({ status: "pending" }),
      getTotalServiceRequestCount({ status: "approved" }),
      getTotalServiceRequestCount({ status: "completed" }),
      getTotalServiceRequestCount({ status: "rejected" })
    ]);

    return res.status(200).json({
      success: true,
      message: "Service requests board overview fetched successfully",
      data: {
        requests: formattedRequests,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalRequests / limit),
          totalServiceRequests: totalRequests,
          requestsPerPage: parseInt(limit)
        },
        statistics: {
          total: totalCount,
          pending: pendingCount,
          inProgress: inProgressCount,
          completed: completedCount,
          rejected: rejectedCount
        }
      }
    });
  } catch (error) {
    console.error("❌ Error fetching service requests board overview:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// List all service request applications
export const getAllServiceRequest = async (req, res) => {
  try {
    const serviceRequests = await getAll();

    return res.status(200).json({
      success: true,
      message: "Service requests fetched successfully",
      data: serviceRequests,
    });
  } catch (error) {
    console.error("❌ Error in getAllServiceRequest controller:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error while fetching service requests",
      error: error.message,
    });
  }
};