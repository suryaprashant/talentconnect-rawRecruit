import { getStatusCountByUserType } from "../../services/authService.js";
import Auth from "../../models/authModel.js";

/**
 * @desc    Get user count by status and type
 */
export const getUserBoardOverView = async (req, res) => {
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

/**
 * @desc    Get users board overview with statistics
 * @route   POST /api/admin/users-board
 * @access  Private (Admin)
 */
export const getUserBoardOverView = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", userType = "", status = "" } = req.body;

    // Build filter
    const filter = {};
    
    if (userType && userType !== "all") {
      if (userType === "candidate") {
        filter.userType = { $in: ['candidate', 'student', 'fresher', 'professional', 'employer'] };
      } else {
        filter.userType = userType;
      }
    }

    if (status && status !== "all") {
      filter.status = status;
    }

    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch users with pagination
    const users = await Auth.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalUsers = await Auth.countDocuments(filter);

    // Get status counts by type
    const [
      allCounts,
      companyCounts,
      collegeCounts,
      candidateCounts
    ] = await Promise.all([
      getStatusCountByUserType(),
      getStatusCountByUserType("company"),
      getStatusCountByUserType("college"),
      getStatusCountByUserType({ $in: ['candidate', 'student', 'fresher', 'professional', 'employer'] })
    ]);

    return res.status(200).json({
      success: true,
      message: "User board overview fetched successfully",
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalUsers / limit),
          totalUsers,
          usersPerPage: parseInt(limit)
        },
        statistics: {
          all: allCounts,
          companies: companyCounts,
          colleges: collegeCounts,
          candidates: candidateCounts
        }
      }
    });
  } catch (error) {
    console.error("Error fetching user board overview:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/**
 * @desc    Update user status (active/pending/blocked)
 * @route   PATCH /api/admin/users/:userId/status
 * @access  Private (Admin)
 */
export const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!["active", "pending", "blocked"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be active, pending, or blocked"
      });
    }

    const user = await Auth.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: user
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/**
 * @desc    Delete a user
 * @route   DELETE /api/admin/users/:userId
 * @access  Private (Admin)
 */
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await Auth.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
