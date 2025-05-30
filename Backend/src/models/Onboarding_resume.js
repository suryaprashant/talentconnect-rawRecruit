import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  fileUrl: String,
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Resume", resumeSchema);
