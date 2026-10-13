import mongoose from "mongoose";

const discoveredCompanySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    careerUrl: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.DiscoveredCompany ||
  mongoose.model("Discoveredcompany", discoveredCompanySchema);
