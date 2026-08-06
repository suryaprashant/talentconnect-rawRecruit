import Blog from "../models/blogModel.js";
import BlogReaction from "../models/BlogReaction.js"

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

export const getBlogByIdService = async (blogId) => {
  try {
    const blog = await Blog.findById(blogId).lean();

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

  } catch (error) {
    console.error("Get Blog By ID Service Error:", error);

    throw error;
  }
};




export const getSavedBlogsService = async(userId)=>{


const savedBlogs = await BlogReaction.find({
 userId,
 saved:true
})
.populate("blogId")
.lean();



const blogs = savedBlogs.map(item=>item.blogId);



return {

success:true,
status:200,
data:blogs

};


}