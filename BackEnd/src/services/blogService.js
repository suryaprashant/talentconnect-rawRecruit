import Blog from "../models/blogModel.js";

export const createBlogService = async (payload) => {
  const blog = await Blog.create(payload);

  return {
    success: true,
    status: 201,
    data: blog,
  };
};

export const updateBlogService = async (blogId, payload) => {
  const blog = await Blog.findByIdAndUpdate(
    blogId,
    payload,
    { new: true }
  );

  if (!blog) {
    return {
      success: false,
      status: 404,
      message: "Blog not found",
    };
  }

  return {
    success: true,
    status: 200,
    data: blog,
  };
};

export const getAllBlogsService = async () => {
  const blogs = await Blog.find({ isPublished: true })
    .sort({ createdAt: -1 });

  return {
    success: true,
    status: 200,
    count: blogs.length,
    data: blogs,
  };
};

export const deleteBlogService = async (blogId) => {
  const blog = await Blog.findByIdAndDelete(blogId);

  if (!blog) {
    return {
      success: false,
      status: 404,
      message: "Blog not found",
    };
  }

  return {
    success: true,
    status: 200,
    message: "Blog deleted successfully",
  };
};