import NormalizationLog from "../../models/normalizationLogModel.js";

import CompanyMaster
  from "../../models/companyMasterModel.js";

import CollegeMaster
  from "../../models/collegeMasterModel.js";

import { normalizeText }
  from "../../utils/normalizeText.js";
import {refreshFuseIndex, getCompanyFuse, getCollegeFuse} from "../../services/fuseIndexService.js";
import { resolveCompany, resolveCollege }
  from "../../services/normalizationService.js";
import {backfillCompanyCanonical, backfillCollegeCanonical} from "../../services/backfillNormalizationService.js";

// =====================================================
// RECALCULATE MATCH WITHOUT AUTO-CREATING CANONICALS
// Used only for the pending review loop — pure read+suggest, no writes to master
// =====================================================
const recalculateMatch = async (entityType, rawInput) => {
  const normalized = normalizeText(rawInput);
  const master = entityType === "company" ? CompanyMaster : CollegeMaster;

  // Alias match — exclude self-created entities (canonical_id === normalized means
  // it was auto-created from this exact input and is not a real external match)
  const exactMatch = await master.findOne({ aliases: normalized }).lean();
  if (exactMatch && exactMatch.canonical_id !== normalized) {
    return {
      canonicalId: exactMatch.canonical_id,
      displayName: exactMatch.display_name,
      confidence: 100,
      matchType: "alias",
    };
  }

  // Fuzzy match — skip results where the match is the entity's own auto-created record
  const fuse = entityType === "company" ? getCompanyFuse() : getCollegeFuse();
  if (!fuse) return null;

  const results = fuse.search(normalized);
  if (!results.length) return null;

  // Find the best candidate that is NOT the entity created from this exact input
  const candidate = results.find(
    (r) => r.item && r.item.canonical_id !== normalized
  );
  if (!candidate) return null;

  let confidence = Math.round((1 - candidate.score) * 100);
  confidence = Math.min(confidence, 99);

  // PREFIX BOOST: inputs sharing 4+ leading chars with a known alias
  // get lifted above the threshold so admin can review potential merges
  if (confidence < 70 && normalized.length >= 4) {
    const inputPrefix = normalized.slice(0, 4);
    const hasPrefix = (candidate.item.aliases || []).some(
      (a) => typeof a === "string" && a.length >= 4 && a.slice(0, 4) === inputPrefix
    );
    if (hasPrefix) confidence = 72;
  }

  if (confidence < 70) return null;

  return {
    canonicalId: candidate.item.canonical_id,
    displayName: candidate.item.display_name,
    confidence,
    matchType: "fuzzy",
  };
};

export const getPendingNormalizations = async (req, res) => {
  try {

    // =====================================
    // RECALCULATE PENDING LOGS
    // =====================================

    const pendingLogs =
      await NormalizationLog.find({
        reviewed: false,
      });

    for (const log of pendingLogs) {

      const result = await recalculateMatch(log.entity_type, log.raw_input);

      if (result) {

        log.suggested_canonical_id =
          result.canonicalId;

        log.matched_display_name =
          result.displayName;

        log.confidence =
          result.confidence;

        log.match_type =
          result.matchType;

      } else {

        log.suggested_canonical_id =
          null;

        log.matched_display_name =
          null;

        log.confidence =
          null;

        log.match_type =
          "unmatched";
      }

      await log.save();
    }

    // =====================================
    // FETCH UPDATED LOGS
    // =====================================

    const logs =
      await NormalizationLog.find({
        reviewed: false,
        match_type: {
          $in: [
            "fuzzy",
            "unmatched",
          ],
        },
      })
        .sort({
          createdAt: -1,
        })
        .limit(100)
        .lean();

    return res.status(200).json({
      success: true,
      data: logs,
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const approveNormalization =  async (req, res) => {

    try {

      const { id } =
        req.params;

      const log =
        await NormalizationLog.findById(
          id
        );

      if (!log) {
        return res.status(404).json({
          success: false,
          message:
            "Log not found",
        });
      }
      if (log.reviewed) {
        return res.status(400).json({
            success: false,
            message: "Normalization already reviewed",
        });
      }
        if (!log.suggested_canonical_id) {
            return res.status(400).json({
                success: false,
                message:
                "No canonical entity attached to this log",
            });
        }

      const alias =
        normalizeText(
          log.raw_input
        );

      if (
        log.entity_type ===
        "company"
      ) {

        await CompanyMaster.updateOne(
          {
            canonical_id:
              log.suggested_canonical_id,
          },
          {
            $addToSet: {
              aliases:
                alias,
            },
          }
        );
        // await refreshFuseIndex();

      } else {

        await CollegeMaster.updateOne(
          {
            canonical_id:
              log.suggested_canonical_id,
          },
          {
            $addToSet: {
              aliases:
                alias,
            },
          }
        );
        // await refreshFuseIndex();
      }
      await refreshFuseIndex();
      if (log.entity_type === "company") {
        await backfillCompanyCanonical(
          log.suggested_canonical_id
        );
      } else {
        await backfillCollegeCanonical(
          log.suggested_canonical_id
        );
      }
      log.accepted = true;

      log.reviewed = true;

      await log.save();

      return res.status(200).json({
        success: true,
        message:
          "Approved successfully",
      });

    } catch (err) {

      return res.status(500).json({
        success: false,
        message:
          err.message,
      });
    }
  };

export const rejectNormalization =  async (req, res) => {

    try {

      const { id } =
        req.params;

      await NormalizationLog.findByIdAndUpdate(
        id,
        {
          reviewed: true,
          accepted: false,
        }
      );

      return res.status(200).json({
        success: true,
        message:
          "Rejected",
      });

    } catch (err) {

      return res.status(500).json({
        success: false,
        message:
          err.message,
      });
    }
  };

export const createCanonicalEntity = async (req, res) => {
  try {
    const { id } = req.params;

    // additionalLogIds — optional array of other log _ids to also
    // add as aliases under the same new canonical entity
    const { displayName, additionalLogIds = [] } = req.body;

    const log = await NormalizationLog.findById(id);

    if (!log) {
      return res.status(404).json({
        success: false,
        message: "Log not found",
      });
    }

    if (log.reviewed) {
      return res.status(400).json({
        success: false,
        message: "Already reviewed",
      });
    }

    const cleanedDisplayName =
      String(displayName || "").trim();

    if (!cleanedDisplayName) {
      return res.status(400).json({
        success: false,
        message: "displayName is required",
      });
    }

    const canonicalId =
      normalizeText(cleanedDisplayName);

    const primaryAlias =
      normalizeText(log.raw_input);

    // ==========================================
    // FETCH ADDITIONAL LOGS (if any)
    // ==========================================

    let additionalLogs = [];

    if (Array.isArray(additionalLogIds) && additionalLogIds.length > 0) {
      additionalLogs = await NormalizationLog.find({
        _id: { $in: additionalLogIds },
        entity_type: log.entity_type, // must match same type
        reviewed: false,
      });
    }

    // Build the full alias set: primary + additional raw inputs
    const allAliases = [
      primaryAlias,
      ...additionalLogs.map((l) => normalizeText(l.raw_input)),
    ];

    // Deduplicate
    const uniqueAliases = [...new Set(allAliases)];

    // ==========================================
    // CHECK EXISTING CANONICAL ENTITY
    // ==========================================

    const existingCanonical =
      log.entity_type === "company"
        ? await CompanyMaster.findOne({ canonical_id: canonicalId })
        : await CollegeMaster.findOne({ canonical_id: canonicalId });

    if (existingCanonical) {
      return res.status(400).json({
        success: false,
        message: "Canonical entity already exists",
      });
    }

    // ==========================================
    // CHECK EXISTING ALIASES (across all selected)
    // ==========================================

    for (const alias of uniqueAliases) {
      const existingAlias =
        log.entity_type === "company"
          ? await CompanyMaster.findOne({ aliases: alias })
          : await CollegeMaster.findOne({ aliases: alias });

      if (existingAlias) {
        return res.status(400).json({
          success: false,
          message: `Alias "${alias}" already belongs to ${existingAlias.display_name}`,
        });
      }
    }

    // ==========================================
    // CREATE MASTER ENTITY
    // ==========================================

    if (log.entity_type === "company") {
      await CompanyMaster.create({
        canonical_id: canonicalId,
        display_name: cleanedDisplayName,
        aliases: uniqueAliases,
      });
    } else {
      await CollegeMaster.create({
        canonical_id: canonicalId,
        display_name: cleanedDisplayName,
        aliases: uniqueAliases,
      });
    }

    // ==========================================
    // MARK PRIMARY LOG AS REVIEWED
    // ==========================================

    log.suggested_canonical_id = canonicalId;
    log.matched_display_name = cleanedDisplayName;
    log.accepted = true;
    log.reviewed = true;
    await log.save();

    // ==========================================
    // MARK ADDITIONAL LOGS AS REVIEWED
    // ==========================================

    if (additionalLogs.length > 0) {
      await NormalizationLog.updateMany(
        { _id: { $in: additionalLogs.map((l) => l._id) } },
        {
          suggested_canonical_id: canonicalId,
          matched_display_name: cleanedDisplayName,
          accepted: true,
          reviewed: true,
        }
      );
    }

    // ==========================================
    // RELOAD FUSE INDEX
    // ==========================================

    await refreshFuseIndex();

    // ==========================================
    // BACKFILL EXISTING USERS
    // ==========================================

    if (log.entity_type === "company") {
      await backfillCompanyCanonical(canonicalId);
    } else {
      await backfillCollegeCanonical(canonicalId);
    }

    return res.status(200).json({
      success: true,
      message: "Canonical entity created successfully",
    });

  } catch (err) {
    console.error("createCanonicalEntity:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

