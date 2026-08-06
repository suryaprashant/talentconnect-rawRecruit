import Blog from "../models/blogModel.js";
import BlogReaction from "../models/BlogReaction.js";

/**
 * Toggle Like
 */
export const toggleLikeService = async (blogId, userId) => {
  const blog = await Blog.findById(blogId);

  if (!blog) {
    return {
      success: false,
      status: 404,
      message: "Blog not found",
    };
  }

  let reaction = await BlogReaction.findOne({
    blogId,
    userId,
  });

  // First time reaction
  if (!reaction) {
    await BlogReaction.create({
      blogId,
      userId,
      liked: true,
      saved: false,
    });

    blog.likes += 1;
    await blog.save();

    return {
      success: true,
      status: 200,
      liked: true,
      likes: blog.likes,
    };
  }

  // Unlike
  if (reaction.liked) {
    reaction.liked = false;
    blog.likes = Math.max(0, blog.likes - 1);
  }
  // Like
  else {
    reaction.liked = true;
    blog.likes += 1;
  }

  await reaction.save();
  await blog.save();

  return {
    success: true,
    status: 200,
    liked: reaction.liked,
    likes: blog.likes,
  };
};

/**
 * Toggle Save
 */
export const toggleSaveService = async (blogId, userId) => {
  const blog = await Blog.findById(blogId);

  if (!blog) {
    return {
      success: false,
      status: 404,
      message: "Blog not found",
    };
  }

  let reaction = await BlogReaction.findOne({
    blogId,
    userId,
  });

  if (!reaction) {
    await BlogReaction.create({
      blogId,
      userId,
      liked: false,
      saved: true,
    });

    blog.saves += 1;
    await blog.save();

    return {
      success: true,
      status: 200,
      saved: true,
      saves: blog.saves,
    };
  }

  if (reaction.saved) {
    reaction.saved = false;
    blog.saves = Math.max(0, blog.saves - 1);
  } else {
    reaction.saved = true;
    blog.saves += 1;
  }

  await reaction.save();
  await blog.save();

  return {
    success: true,
    status: 200,
    saved: reaction.saved,
    saves: blog.saves,
  };
};

/**
 * Get Current User Reaction
 */
export const getReactionService = async (blogId, userId) => {
  const blog = await Blog.findById(blogId);

  if (!blog) {
    return {
      success: false,
      status: 404,
      message: "Blog not found",
    };
  }

  const reaction = await BlogReaction.findOne({
    blogId,
    userId,
  });

  return {
    success: true,
    status: 200,
    liked: reaction?.liked || false,
    saved: reaction?.saved || false,
    likes: blog.likes,
    saves: blog.saves,
  };
};