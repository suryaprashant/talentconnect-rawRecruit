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

      // Use findOneAndUpdate with upsert to atomically avoid duplicates
      // Only one unreviewed log per (entity_type + preprocessed_input) is allowed
      await NormalizationLog.findOneAndUpdate(
        {
          entity_type: entityType,
          preprocessed_input: normalizedInput,
          reviewed: false,
        },
        {
          $set: {
            raw_input: rawInput,
            suggested_canonical_id: canonicalId,
            matched_display_name: displayName,
            confidence,
            match_type: matchType,
          },
          $setOnInsert: {
            entity_type: entityType,
            preprocessed_input: normalizedInput,
          },
        },
        { upsert: true, new: false }
      );

    } catch (err) {
      // Ignore duplicate key errors from race conditions
      if (err.code !== 11000) {
        console.error(
          "Normalization log failed:",
          err.message
        );
      }
    }
  };