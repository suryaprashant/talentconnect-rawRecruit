import mongoose from "mongoose";

/**
 * RelevancyWeightsProfessional — stores scoring weights for the job-relevancy
 * engine specifically for PROFESSIONAL candidates.
 *
 * Only ONE document should ever exist (singleton). The admin PATCH API always
 * upserts this single record.
 *
 * All weight values are stored as plain numbers (0-100).
 * The controller validates that they sum to exactly 100 before saving.
 *
 * Default distribution (professional):
 *   skills           → 40
 *   jobRoles         → 13
 *   stream           → 13
 *   experience       →  9
 *   degree           →  9
 *   salary           →  5
 *   noticePeriod     →  4
 *   location         →  4
 *   noticePeriodDays →  3
 *   cgpa             →  0
 *   batchYear        →  0
 *                    ────
 *   Total            100
 */

const relevancyWeightsProfessionalSchema = new mongoose.Schema(
  {
    skills:           { type: Number, default: 40, min: 0, max: 100 },
    jobRoles:         { type: Number, default: 13, min: 0, max: 100 },
    experience:       { type: Number, default:  9, min: 0, max: 100 },
    noticePeriod:     { type: Number, default:  4, min: 0, max: 100 },
    noticePeriodDays: { type: Number, default:  3, min: 0, max: 100 },
    cgpa:             { type: Number, default:  0, min: 0, max: 100 },
    batchYear:        { type: Number, default:  0, min: 0, max: 100 },
    location:         { type: Number, default:  4, min: 0, max: 100 },
    degree:           { type: Number, default:  9, min: 0, max: 100 },
    stream:           { type: Number, default: 13, min: 0, max: 100 },
    salary:           { type: Number, default:  5, min: 0, max: 100 },

    // audit trail
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
    },
  },
  { timestamps: true }
);

// Convenience virtual: total academics weight = cgpa + batchYear
relevancyWeightsProfessionalSchema.virtual("academics").get(function () {
  return this.cgpa + this.batchYear;
});

relevancyWeightsProfessionalSchema.set("toJSON", { virtuals: true });
relevancyWeightsProfessionalSchema.set("toObject", { virtuals: true });

export default mongoose.models.RelevancyWeightsProfessional ||
  mongoose.model("RelevancyWeightsProfessional", relevancyWeightsProfessionalSchema);