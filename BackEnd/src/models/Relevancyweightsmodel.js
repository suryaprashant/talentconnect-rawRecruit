import mongoose from "mongoose";

/**
 * RelevancyWeights — stores scoring weights for the job-relevancy engine
 * specifically for STUDENT candidates.
 *
 * Only ONE document should ever exist (singleton). The admin PATCH API always
 * upserts this single record.
 *
 * All weight values are stored as plain numbers (0-100).
 * The controller validates that they sum to exactly 100 before saving.
 *
 * Default distribution (student):
 *   skills           → 38
 *   stream           → 16
 *   degree           → 13
 *   jobRoles         →  7
 *   experience       →  4
 *   cgpa             →  6
 *   batchYear        →  5
 *   location         →  4
 *   salary           →  3
 *   noticePeriod     →  2
 *   noticePeriodDays →  2
 *                    ────
 *   Total            100
 */
// test
const relevancyWeightsSchema = new mongoose.Schema(
  {
    skills:           { type: Number, default: 38, min: 0, max: 100 },
    jobRoles:         { type: Number, default:  7, min: 0, max: 100 },
    experience:       { type: Number, default:  4, min: 0, max: 100 },
    noticePeriod:     { type: Number, default:  2, min: 0, max: 100 },
    noticePeriodDays: { type: Number, default:  2, min: 0, max: 100 },
    cgpa:             { type: Number, default:  6, min: 0, max: 100 },
    batchYear:        { type: Number, default:  5, min: 0, max: 100 },
    location:         { type: Number, default:  4, min: 0, max: 100 },
    degree:           { type: Number, default: 13, min: 0, max: 100 },
    stream:           { type: Number, default: 16, min: 0, max: 100 },
    salary:           { type: Number, default:  3, min: 0, max: 100 },

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