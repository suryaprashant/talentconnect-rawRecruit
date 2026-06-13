import { createBlogService, updateBlogService, deleteBlogService } from "../../services/blogService.js";
import { streamUpload } from "../../utils/streamUpload.js";

export const createBlog = async (req, res) => {
  try {
    let payload = { ...req.body };

    //  Handle image upload
    if (req.file) {
      const result = await streamUpload(
        req.file.buffer,
        "blogs",
        req.file.mimetype
      );

      payload.coverImage = result.secure_url;
    }

    const result = await createBlogService(payload);

    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Create Blog Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { blogId } = req.params;

    let payload = { ...req.body };

    //  Handle new image (optional)
    if (req.file) {
      const result = await streamUpload(
        req.file.buffer,
        "blogs",
        req.file.mimetype
      );

      payload.coverImage = result.secure_url;
    }

    const result = await updateBlogService(blogId, payload);

    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Update Blog Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { blogId } = req.params;

    const result = await deleteBlogService(blogId);

    return res.status(result.status).json(result);
  } catch (error) {
    console.error("Delete Blog Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};