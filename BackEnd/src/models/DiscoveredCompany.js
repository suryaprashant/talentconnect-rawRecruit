import mongoose from "mongoose";

const companyWithCareerSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    careerPageUrl: {
      type: String,
      required: true,
      trim: true,
    },

    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
    },
  },
  { timestamps: true }
);

export default mongoose.models.CompanyWithCareer ||
  mongoose.model("CompanyWithCareer", companyWithCareerSchema);