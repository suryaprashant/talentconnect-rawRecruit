import mongoose from "mongoose";

const blogReactionSchema = new mongoose.Schema(
  {
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },

    liked: {
      type: Boolean,
      default: false,
    },

    saved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

blogReactionSchema.index(
  {
    blogId: 1,
    userId: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.model(
  "BlogReaction",
  blogReactionSchema
);