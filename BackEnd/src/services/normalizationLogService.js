import NormalizationLog
  from "../models/normalizationLogModel.js";

export const logNormalization =
  async ({
    entityType,
    rawInput,
    normalizedInput,
    masterId = null,
    canonicalId = null,
    displayName = null,
    confidence = null,
    matchType,
  }) => {

    try {

      return await NormalizationLog.findOneAndUpdate(
        {
          entity_type: entityType,
          preprocessed_input: normalizedInput,
          suggested_canonical_id: canonicalId,
          match_type: matchType,
        },
        {
          $set: {
            entity_type: entityType,
            raw_input: rawInput,
            preprocessed_input: normalizedInput,
            master_id: masterId,
            suggested_canonical_id: canonicalId,
            matched_display_name: displayName,
            confidence,
            match_type: matchType,
          },
        },
        {
          upsert: true,
          setDefaultsOnInsert: true,
          new: true, // return the updated/new document
        }
      );

    } catch (err) {

      console.error(
        "Normalization log failed:",
        err.message
      );

      return null;
    }
  };