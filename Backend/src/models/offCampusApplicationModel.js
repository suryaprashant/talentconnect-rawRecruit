// src/models/companyModels/offCampusApplicationModel.js

import mongoose from "mongoose";

const offCampusApplicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    applicationStatus: {
      type: String,
      enum: ["Applied", "Shortlisted", "Rejected"],
      default: "Applied",
    },
    currentSalary: {
      type: String,
    },
    expectedSalary: {
      type: String,
    },
    portfolioLink: {
      type: String,
    },
    resumeLink: {
      type: String,
    },
    linkedinLink: {
      type: String,
    },
    skills: [String],
    languages: [String],
    industry: {
      type: String,
    },
    designation: {
      type: String,
    },
    experience: {
      type: String,
    },
    location: {
      type: String,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const OffCampusApplication = mongoose.model(
  "OffCampusApplication",
  offCampusApplicationSchema
);

export default OffCampusApplication;
