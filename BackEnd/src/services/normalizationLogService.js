import NormalizationLog
  from "../models/normalizationLogModel.js";

export const logNormalization =
  async ({
    entityType,
    rawInput,
    normalizedInput,
    canonicalId = null,
    displayName = null,
    confidence = null,
    matchType,
  }) => {

    try {

      const existing =
        await NormalizationLog.findOne({
          entity_type: entityType,
          preprocessed_input:
            normalizedInput,
          suggested_canonical_id:
            canonicalId,
          match_type:
            matchType,
        }).lean();

      if (existing) {
        return;
      }

      await NormalizationLog.create({
        entity_type:
          entityType,

        raw_input:
          rawInput,

        preprocessed_input:
          normalizedInput,

        suggested_canonical_id:
          canonicalId,

        matched_display_name:
          displayName,

        confidence,

        match_type:
          matchType,
      });

    } catch (err) {

      console.error(
        "Normalization log failed:",
        err.message
      );
    }
  };