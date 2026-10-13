import mongoose from "mongoose";

const collegeMasterDataSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["COLLEGE_DESIGNATION"], // add more later
    },
    value: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicates of same type + value
collegeMasterDataSchema.index({ type: 1, value: 1 }, { unique: true });

export default mongoose.model(
  "CollegeMasterData",
  collegeMasterDataSchema
);