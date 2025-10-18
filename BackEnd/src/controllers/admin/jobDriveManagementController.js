import {getTotalJobPostedCount} from "../../services/jobPostingService.js";

export const getJobDriveOverViewUserBoardOverView = async (req, res) => {
  try {
    const [
      all,
      companies,
      colleges,
      candidates
    ] = await Promise.all([
      getStatusCountByUserType(),
      getStatusCountByUserType("company"),
      getStatusCountByUserType("college"),
      getStatusCountByUserType({ $in: ['candidate', 'student', 'fresher', 'professional', 'employer'] })
    ]);

    return res.status(200).json({
      success: true,
      message: "User status counts fetched successfully",
      data: {
        all,
        companies,
        colleges,
        candidates
      }
    });
  } catch (error) {
    console.error("Error fetching user status counts:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};