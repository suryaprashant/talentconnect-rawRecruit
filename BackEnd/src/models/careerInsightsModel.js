import mongoose from "mongoose";

const careerInsightsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
      unique: true, // ✅ keep only this (remove schema.index)
    },

    categorizedSkills: {
      highInDemand: {
        type: [{ type: String, trim: true }],
        default: [],
      },
      growing: {
        type: [{ type: String, trim: true }],
        default: [],
      },
      saturated: {
        type: [{ type: String, trim: true }],
        default: [],
      },
      obsolete: {
        type: [{ type: String, trim: true }],
        default: [],
      },
    },

    resumeScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    suggestions: {
      type: [{ type: String, trim: true }],
      default: [],
    },

    missingSkills: {
      type: [{ type: String, trim: true }],
      default: [],
    },

    // 🔥 Hiring Score Fields
    hiringScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    hiringBreakdown: {
      profileScore: {
        type: Number,
        default: 0,
      },
      activityScore: {
        type: Number,
        default: 0,
      },
      applicationQualityScore: {
        type: Number,
        default: 0,
      },
    },

    // 🔥 ADD THIS (missing earlier)
    hiringInsights: {
      type: [{ type: String, trim: true }],
      default: [],
    },

    lastAnalyzedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true, versionKey: false }
);

// careerInsightsSchema.index({ userId: 1 }, { unique: true });

export default mongoose.models.CareerInsights ||
  mongoose.model("CareerInsights", careerInsightsSchema);