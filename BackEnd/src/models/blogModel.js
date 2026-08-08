import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      default: "",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
    author: {
      type: String,
      default: "Admin",
    },
    tags: [String],
    isPublished: {
      type: Boolean,
      default: true,
    },
    likes: {
      type: Number,
      default: 0,
    },

    saves: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Blog", blogSchema);
