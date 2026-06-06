import mongoose from "mongoose";

const companyMasterSchema = new mongoose.Schema(
  {
    canonical_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },

    display_name: {
      type: String,
      required: true,
    },

    short_name: String,

    type: {
      type: String,
      default: "other",
    },

    country: {
      type: String,
      default: "India",
    },

    aliases: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
    collection: "companies_master",
  }
);

companyMasterSchema.index({ aliases: 1 });

export default mongoose.model(
  "CompanyMaster",
  companyMasterSchema
);