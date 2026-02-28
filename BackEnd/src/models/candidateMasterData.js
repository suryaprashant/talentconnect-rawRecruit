import mongoose from "mongoose";

const CandidatemasterDataSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        "JOB_ROLE",
        "INDUSTRY",
        "DEGREE",
        "STREAM",
        "SKILL",
        "LOCATION"
      ]
    },
    value: {
      type: String,
      required: true,
      trim: true
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CandidatemasterData",
      default: null, // DEGREE name for STREAM
    },
    isCustom: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    }
  },
  { timestamps: true }
);

// Prevent duplicates like "SDE" & "sde"
CandidatemasterDataSchema.index(
  { type: 1, value: 1, parent: 1 },
  { unique: true }
);

export default mongoose.model("CandidateMasterData", CandidatemasterDataSchema);