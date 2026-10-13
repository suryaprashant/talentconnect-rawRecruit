import {
  toggleLikeService,
  toggleSaveService,
  getReactionService,
} from "../services/blogReactionService.js";

/**
 * Toggle Like
 */
export const toggleLike = async (req, res) => {
  try {
    const { blogId } = req.params;
    const userId = req.user._id;

    const result = await toggleLikeService(blogId, userId);

    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Toggle Like Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Toggle Save
 */
export const toggleSave = async (req, res) => {
  try {
    const { blogId } = req.params;
    const userId = req.user._id;

    const result = await toggleSaveService(blogId, userId);

    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Toggle Save Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Get Current User Reaction
 */
export const getReaction = async (req, res) => {
  try {
    const { blogId } = req.params;
    const userId = req.user._id;

    const result = await getReactionService(blogId, userId);

    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Get Reaction Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};