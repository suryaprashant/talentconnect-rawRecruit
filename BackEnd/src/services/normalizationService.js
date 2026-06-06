import CollegeMaster from "../models/collegeMasterModel.js";
import CompanyMaster from "../models/companyMasterModel.js";

import { normalizeText }
  from "../utils/normalizeText.js";

import {
  getCollegeFuse,
  getCompanyFuse,
} from "./fuseIndexService.js";

import {
  logNormalization,
} from "./normalizationLogService.js";

// =====================================================
// COLLEGE
// =====================================================

export const resolveCollege =
  async (rawInput) => {

    if (!rawInput) {
      return null;
    }

    const normalized =
      normalizeText(rawInput);

    // ====================
    // ALIAS MATCH
    // ====================

    const exactMatch =
      await CollegeMaster.findOne({
        aliases: normalized,
      }).lean();

    if (exactMatch) {

      await logNormalization({
        entityType: "college",

        rawInput,

        normalizedInput:
          normalized,

        canonicalId:
          exactMatch.canonical_id,

        displayName:
          exactMatch.display_name,

        confidence: 100,

        matchType: "alias",
      });

      return {
        masterId:
          exactMatch._id,

        canonicalId:
          exactMatch.canonical_id,

        displayName:
          exactMatch.display_name,

        confidence: 100,

        matchType: "alias",
      };
    }

    // ====================
    // FUZZY MATCH
    // ====================

    const fuse =
      getCollegeFuse();

    if (!fuse) {

      await logNormalization({
        entityType: "college",

        rawInput,

        normalizedInput:
          normalized,

        matchType:
          "unmatched",
      });

      return null;
    }

    const results =
      fuse.search(normalized);

    if (!results.length) {

      await logNormalization({
        entityType: "college",

        rawInput,

        normalizedInput:
          normalized,

        matchType:
          "unmatched",
      });

      return null;
    }

    const best =
      results[0];

    let confidence =
      Math.round(
        (1 - best.score) * 100
      );

    confidence =
      Math.min(
        confidence,
        99
      );

    if (confidence < 80) {

      await logNormalization({
        entityType: "college",

        rawInput,

        normalizedInput:
          normalized,

        matchType:
          "unmatched",
      });

      return null;
    }

    await logNormalization({
      entityType: "college",

      rawInput,

      normalizedInput:
        normalized,

      canonicalId:
        best.item.canonical_id,

      displayName:
        best.item.display_name,

      confidence,

      matchType:
        "fuzzy",
    });

    return {
      masterId:
        best.item._id,

      canonicalId:
        best.item.canonical_id,

      displayName:
        best.item.display_name,

      confidence,

      matchType:
        "fuzzy",
    };
  };

// =====================================================
// COMPANY
// =====================================================

export const resolveCompany =
  async (rawInput) => {

    if (!rawInput) {
      return null;
    }

    const normalized =
      normalizeText(rawInput);

    // ====================
    // ALIAS MATCH
    // ====================

    const exactMatch =
      await CompanyMaster.findOne({
        aliases: normalized,
      }).lean();

    if (exactMatch) {

      await logNormalization({
        entityType: "company",

        rawInput,

        normalizedInput:
          normalized,

        canonicalId:
          exactMatch.canonical_id,

        displayName:
          exactMatch.display_name,

        confidence: 100,

        matchType:
          "alias",
      });

      return {
        masterId:
          exactMatch._id,

        canonicalId:
          exactMatch.canonical_id,

        displayName:
          exactMatch.display_name,

        confidence: 100,

        matchType:
          "alias",
      };
    }

    // ====================
    // FUZZY MATCH
    // ====================

    const fuse =
      getCompanyFuse();

    if (!fuse) {

      await logNormalization({
        entityType: "company",

        rawInput,

        normalizedInput:
          normalized,

        matchType:
          "unmatched",
      });

      return null;
    }

    const results =
      fuse.search(normalized);

    if (!results.length) {

      await logNormalization({
        entityType: "company",

        rawInput,

        normalizedInput:
          normalized,

        matchType:
          "unmatched",
      });

      return null;
    }

    const best =
      results[0];

    let confidence =
      Math.round(
        (1 - best.score) * 100
      );

    confidence =
      Math.min(
        confidence,
        99
      );

    if (confidence < 80) {

      await logNormalization({
        entityType: "company",

        rawInput,

        normalizedInput:
          normalized,

        matchType:
          "unmatched",
      });

      return null;
    }

    await logNormalization({
      entityType: "company",

      rawInput,

      normalizedInput:
        normalized,

      canonicalId:
        best.item.canonical_id,

      displayName:
        best.item.display_name,

      confidence,

      matchType:
        "fuzzy",
    });

    return {
      masterId:
        best.item._id,

      canonicalId:
        best.item.canonical_id,

      displayName:
        best.item.display_name,

      confidence,

      matchType:
        "fuzzy",
    };
  };