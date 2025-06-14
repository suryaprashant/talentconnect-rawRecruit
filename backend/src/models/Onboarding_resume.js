import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  fileUrl: String,
  uploadedAt: { type: Date, default: Date.now },
});

const Resume = mongoose.models.Resume || mongoose.model("Resume", resumeSchema);

export default Resume;
