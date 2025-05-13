// src/models/createProfileModel.js
import mongoose from "mongoose";

const createProfileSchema = new mongoose.Schema({
  resume: String,
  name: String,
  email: String,
  mobile: String,
  profileType: {
    type: String,
    enum: ['student', 'fresher', 'professional'],
  },

  // Education
  college: String,
  degree: String,
  currentSemester: String,
  specialization: String,
  currentCgpa: String,
  degreeCertificate: String,

  // Career Goals
  industryTypes: [String],
  jobRoles: [String],
  preferredLocations: [String],
  lookingFor: {
    type: String,
    enum: ['job', 'internship', 'both'],
  },
  employmentType: {
    type: String,
    enum: ['part-time', 'full-time', 'contract'],
  },

  // Final Details
  skills: [String],
  certifications: [String],
  linkedin: String,
  github: String,
  portfolio: String,
  project: String,
  referralSource: String,
}, {
  timestamps: true
});

export default mongoose.model("CreateProfile", createProfileSchema);
