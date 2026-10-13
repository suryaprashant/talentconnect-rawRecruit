import mongoose from "mongoose";

const parsedResumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    resumeUrl: String,

    parsedData: {
      type: Object,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("ParsedResume", parsedResumeSchema);