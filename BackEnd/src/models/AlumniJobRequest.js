import mongoose from "mongoose";

const careerPageReferralRequestSchema = new mongoose.Schema(
  {
    senderUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
      index: true,
    },

    receiverUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
      index: true,
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    careerPageUrl: {
      type: String,
      required: true,
      trim: true,
    },

    senderProfile: {
      type: Object,
      default: {},
    },

    receiverProfile: {
      type: Object,
      default: {},
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

careerPageReferralRequestSchema.index(
  { senderUserId: 1, receiverUserId: 1, careerPageUrl: 1 },
  { unique: true }
);

export default mongoose.models.CareerPageReferralRequest ||
  mongoose.model("CareerPageReferralRequest", careerPageReferralRequestSchema);