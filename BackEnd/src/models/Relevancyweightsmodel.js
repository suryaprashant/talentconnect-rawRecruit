import mongoose from "mongoose";

/**
 * RelevancyWeights — stores the scoring weights used by the job-relevancy engine.
 * Only ONE document should ever exist (singleton). The admin PATCH API always
 * upserts this single record.
 *
 * All weight values are stored as plain numbers (0-100).
 * The controller validates that they sum to exactly 100 before saving.
 *
 * Schema breakdown (defaults match the requested distribution):
 *   skills        → 30
 *   jobRoles      → 18
 *   experience    → 15
 *   cgpa          →  5   ─┐ sub-weights of `academics` (12)
 *   batchYear     →  7   ─┘
 *   location      →  8
 *   degree        →  7
 *   stream        →  5
 *   salary        →  5
 *                  ────
 *   Total         100
 */

const relevancyWeightsSchema = new mongoose.Schema(
  {
    skills: { type: Number, default: 26, min: 0, max: 100 },
    jobRoles: { type: Number, default: 16, min: 0, max: 100 },
    experience: { type: Number, default: 14, min: 0, max: 100 },

    // academics is split into two sub-weights
    cgpa: { type: Number, default: 2, min: 0, max: 100 },
    batchYear: { type: Number, default: 7, min: 0, max: 100 },

    location: { type: Number, default: 8, min: 0, max: 100 },
    degree: { type: Number, default: 7, min: 0, max: 100 },
    stream: { type: Number, default: 5, min: 0, max: 100 },
    salary: { type: Number, default: 7, min: 0, max: 100 },
    noticePeriod:     { type: Number, default:  5, min: 0, max: 100 },
noticePeriodDays: { type: Number, default:  3, min: 0, max: 100 },

    // audit trail
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
    },
  },
  { timestamps: true }
);

// Convenience virtual: total academics weight = cgpa + batchYear
relevancyWeightsSchema.virtual("academics").get(function () {
  return this.cgpa + this.batchYear;
});

relevancyWeightsSchema.set("toJSON", { virtuals: true });
relevancyWeightsSchema.set("toObject", { virtuals: true });

export default mongoose.models.RelevancyWeights ||
  mongoose.model("RelevancyWeights", relevancyWeightsSchema);