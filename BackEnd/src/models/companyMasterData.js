import mongoose from "mongoose";

const CompanyMasterDataSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        "COMPANY_DESIGNATION",
        "COMPANY_TYPE",
        "INDUSTRY_TYPE",
        "JOB_ROLE",
      ],
    },
    value: {
      type: String,
      required: true,
      trim: true,
    },

    // optional future use (like role → industry)
    parent: {
      type: String,
      default: null,
    },

    isCustom: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

// allow same value under different parent if needed
CompanyMasterDataSchema.index(
  { type: 1, value: 1, parent: 1 },
  { unique: true }
);

export default mongoose.model(
  "CompanyMasterData",
  CompanyMasterDataSchema
);

