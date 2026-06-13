import mongoose from "mongoose";

const companyATSSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    companySlug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    companyNormalized: {
      type: String,
      required: true,
    },

    atsType: {
      type: String,
      enum: ["greenhouse", "lever", "workday", "custom", "unknown"],
      required: true,
      default: "unknown",
    },

    greenhouseSlug: {
      type: String,
      default: "",
    },

    leverSlug: {
      type: String,
      default: "",
    },

    careersPageUrl: {
      type: String,
      default: "",
    },

    apiUrl: {
      type: String,
      default: "",
    },

    logoUrl: String,
    industry: String,
    headquartersCity: String,
    employeeCount: String,

    lastVerifiedAt: Date,

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

companyATSSchema.index({ companyName: "text" });

export default mongoose.models.CompanyATS ||
  mongoose.model("CompanyATS", companyATSSchema);