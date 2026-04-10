import { getAllBlogsService } from "../services/blogService.js";

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

