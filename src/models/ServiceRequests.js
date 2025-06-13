import mongoose from "mongoose";

const serviceemployeer = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    acceptTerms: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "workforce_info_requests", // Changed collection name
    timestamps: true,
  }
);

const ServiceRequestemployeer = mongoose.model(
  "ServiceRequest",
  serviceemployeer
);

export default ServiceRequestemployeer;
