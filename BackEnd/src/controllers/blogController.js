import {
  getAllBlogsService,
  getBlogByIdService,
   getSavedBlogsService
} from "../services/blogService.js";
import Blog from "../models/blogModel.js";

export const getAllBlogs = async (req, res) => {
  try {
    const result = await getAllBlogsService();

    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Get Blogs Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const { blogId } = req.params;

    const result = await getBlogByIdService(blogId);

    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Get Blog By ID Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getSavedBlogs = async (req, res) => {
  try {
    const userId = req.user._id;

    const result = await getSavedBlogsService(userId);

    return res.status(result.status).json(result);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
