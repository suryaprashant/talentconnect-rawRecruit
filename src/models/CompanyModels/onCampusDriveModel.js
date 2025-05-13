// models/CompanyModels/onCampusDriveModel.js
/*
import mongoose from "mongoose";

const onCampusDriveSchema = new mongoose.Schema(
  {
    collegeLogo: {
      type: String, // URL (Cloudinary or similar)
      required: true,
    },
    collegeName: {
      type: String,
      required: true,
      trim: true,
    },
    nirfRanking: {
      type: Number,
    },
    location: {
      type: String,
      required: true,
    },
    placementRate: {
      type: String, // Example: "80%", "75.5%"
      required: true,
    },
    highestPackage: {
      type: String, // Example: "25 LPA"
      required: true,
    },
    averagePackage: {
      type: String, // Example: "7.5 LPA"
      required: true,
    },
    eligibleBranches: {
      type: [String], // Example: ["CSE", "ECE", "IT"]
      required: true,
    },
    eligibleStudentCount: {
      type: Number,
      required: true,
    },
    proposedStartDate: {
      type: Date,
      required: true,
    },
    proposedEndDate: {
      type: Date,
      required: true,
    },
    companyProfilePDF: {
      type: String, // Cloudinary or other file link
      required: true,
    },
    jobDescriptionPDF: {
      type: String, // Cloudinary or other file link
      required: true,
    },
    facilitiesRequired: {
      type: [String], // Example: ["Projector", "Wi-Fi", "Lab"]
      default: [],
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected", "Shortlisted"],
      default: "Pending",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // or "Company"
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("OnCampusDrive", onCampusDriveSchema);*/
