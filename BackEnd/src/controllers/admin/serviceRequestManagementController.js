import {
  getAll,
  getTotalServiceRequestCount
} from "../../services/serviceRequestService.js";

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
