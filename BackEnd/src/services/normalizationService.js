// import CollegeMaster from "../models/collegeMasterModel.js";
// import CompanyMaster from "../models/companyMasterModel.js";

// import { normalizeText }
//   from "../utils/normalizeText.js";

// import {
//   getCollegeFuse,
//   getCompanyFuse,
//   refreshFuseIndex,
// } from "./fuseIndexService.js";

// import {
//   logNormalization,
// } from "./normalizationLogService.js";

// // =====================================================
// // AUTO-CREATE HELPERS
// // =====================================================

// const autoCreateCollege = async (rawInput, normalized) => {
//   try {
//     // Guard: don't create a duplicate if it was just created by a concurrent request
//     const existing = await CollegeMaster.findOne({ canonical_id: normalized }).lean();
//     if (existing) {
//       return {
//         masterId: existing._id,
//         canonicalId: existing.canonical_id,
//         displayName: existing.display_name,
//         confidence: 100,
//         matchType: "alias",
//       };
//     }

//     const created = await CollegeMaster.create({
//       canonical_id: normalized,
//       display_name: rawInput,
//       aliases: [normalized],
//     });

//     await refreshFuseIndex();

//     await logNormalization({
//       entityType: "college",
//       rawInput,
//       normalizedInput: normalized,
//       canonicalId: normalized,
//       displayName: rawInput,
//       confidence: 100,
//       matchType: "auto-created",
//     });

//     return {
//       masterId: created._id,
//       canonicalId: created.canonical_id,
//       displayName: created.display_name,
//       confidence: 100,
//       matchType: "alias",
//     };
//   } catch (err) {
//     // If a duplicate key error occurs (race condition), fetch and return the existing one
//     if (err.code === 11000) {
//       const existing = await CollegeMaster.findOne({ canonical_id: normalized }).lean();
//       if (existing) {
//         return {
//           masterId: existing._id,
//           canonicalId: existing.canonical_id,
//           displayName: existing.display_name,
//           confidence: 100,
//           matchType: "alias",
//         };
//       }
//     }
//     console.error("[autoCreateCollege] Failed:", err.message);
//     return null;
//   }
// };

// const autoCreateCompany = async (rawInput, normalized) => {
//   try {
//     // Guard: don't create a duplicate if it was just created by a concurrent request
//     const existing = await CompanyMaster.findOne({ canonical_id: normalized }).lean();
//     if (existing) {
//       return {
//         masterId: existing._id,
//         canonicalId: existing.canonical_id,
//         displayName: existing.display_name,
//         confidence: 100,
//         matchType: "alias",
//       };
//     }

//     const created = await CompanyMaster.create({
//       canonical_id: normalized,
//       display_name: rawInput,
//       aliases: [normalized],
//     });

//     await refreshFuseIndex();

//     await logNormalization({
//       entityType: "company",
//       rawInput,
//       normalizedInput: normalized,
//       canonicalId: normalized,
//       displayName: rawInput,
//       confidence: 100,
//       matchType: "auto-created",
//     });

//     return {
//       masterId: created._id,
//       canonicalId: created.canonical_id,
//       displayName: created.display_name,
//       confidence: 100,
//       matchType: "alias",
//     };
//   } catch (err) {
//     // If a duplicate key error occurs (race condition), fetch and return the existing one
//     if (err.code === 11000) {
//       const existing = await CompanyMaster.findOne({ canonical_id: normalized }).lean();
//       if (existing) {
//         return {
//           masterId: existing._id,
//           canonicalId: existing.canonical_id,
//           displayName: existing.display_name,
//           confidence: 100,
//           matchType: "alias",
//         };
//       }
//     }
//     console.error("[autoCreateCompany] Failed:", err.message);
//     return null;
//   }
// };

// // =====================================================
// // COLLEGE
// // =====================================================

// export const resolveCollege =
//   async (rawInput) => {

//     if (!rawInput) {
//       return null;
//     }

//     const normalized =
//       normalizeText(rawInput);

//     // ====================
//     // ALIAS MATCH
//     // ====================

//     const exactMatch =
//       await CollegeMaster.findOne({
//         aliases: normalized,
//       }).lean();

//     if (exactMatch) {

//       await logNormalization({
//         entityType: "college",

//         rawInput,

//         normalizedInput:
//           normalized,

//         canonicalId:
//           exactMatch.canonical_id,

//         displayName:
//           exactMatch.display_name,

//         confidence: 100,

//         matchType: "alias",
//       });

//       return {
//         masterId:
//           exactMatch._id,

//         canonicalId:
//           exactMatch.canonical_id,

//         displayName:
//           exactMatch.display_name,

//         confidence: 100,

//         matchType: "alias",
//       };
//     }

//     // ====================
//     // FUZZY MATCH
//     // ====================

//     const fuse =
//       getCollegeFuse();

//     if (!fuse) {

//       return await autoCreateCollege(rawInput, normalized);
//     }

//     const results =
//       fuse.search(normalized);

//     if (!results.length) {

//       return await autoCreateCollege(rawInput, normalized);
//     }

//     const best =
//       results[0];

//     let confidence =
//       Math.round(
//         (1 - best.score) * 100
//       );

//     confidence =
//       Math.min(
//         confidence,
//         99
//       );

//     if (confidence < 70) {

//       return await autoCreateCollege(rawInput, normalized);
//     }

//     await logNormalization({
//       entityType: "college",

//       rawInput,

//       normalizedInput:
//         normalized,

//       canonicalId:
//         best.item.canonical_id,

//       displayName:
//         best.item.display_name,

//       confidence,

//       matchType:
//         "fuzzy",
//     });

//     return {
//       masterId:
//         best.item._id,

//       canonicalId:
//         best.item.canonical_id,

//       displayName:
//         best.item.display_name,

//       confidence,

//       matchType:
//         "fuzzy",
//     };
//   };

// // =====================================================
// // COMPANY
// // =====================================================

// export const resolveCompany =
//   async (rawInput) => {

//     if (!rawInput) {
//       return null;
//     }

//     const normalized =
//       normalizeText(rawInput);

//     // ====================
//     // ALIAS MATCH
//     // ====================

//     const exactMatch =
//       await CompanyMaster.findOne({
//         aliases: normalized,
//       }).lean();

//     if (exactMatch) {

//       await logNormalization({
//         entityType: "company",

//         rawInput,

//         normalizedInput:
//           normalized,

//         canonicalId:
//           exactMatch.canonical_id,

//         displayName:
//           exactMatch.display_name,

//         confidence: 100,

//         matchType:
//           "alias",
//       });

//       return {
//         masterId:
//           exactMatch._id,

//         canonicalId:
//           exactMatch.canonical_id,

//         displayName:
//           exactMatch.display_name,

//         confidence: 100,

//         matchType:
//           "alias",
//       };
//     }

//     // ====================
//     // FUZZY MATCH
//     // ====================

//     const fuse =
//       getCompanyFuse();

//     if (!fuse) {

//       return await autoCreateCompany(rawInput, normalized);
//     }

//     const results =
//       fuse.search(normalized);

//     if (!results.length) {

//       return await autoCreateCompany(rawInput, normalized);
//     }

//     const best =
//       results[0];

//     let confidence =
//       Math.round(
//         (1 - best.score) * 100
//       );

//     confidence =
//       Math.min(
//         confidence,
//         99
//       );

//     if (confidence < 70) {

//       return await autoCreateCompany(rawInput, normalized);
//     }

//     await logNormalization({
//       entityType: "company",

//       rawInput,

//       normalizedInput:
//         normalized,

//       canonicalId:
//         best.item.canonical_id,

//       displayName:
//         best.item.display_name,

//       confidence,

//       matchType:
//         "fuzzy",
//     });

//     return {
//       masterId:
//         best.item._id,

//       canonicalId:
//         best.item.canonical_id,

//       displayName:
//         best.item.display_name,

//       confidence,

//       matchType:
//         "fuzzy",
//     };
//   };
import CollegeMaster from "../models/collegeMasterModel.js";
import CompanyMaster from "../models/companyMasterModel.js";

import { normalizeText } from "../utils/normalizeText.js";

import {
  getCollegeFuse,
  getCompanyFuse,
  refreshFuseIndex,
} from "./fuseIndexService.js";

import { logNormalization } from "./normalizationLogService.js";

const FUZZY_CONFIDENCE_THRESHOLD = 80;

// =====================================================
// COMMON HELPERS
// =====================================================

const createResponse = (
  document,
  confidence = 100,
  matchType = "alias",
) => {
  if (!document) {
    return null;
  }

  return {
    masterId: document._id,
    canonicalId: document.canonical_id,
    displayName: document.display_name,
    confidence,
    matchType,
  };
};

const safeLogNormalization = async (payload) => {
  try {
    await logNormalization(payload);
  } catch (error) {
    // Normalization logging should not break the main request.
    console.error(
      "[safeLogNormalization] Failed:",
      error?.message || error,
    );
  }
};

const findExistingCollege = async (normalized) => {
  if (!normalized) {
    return null;
  }

  return CollegeMaster.findOne({
    $or: [
      { canonical_id: normalized },
      { aliases: normalized },
    ],
  }).lean();
};

const findExistingCompany = async (normalized) => {
  if (!normalized) {
    return null;
  }

  return CompanyMaster.findOne({
    $or: [
      { canonical_id: normalized },
      { aliases: normalized },
    ],
  }).lean();
};

// =====================================================
// AUTO-CREATE COLLEGE
// =====================================================

const autoCreateCollege = async (rawInput, normalized) => {
  try {
    if (!rawInput || !normalized) {
      return null;
    }

    const cleanedInput = String(rawInput).trim();

    // Check canonical_id and aliases before inserting.
    const existing = await findExistingCollege(normalized);

    if (existing) {
      return createResponse(existing, 100, "alias");
    }

    /*
     * Atomic upsert:
     * Only one document can be created for the same canonical_id,
     * provided canonical_id has a unique index in the schema.
     */
    const college = await CollegeMaster.findOneAndUpdate(
      {
        canonical_id: normalized,
      },
      {
        $setOnInsert: {
          canonical_id: normalized,
          display_name: cleanedInput,
          aliases: [normalized],
        },
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    ).lean();

    await refreshFuseIndex();

    await safeLogNormalization({
      entityType: "college",
      rawInput: cleanedInput,
      normalizedInput: normalized,
      canonicalId: college.canonical_id,
      displayName: college.display_name,
      confidence: 100,
      matchType: "auto-created",
    });

    return createResponse(college, 100, "auto-created");
  } catch (error) {
    /*
     * This handles two simultaneous requests where both requests
     * pass the initial duplicate check.
     */
    if (error?.code === 11000) {
      const existing = await findExistingCollege(normalized);

      if (existing) {
        return createResponse(existing, 100, "alias");
      }
    }

    console.error("[autoCreateCollege] Failed:", {
      rawInput,
      normalized,
      code: error?.code,
      message: error?.message,
    });

    return null;
  }
};

// =====================================================
// AUTO-CREATE COMPANY
// =====================================================

const autoCreateCompany = async (rawInput, normalized) => {
  try {
    if (!rawInput || !normalized) {
      return null;
    }

    const cleanedInput = String(rawInput).trim();

    /*
     * Check both fields because the company may already exist
     * as a canonical ID or as an alias.
     */
    const existing = await findExistingCompany(normalized);

    if (existing) {
      return createResponse(existing, 100, "alias");
    }

    /*
     * Atomic upsert prevents duplicate company creation during
     * concurrent requests.
     */
    const company = await CompanyMaster.findOneAndUpdate(
      {
        canonical_id: normalized,
      },
      {
        $setOnInsert: {
          canonical_id: normalized,
          display_name: cleanedInput,
          aliases: [normalized],
        },
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    ).lean();

    await refreshFuseIndex();

    await safeLogNormalization({
      entityType: "company",
      rawInput: cleanedInput,
      normalizedInput: normalized,
      canonicalId: company.canonical_id,
      displayName: company.display_name,
      confidence: 100,
      matchType: "auto-created",
    });

    return createResponse(company, 100, "auto-created");
  } catch (error) {
    /*
     * If another request created the company at the same time,
     * MongoDB throws duplicate key error 11000.
     */
    if (error?.code === 11000) {
      const existing = await findExistingCompany(normalized);

      if (existing) {
        return createResponse(existing, 100, "alias");
      }
    }

    console.error("[autoCreateCompany] Failed:", {
      rawInput,
      normalized,
      code: error?.code,
      message: error?.message,
    });

    return null;
  }
};

// =====================================================
// RESOLVE COLLEGE
// =====================================================

export const resolveCollege = async (rawInput) => {
  try {
    if (typeof rawInput !== "string" || !rawInput.trim()) {
      return null;
    }

    const cleanedInput = rawInput.trim();
    const normalized = normalizeText(cleanedInput);

    if (!normalized) {
      return null;
    }

    // =================================================
    // EXACT CANONICAL ID OR ALIAS MATCH
    // =================================================

    const exactMatch = await findExistingCollege(normalized);

    if (exactMatch) {
      await safeLogNormalization({
        entityType: "college",
        rawInput: cleanedInput,
        normalizedInput: normalized,
        canonicalId: exactMatch.canonical_id,
        displayName: exactMatch.display_name,
        confidence: 100,
        matchType: "alias",
      });

      return createResponse(exactMatch, 100, "alias");
    }

    // =================================================
    // FUZZY MATCH
    // =================================================

    const fuse = getCollegeFuse();

    /*
     * Auto-create when:
     * - Fuse is null
     * - Fuse is undefined
     * - Fuse has no search method
     */
    if (!fuse || typeof fuse.search !== "function") {
      return autoCreateCollege(cleanedInput, normalized);
    }

    let results;

    try {
      results = fuse.search(normalized);
    } catch (error) {
      console.error(
        "[resolveCollege] Fuse search failed:",
        error?.message || error,
      );

      return autoCreateCollege(cleanedInput, normalized);
    }

    /*
     * Auto-create when Fuse returns:
     * - null
     * - undefined
     * - non-array value
     * - empty array
     */
    if (!Array.isArray(results) || results.length === 0) {
      return autoCreateCollege(cleanedInput, normalized);
    }

    const best = results[0];

    /*
     * Invalid fuzzy result must not cause an error.
     */
    if (
      !best ||
      !best.item ||
      typeof best.score !== "number"
    ) {
      return autoCreateCollege(cleanedInput, normalized);
    }

    let confidence = Math.round((1 - best.score) * 100);

    confidence = Math.max(
      0,
      Math.min(confidence, 99),
    );

    /*
     * A low-confidence result is considered a new college.
     */
    if (confidence < FUZZY_CONFIDENCE_THRESHOLD) {
      return autoCreateCollege(cleanedInput, normalized);
    }

    await safeLogNormalization({
      entityType: "college",
      rawInput: cleanedInput,
      normalizedInput: normalized,
      canonicalId: best.item.canonical_id,
      displayName: best.item.display_name,
      confidence,
      matchType: "fuzzy",
    });

    return createResponse(
      best.item,
      confidence,
      "fuzzy",
    );
  } catch (error) {
    console.error("[resolveCollege] Failed:", {
      rawInput,
      message: error?.message,
    });

    return null;
  }
};

// =====================================================
// RESOLVE COMPANY
// =====================================================

export const resolveCompany = async (rawInput) => {
  try {
    if (typeof rawInput !== "string" || !rawInput.trim()) {
      return null;
    }

    const cleanedInput = rawInput.trim();
    const normalized = normalizeText(cleanedInput);

    if (!normalized) {
      return null;
    }

    // =================================================
    // EXACT CANONICAL ID OR ALIAS MATCH
    // =================================================

    const exactMatch = await findExistingCompany(normalized);

    if (exactMatch) {
      await safeLogNormalization({
        entityType: "company",
        rawInput: cleanedInput,
        normalizedInput: normalized,
        canonicalId: exactMatch.canonical_id,
        displayName: exactMatch.display_name,
        confidence: 100,
        matchType: "alias",
      });

      return createResponse(exactMatch, 100, "alias");
    }

    // =================================================
    // FUZZY MATCH
    // =================================================

    const fuse = getCompanyFuse();

    /*
     * Your required case:
     * If the Fuse instance is null, immediately auto-create
     * the company after performing the duplicate check.
     */
    if (!fuse || typeof fuse.search !== "function") {
      return autoCreateCompany(cleanedInput, normalized);
    }

    let results;

    try {
      results = fuse.search(normalized);
    } catch (error) {
      console.error(
        "[resolveCompany] Fuse search failed:",
        error?.message || error,
      );

      return autoCreateCompany(cleanedInput, normalized);
    }

    /*
     * Never directly use results.length because results may
     * itself be null or undefined.
     */
    if (!Array.isArray(results) || results.length === 0) {
      return autoCreateCompany(cleanedInput, normalized);
    }

    const best = results[0];

    /*
     * Auto-create if Fuse returns an incomplete result.
     */
    if (
      !best ||
      !best.item ||
      typeof best.score !== "number"
    ) {
      return autoCreateCompany(cleanedInput, normalized);
    }

    let confidence = Math.round((1 - best.score) * 100);

    confidence = Math.max(
      0,
      Math.min(confidence, 99),
    );

    /*
     * Low fuzzy confidence means it is most likely a new company.
     */
    if (confidence < FUZZY_CONFIDENCE_THRESHOLD) {
      return autoCreateCompany(cleanedInput, normalized);
    }

    await safeLogNormalization({
      entityType: "company",
      rawInput: cleanedInput,
      normalizedInput: normalized,
      canonicalId: best.item.canonical_id,
      displayName: best.item.display_name,
      confidence,
      matchType: "fuzzy",
    });

    return createResponse(
      best.item,
      confidence,
      "fuzzy",
    );
  } catch (error) {
    console.error("[resolveCompany] Failed:", {
      rawInput,
      message: error?.message,
    });

    return null;
  }
};