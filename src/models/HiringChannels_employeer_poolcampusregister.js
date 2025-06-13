import mongoose from "mongoose";
const { Schema } = mongoose;

const placementRequestSchema = new Schema({
  poolCampusHiringVenue: {
    type: String,
    required: true,
  },
  typeOfCollege: {
    type: [String],
    required: true,
  },
  studentStream: {
    type: [String],
    required: true,
  },
  criteria: {
    type: String,
  },
  minimumPackageOffered: {
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "USD",
    },
  },
  workLocation: {
    type: [String],
    required: true,
  },
  jobRole: {
    type: [String],
    required: true,
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
  placementStartDate: {
    type: Date,
    required: true,
  },
  placementEndDate: {
    type: Date,
    required: true,
  },
  numberOfRounds: {
    type: [String],
    required: true,
  },
  processOfSelection: {
    type: [String],
    required: true,
  },
  contactPersonName: {
    type: String,
    required: true,
  },
  contactPersonDesignation: {
    type: String,
    required: true,
  },
  contactPersonEmail: {
    type: String,
    required: true,
  },
  contactPersonMobile: {
    type: String,
    required: true,
  },
  contactPersonLinkedIn: {
    type: String,
  },
  minimumStudentsToBeHired: {
    type: [String],
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

const PlacementRequest = mongoose.model(
  "PlacementRequest",
  placementRequestSchema,
  "placement_requests"
);

export default PlacementRequest;
