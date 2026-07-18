import CollegeMaster from "../models/collegeMasterModel.js";
import CompanyMaster from "../models/companyMasterModel.js";

import { normalizeText }
  from "../utils/normalizeText.js";

import {
  getCollegeFuse,
  getCompanyFuse,
  // addCompanyToFuse,
  refreshFuseIndex,
} from "./fuseIndexService.js";

import {
  logNormalization,
} from "./normalizationLogService.js";

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

      let confidence = Math.round(
        (1 - best.score) * 100
      );

      confidence = Math.min(confidence, 99);

      console.log("Calculated confidence:", confidence);

      if (confidence >= 80) {
        console.log("MATCH TYPE: FUZZY");

        await logNormalization({
          entityType: "company",
          masterId: best.item._id,  // ADDED: pass masterId
          rawInput,
          normalizedInput: normalized,
          canonicalId: best.item.canonical_id,
          displayName: best.item.display_name,
          confidence,
          matchType: "fuzzy",
        });
      } else {
        // Create new company since fuzzy didn't meet threshold
        console.log("Fuzzy confidence below 80, creating new company");
        
        const newCompany = await CompanyMaster.create({
          canonical_id: normalized,
          display_name: rawInput.trim(),
          aliases: [normalized],
        });

        await logNormalization({
          entityType: "company",
          masterId: newCompany._id,  // ADDED: pass the new masterId
          rawInput,
          normalizedInput: normalized,
          canonicalId: normalized,
          displayName: rawInput.trim(),
          confidence: 100,
          matchType: "created",  // Changed from "unmatched" to "created"
        });

        // Refresh Fuse
        console.log("Refreshing Fuse index...");
        await refreshFuseIndex();

        return {
          masterId: newCompany._id,
          canonicalId: newCompany.canonical_id,
          displayName: newCompany.display_name,
          confidence: 100,
          matchType: "created",
        };
      }
    } else {
      // No Fuse results found - create new company
      console.log("No Fuse results found, creating new company");
      
      const newCompany = await CompanyMaster.create({
        canonical_id: normalized,
        display_name: rawInput.trim(),
        aliases: [normalized],
      });

      await logNormalization({
        entityType: "company",
        masterId: newCompany._id,  // ADDED: pass the new masterId
        rawInput,
        normalizedInput: normalized,
        canonicalId: normalized,
        displayName: rawInput.trim(),
        confidence: 100,
        matchType: "created",  // Changed from "unmatched" to "created"
      });

      // Refresh Fuse
      console.log("Refreshing Fuse index...");
      await refreshFuseIndex();

      return {
        masterId: newCompany._id,
        canonicalId: newCompany.canonical_id,
        displayName: newCompany.display_name,
        confidence: 100,
        matchType: "created",
      };
    }
  } else {
    // Fuse is NULL - create new company
    console.log("Company Fuse is NULL / not initialized, creating new company");
    
    const newCompany = await CompanyMaster.create({
      canonical_id: normalized,
      display_name: rawInput.trim(),
      aliases: [normalized],
    });

    await logNormalization({
      entityType: "company",
      masterId: newCompany._id,  // ADDED: pass the new masterId
      rawInput,
      normalizedInput: normalized,
      canonicalId: normalized,
      displayName: rawInput.trim(),
      confidence: 100,
      matchType: "created",  // Changed from "unmatched" to "created"
    });

    // Refresh Fuse
    console.log("Refreshing Fuse index...");
    await refreshFuseIndex();

    return {
      masterId: newCompany._id,
      canonicalId: newCompany.canonical_id,
      displayName: newCompany.display_name,
      confidence: 100,
      matchType: "created",
    };
  }
};
export const resolveCollege = async (rawInput) => {
  if (!rawInput) return null;

  const normalized = normalizeText(rawInput);

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

      let confidence = Math.round(
        (1 - best.score) * 100
      );

      confidence = Math.min(confidence, 99);

      console.log("Calculated confidence:", confidence);

      if (confidence >= 80) {
        console.log("MATCH TYPE: FUZZY");

        await logNormalization({
          entityType: "college",
          masterId: best.item._id,  // ADDED: pass masterId
          rawInput,
          normalizedInput: normalized,
          canonicalId: best.item.canonical_id,
          displayName: best.item.display_name,
          confidence,
          matchType: "fuzzy",
        });
      } else {
        // Create new college since fuzzy didn't meet threshold
        console.log("Fuzzy confidence below 80, creating new college");
        
        const newCollege = await CollegeMaster.create({
          canonical_id: normalized,
          display_name: rawInput.trim(),
          aliases: [normalized],
        });

        await logNormalization({
          entityType: "college",
          masterId: newCollege._id,  // ADDED: pass the new masterId
          rawInput,
          normalizedInput: normalized,
          canonicalId: normalized,
          displayName: rawInput.trim(),
          confidence: 100,
          matchType: "created",  // Changed from "unmatched" to "created"
        });

        // Refresh Fuse
        console.log("Refreshing Fuse index...");
        await refreshFuseIndex();

        return {
          masterId: newCollege._id,
          canonicalId: newCollege.canonical_id,
          displayName: newCollege.display_name,
          confidence: 100,
          matchType: "created",
        };
      }
    } else {
      // No Fuse results found - create new college
      console.log("No Fuse results found, creating new college");
      
      const newCollege = await CollegeMaster.create({
        canonical_id: normalized,
        display_name: rawInput.trim(),
        aliases: [normalized],
      });

      await logNormalization({
        entityType: "college",
        masterId: newCollege._id,  // ADDED: pass the new masterId
        rawInput,
        normalizedInput: normalized,
        canonicalId: normalized,
        displayName: rawInput.trim(),
        confidence: 100,
        matchType: "created",  // Changed from "unmatched" to "created"
      });

      // Refresh Fuse
      console.log("Refreshing Fuse index...");
      await refreshFuseIndex();

      return {
        masterId: newCollege._id,
        canonicalId: newCollege.canonical_id,
        displayName: newCollege.display_name,
        confidence: 100,
        matchType: "created",
      };
    }
  } else {
    // Fuse is NULL - create new college
    console.log("College Fuse is NULL / not initialized, creating new college");
    
    const newCollege = await CollegeMaster.create({
      canonical_id: normalized,
      display_name: rawInput.trim(),
      aliases: [normalized],
    });

    await logNormalization({
      entityType: "college",
      masterId: newCollege._id,  // ADDED: pass the new masterId
      rawInput,
      normalizedInput: normalized,
      canonicalId: normalized,
      displayName: rawInput.trim(),
      confidence: 100,
      matchType: "created",  // Changed from "unmatched" to "created"
    });

    // Refresh Fuse
    console.log("Refreshing Fuse index...");
    await refreshFuseIndex();

    return {
      masterId: newCollege._id,
      canonicalId: newCollege.canonical_id,
      displayName: newCollege.display_name,
      confidence: 100,
      matchType: "created",
    };
  }
};