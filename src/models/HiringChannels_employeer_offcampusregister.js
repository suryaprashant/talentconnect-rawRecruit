import mongoose from "mongoose";

const HiringSchema = new mongoose.Schema(
  {
    offCampusHiringVenue: {
      type: String,
      required: false,
    },
    studentStreamDegree: {
      type: [String], // multiple select
      required: true,
    },
    criteria: {
      type: String,
      required: false,
    },
    minimumPackageOffered: {
      amount: { type: Number },
      currency: { type: String, default: "USD" },
    },
    workLocation: {
      type: [String], // multiple select
      required: false,
    },
    jobRole: {
      type: [String], // multiple select
      required: false,
    },
    workMode: {
      type: String,
      enum: ["Hybrid", "On-site", "Remote"],
      required: true,
    },
    employmentType: {
      type: String,
      enum: ["Part-time", "Full-time", "Contract"],
      required: true,
    },
    tentativeHiringDate: {
      startDate: { type: Date },
      endDate: { type: Date },
    },
    numberOfRounds: {
      type: [String], // could be numeric if needed
      required: false,
    },
    processOfSelection: {
      type: [String],
      required: false,
    },
    contactPerson: {
      name: { type: String, required: false },
      designation: { type: String, required: true },
      email: { type: String, required: true },
      mobileNo: { type: String, required: true },
      linkedInProfile: { type: String },
    },
    minimumStudentsToBeHired: {
      type: [String], // or Number[] if needed
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("HiringForm", HiringSchema);
