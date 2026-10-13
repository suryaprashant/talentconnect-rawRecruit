import CollegeMaster from "../models/collegeMasterModel.js";
import CompanyMaster from "../models/companyMasterModel.js";

import { normalizeText } from "../utils/normalizeText.js";

import {
  getCollegeFuse,
  getCompanyFuse,
  // addCompanyToFuse,
  refreshFuseIndex,
} from "./fuseIndexService.js";
import NormalizationLog from "../models/normalizationLogModel.js";

import { logNormalization } from "./normalizationLogService.js";

// =====================================================
// COLLEGE
// =====================================================

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

//       await logNormalization({
//         entityType: "college",

//         rawInput,

//         normalizedInput:
//           normalized,

//         matchType:
//           "unmatched",
//       });

//       return null;
//     }

//     const results =
//       fuse.search(normalized);

//     if (!results.length) {

//       await logNormalization({
//         entityType: "college",

//         rawInput,

//         normalizedInput:
//           normalized,

//         matchType:
//           "unmatched",
//       });

//       return null;
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

//     if (confidence < 80) {

//       await logNormalization({
//         entityType: "college",

//         rawInput,

//         normalizedInput:
//           normalized,

//         matchType:
//           "unmatched",
//       });

//       return null;
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

// =====================================================
// COMPANY
// =====================================================

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

//       await logNormalization({
//         entityType: "company",

//         rawInput,

//         normalizedInput:
//           normalized,

//         matchType:
//           "unmatched",
//       });

//       return null;
//     }

//     const results =
//       fuse.search(normalized);

//     if (!results.length) {

//       await logNormalization({
//         entityType: "company",

//         rawInput,

//         normalizedInput:
//           normalized,

//         matchType:
//           "unmatched",
//       });

//       return null;
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

//     if (confidence < 80) {

//       await logNormalization({
//         entityType: "company",

//         rawInput,

//         normalizedInput:
//           normalized,

//         matchType:
//           "unmatched",
//       });

//       return null;
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

//   export const resolveOrCreateCompany = async (rawInput) => {
//   if (!rawInput) return null;

//   const normalized = normalizeText(rawInput);
//   console.log("normalised : "+normalized);
//   // 1. Check existing alias
//   const exactMatch = await CompanyMaster.findOne({
//     aliases: normalized,
//   }).lean();

//   console.log(exactMatch);

//   if (exactMatch) {
//     return {
//       masterId: exactMatch._id,
//       canonicalId: exactMatch.canonical_id,
//       displayName: exactMatch.display_name,
//       confidence: 100,
//       matchType: "alias",
//     };
//   }

//   const fuse =
//       getCompanyFuse();
//   console.log(fuse);
//   if(fuse)
//   {
//     const results =
//       fuse.search(normalized);
//     console.log(results);

//     if (results.length) {

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
//     console.log(confidence);
//     if (confidence >= 80) {
//       await logNormalization({
//         entityType: "company",

//         rawInput,

//         normalizedInput:
//           normalized,

//         canonicalId:
//           best.item.canonical_id,

//         displayName:
//           best.item.display_name,

//         confidence,

//         matchType:
//           "fuzzy",
//       });
//     }
//   }}

//   // 2. No alias match → create new canonical company
//   const newCompany = await CompanyMaster.create({
//     canonical_id: normalized,
//     display_name: rawInput.trim(),
//     aliases: [normalized],
//   });

//   await refreshFuseIndex();
//   console.log(getCompanyFuse);

//   return {
//     masterId: newCompany._id,
//     canonicalId: newCompany.canonical_id,
//     displayName: newCompany.display_name,
//     confidence: 100,
//     matchType: "created",
//   };
// };

export const resolveCompany = async (rawInput) => {
  if (!rawInput) return null;

  const normalized = normalizeText(rawInput);
  let normalizationLogId = null;

  console.log("========== COMPANY RESOLUTION ==========");
  console.log("Raw input:", rawInput);
  console.log("Normalized input:", normalized);

  // 1. Check existing alias
  const exactMatch = await CompanyMaster.findOne({
    aliases: normalized,
  }).lean();

  console.log("Exact alias match:", exactMatch);

  if (exactMatch) {
    console.log("MATCH TYPE: ALIAS");

    return {
      masterId: exactMatch._id,
      canonicalId: exactMatch.canonical_id,
      displayName: exactMatch.display_name,
      confidence: 100,
      matchType: "alias",
      aliases: exactMatch.aliases || [],
    };
  }

  // 2. Check Fuse
  const fuse = getCompanyFuse();

  console.log("Fuse exists:", !!fuse);

  if (fuse) {
    const results = fuse.search(normalized);

    console.log("Fuse search input:", normalized);
    console.log("Fuse results:", results);

    if (results.length) {
      const best = results[0];

      console.log("Best fuzzy item:", best.item);
      console.log("Raw Fuse score:", best.score);

      let confidence = Math.round((1 - best.score) * 100);

      confidence = Math.min(confidence, 99);

      console.log("Calculated confidence:", confidence);

      if (confidence >= 80) {
        console.log("MATCH TYPE: FUZZY");

        const log = await logNormalization({
          entityType: "company",
          rawInput,
          normalizedInput: normalized,
          canonicalId: best.item.canonical_id,
          displayName: best.item.display_name,
          confidence,
          matchType: "fuzzy",
          aliases: best.item.aliases || [],
        });

        normalizationLogId = log?._id;
      } else {
        const log = await logNormalization({
          entityType: "company",
          rawInput,
          normalizedInput: normalized,
          canonicalId: normalized,
          displayName: rawInput.trim(),
          confidence: 100,
          // matchType: "first_instance",
          matchType: "unmatched",
        });

        normalizationLogId = log?._id;

        console.log("Fuzzy confidence below 80");
      }
    } else {
      const log = await logNormalization({
        entityType: "company",
        rawInput,
        normalizedInput: normalized,
        canonicalId: normalized,
        displayName: rawInput.trim(),
        confidence: 100,
        // matchType: "first_instance",
        matchType: "unmatched",
      });

      normalizationLogId = log?._id;

      console.log("No Fuse results found");
    }
  } else {
    const log = await logNormalization({
      entityType: "company",
      rawInput,
      normalizedInput: normalized,
      canonicalId: normalized,
      displayName: rawInput.trim(),
      confidence: 100,
      // matchType: "first_instance",
      matchType: "unmatched",
    });

    normalizationLogId = log?._id;

    console.log("Company Fuse is NULL / not initialized");
  }

  // 3. Create new company
  console.log("Creating new CompanyMaster:", normalized);

  const newCompany = await CompanyMaster.create({
    canonical_id: normalized,
    display_name: rawInput.trim(),
    aliases: [normalized],
  });

  console.log("Creating new Company:", newCompany._id);

  console.log("normalization log", normalizationLogId);
  if (normalizationLogId) {
    await NormalizationLog.findByIdAndUpdate(normalizationLogId, {
      $set: {
        master_id: newCompany._id,
      },
    });
  }

  console.log("New company created:", newCompany.toObject());

  // 4. Refresh Fuse
  console.log("Refreshing Fuse index...");

  await refreshFuseIndex();

  const refreshedFuse = getCompanyFuse();

  console.log("Fuse refreshed successfully");
  console.log("Fuse exists after refresh:", !!refreshedFuse);

  // Verify newly created company is searchable
  if (refreshedFuse) {
    const testResults = refreshedFuse.search(normalized);

    console.log("Fuse results after refresh for:", normalized, testResults);
  }

  console.log("========================================");

  return {
    masterId: newCompany._id,
    canonicalId: newCompany.canonical_id,
    displayName: newCompany.display_name,
    confidence: 100,
    matchType: "created",
  };
};
export const resolveCollege = async (rawInput) => {
  if (!rawInput) return null;

  const normalized = normalizeText(rawInput);
  let normalizationLogId = null;

  console.log("========== COLLEGE RESOLUTION ==========");
  console.log("Raw input:", rawInput);
  console.log("Normalized input:", normalized);

  // 1. Check existing alias
  const exactMatch = await CollegeMaster.findOne({
    aliases: normalized,
  }).lean();

  console.log("Exact alias match:", exactMatch);

  if (exactMatch) {
    console.log("MATCH TYPE: ALIAS");

    return {
      masterId: exactMatch._id,
      canonicalId: exactMatch.canonical_id,
      displayName: exactMatch.display_name,
      confidence: 100,
      matchType: "alias",
    };
  }

  // 2. Check Fuse
  const fuse = getCollegeFuse();

  console.log("Fuse exists:", !!fuse);

  if (fuse) {
    const results = fuse.search(normalized);

    console.log("Fuse search input:", normalized);
    console.log("Fuse results:", results);

    if (results.length) {
      const best = results[0];

      console.log("Best fuzzy item:", best.item);
      console.log("Raw Fuse score:", best.score);

      let confidence = Math.round((1 - best.score) * 100);

      confidence = Math.min(confidence, 99);

      console.log("Calculated confidence:", confidence);

      if (confidence >= 80) {
        console.log("MATCH TYPE: FUZZY");

        const log = await logNormalization({
          entityType: "college",
          rawInput,
          normalizedInput: normalized,
          canonicalId: best.item.canonical_id,
          displayName: best.item.display_name,
          confidence,
          matchType: "fuzzy",
        });

        normalizationLogId = log._id;
      } else {
        const log = await logNormalization({
          entityType: "college",
          rawInput,
          normalizedInput: normalized,
          canonicalId: normalized,
          displayName: rawInput.trim(),
          confidence: 100,
          // matchType: "first_instance",
          matchType: "unmatched",
        });

        normalizationLogId = log._id;

        console.log("Fuzzy confidence below 80");
      }
    } else {
      const log = await logNormalization({
        entityType: "college",
        rawInput,
        normalizedInput: normalized,
        canonicalId: normalized,
        displayName: rawInput.trim(),
        confidence: 100,
        // matchType: "first_instance",
        matchType: "unmatched",
      });

      normalizationLogId = log._id;

      console.log("No Fuse results found");
    }
  } else {
    const log = await logNormalization({
      entityType: "college",
      rawInput,
      normalizedInput: normalized,
      canonicalId: normalized,
      displayName: rawInput.trim(),
      confidence: 100,
      // matchType: "first_instance",
      matchType: "unmatched",
    });

    normalizationLogId = log._id;

    console.log("College Fuse is NULL / not initialized");
  }

  // 3. Create new college
  console.log("Creating new CollegeMaster:", normalized);

  const newCollege = await CollegeMaster.create({
    canonical_id: normalized,
    display_name: rawInput.trim(),
    aliases: [normalized],
  });

  if (normalizationLogId) {
    await NormalizationLog.findByIdAndUpdate(normalizationLogId, {
      $set: {
        master_id: newCollege._id, // change to master_id if that's your schema field
      },
    });
  }

  console.log("New college created:", newCollege.toObject());

  // 4. Refresh Fuse
  console.log("Refreshing Fuse index...");

  await refreshFuseIndex();

  const refreshedFuse = getCollegeFuse();

  console.log("Fuse refreshed successfully");
  console.log("Fuse exists after refresh:", !!refreshedFuse);

  // Verify newly created college is searchable
  if (refreshedFuse) {
    const testResults = refreshedFuse.search(normalized);

    console.log("Fuse results after refresh for:", normalized, testResults);
  }

  console.log("========================================");

  return {
    masterId: newCollege._id,
    canonicalId: newCollege.canonical_id,
    displayName: newCollege.display_name,
    confidence: 100,
    matchType: "created",
  };
};
