import mongoose from "mongoose";

const normalizationLogSchema =
  new mongoose.Schema(
    {
      entity_type: {
        type: String,
        enum: ["college", "company"],
        required: true,
      },

      raw_input: String,

      preprocessed_input: String,

      // The CollegeMaster or CompanyMaster record associated with this result.
      // It is populated for exact, fuzzy, and newly-created unmatched values.
      master_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
      },

      suggested_canonical_id:
        String,

      matched_display_name:
        String,

      confidence: Number,

      match_type: {
        type: String,
        enum: [
          "exact",
          "alias",
          "fuzzy",
          "semantic",
          "unmatched",
          // "first_instance",
        ],
      },

      

      accepted: {
        type: Boolean,
        default: false,
      },

      reviewed: {
        type: Boolean,
        default: false,
      },

      reviewed_by: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Auth",
      },
    },
    {
      timestamps: true,
      collection:
        "normalization_logs",
    }
  );
normalizationLogSchema.index({
  entity_type: 1,
  reviewed: 1,
});

normalizationLogSchema.index({
  confidence: 1,
});
normalizationLogSchema.index({
  match_type: 1,
});

normalizationLogSchema.index({
  accepted: 1,
});
export default mongoose.model(
  "NormalizationLog",
  normalizationLogSchema
);
