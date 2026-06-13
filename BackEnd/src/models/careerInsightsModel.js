import mongoose from "mongoose";

const careerInsightsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
      unique: true,
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

    // 🔥 Hiring Score
    hiringScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    hiringBreakdown: {
      profileScore: { type: Number, default: 0 },
      activityScore: { type: Number, default: 0 },
      applicationQualityScore: { type: Number, default: 0 },
    },

    hiringInsights: {
      type: [{ type: String, trim: true }],
      default: [],
    },

    // 🔥 NEW: Ranking Fields
    rank: {
      type: Number,
      default: null,
      index: true, // ⚡ helps leaderboard queries
    },

    percentile: {
      type: Number,
      default: null,
    },

    rankingLabel: {
      type: String,
      enum: ["Top 10%", "Top 20%", "Top 50%", "Below 50%"],
      default: null,
    },

    // 🔥 Useful for debugging & freshness
    lastScoreUpdatedAt: {
      type: Date,
      default: null,
    },

    lastAnalyzedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true, versionKey: false }
);

// 🔥 IMPORTANT INDEX (for ranking performance)
careerInsightsSchema.index({ hiringScore: -1 });

export default mongoose.models.CareerInsights ||
  mongoose.model("CareerInsights", careerInsightsSchema);