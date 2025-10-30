import {
  getAll,
  getTotalServiceRequestCount
} from "../../services/serviceRequestService.js";
import ServiceRequest from "../../models/serviceRequestsModel.js";
import Notification from "../../models/notificationModel.js";
import Auth from "../../models/authModel.js";
import OnboardingModel from "../../models/studentonboardingModel.js";
import CompanyProfile from "../../models/companyDashboard/companyProfileModel.js";
import CollegeOnboarding from "../../models/collegeDashboard/collegeOnboardingModel.js";

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

    // Fetch service requests with pagination
    const serviceRequests = await ServiceRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Populate requester names from respective collections
    const formattedRequests = await Promise.all(
      serviceRequests.map(async (request) => {
        let requesterName = 'N/A';
        let requesterEmail = 'N/A';
        let organizationName = 'N/A';

        try {
          if (request.requester?.id) {
            const role = request.requester.role;
            const requesterId = request.requester.id;
            
            // First, get email from Auth model
            const authUser = await Auth.findById(requesterId).select('email name').lean();
            if (authUser) {
              requesterEmail = authUser.email || 'N/A';
            }
            
            if (role === 'company' || role === 'employer') {
              // Try to find by userId field first (CompanyProfile links via userId)
              let companyProfile = await CompanyProfile.findOne({ userId: requesterId })
                .select('employerDetails.name employerDetails.workEmail companyDetails.companyName')
                .lean();
              
              // If not found, try direct ID lookup
              if (!companyProfile) {
                companyProfile = await CompanyProfile.findById(requesterId)
                  .select('employerDetails.name employerDetails.workEmail companyDetails.companyName')
                  .lean();
              }
              
              if (companyProfile) {
                requesterName = companyProfile.companyDetails?.companyName || 
                               companyProfile.employerDetails?.name || 'N/A';
                requesterEmail = companyProfile.employerDetails?.workEmail || requesterEmail;
                organizationName = companyProfile.companyDetails?.companyName || 'N/A';
              }
            } else if (role === 'college') {
              // Try to find by userId field first
              let collegeProfile = await CollegeOnboarding.findOne({ userId: requesterId })
                .select('collegeUniversityDetails.collegeName placementCoordinatorDetails.coordinatorName placementCoordinatorDetails.coordinatorEmail')
                .lean();
              
              // If not found, try direct ID lookup
              if (!collegeProfile) {
                collegeProfile = await CollegeOnboarding.findById(requesterId)
                  .select('collegeUniversityDetails.collegeName placementCoordinatorDetails.coordinatorName placementCoordinatorDetails.coordinatorEmail')
                  .lean();
              }
              
              if (collegeProfile) {
                requesterName = collegeProfile.collegeUniversityDetails?.collegeName || 
                               collegeProfile.placementCoordinatorDetails?.coordinatorName || 'N/A';
                requesterEmail = collegeProfile.placementCoordinatorDetails?.coordinatorEmail || requesterEmail;
                organizationName = collegeProfile.collegeUniversityDetails?.collegeName || 'N/A';
              }
            } else if (['student', 'fresher', 'professional', 'candidate'].includes(role)) {
              // Try to find by userId field first
              let candidateProfile = await OnboardingModel.findOne({ userId: requesterId })
                .select('name email')
                .lean();
              
              // If not found, try direct ID lookup
              if (!candidateProfile) {
                candidateProfile = await OnboardingModel.findById(requesterId)
                  .select('name email')
                  .lean();
              }
              
              if (candidateProfile) {
                requesterName = candidateProfile.name || 'N/A';
                requesterEmail = candidateProfile.email || requesterEmail;
                organizationName = 'Individual';
              }
            }
          }
        } catch (error) {
          console.error(`Error fetching requester profile for ${request._id}:`, error);
        }

        return {
          _id: request._id,
          requesterName,
          requesterEmail,
          organizationName,
          serviceRequestType: request.serviceRequestType || 'other',
          status: request.status || 'pending',
          createdAt: request.createdAt,
          // Include original message and requested date/time so frontend can display them
          message: request.message || '',
          requestedDate: request.date || null,
          requestedTime: request.time || ''
        };
      })
    );

    // Apply search filter on formatted data
    let filteredRequests = formattedRequests;
    if (search && search.trim()) {
      const searchLower = search.trim().toLowerCase();
      filteredRequests = formattedRequests.filter(req => {
        return (req.requesterName || '').toLowerCase().includes(searchLower) ||
               (req.requesterEmail || '').toLowerCase().includes(searchLower) ||
               (req.organizationName || '').toLowerCase().includes(searchLower) ||
               (req.serviceRequestType || '').toLowerCase().includes(searchLower);
      });
    }

    // Get total count for pagination (with search applied)
    const totalRequests = search ? filteredRequests.length : await ServiceRequest.countDocuments(filter);

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
        requests: filteredRequests,
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

/**
 * @desc    Update service request status
 * @route   PATCH /api/admin/servicerequest/:requestId/status
 * @access  Private (Admin)
 */
export const updateServiceRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, meetingLink, notificationMessage } = req.body;

    // Validate status
    if (!["pending", "approved", "rejected", "completed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be pending, approved, rejected, or completed"
      });
    }

    // Update the service request
    const updatedRequest = await ServiceRequest.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    ).lean();

    if (!updatedRequest) {
      return res.status(404).json({
        success: false,
        message: "Service request not found"
      });
    }

    // Send notification to requester when approved
    if (status === 'approved' && updatedRequest.requester?.id) {
      try {
        const adminUser = req.user; // Admin user from auth middleware
        
        // Create notification message
        let message = notificationMessage || `Your service request for "${updatedRequest.serviceRequestType}" has been approved!`;
        
        if (meetingLink) {
          message += ` A meeting has been scheduled. Join here: ${meetingLink}`;
        }

        // Create notification
        const notification = new Notification({
          recipientId: updatedRequest.requester.id,
          senderId: adminUser._id,
          type: 'SERVICE_REQUEST_UPDATE',
          message: message,
          referenceId: updatedRequest._id,
          meetingLink: meetingLink || null,
          read: false
        });

        await notification.save();
        console.log(`Notification sent to user ${updatedRequest.requester.id} for request ${requestId}`);
      } catch (notifError) {
        console.error('Error sending notification:', notifError);
        // Don't fail the request update if notification fails
      }
    }

    return res.status(200).json({
      success: true,
      message: `Service request ${status} successfully`,
      data: updatedRequest
    });
  } catch (error) {
    console.error("Error updating service request status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};