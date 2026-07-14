import NormalizationLog from "../../models/normalizationLogModel.js";

import CompanyMaster
  from "../../models/companyMasterModel.js";

import CollegeMaster
  from "../../models/collegeMasterModel.js";

import { normalizeText }
  from "../../utils/normalizeText.js";
import {refreshFuseIndex} from "../../services/fuseIndexService.js";
import { resolveCompany, resolveCollege }
  from "../../services/normalizationService.js";
import {backfillCompanyCanonical, backfillCollegeCanonical} from "../../services/backfillNormalizationService.js";
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

      const result =
        log.entity_type === "company"
          ? await resolveCompany(
              log.raw_input
            )
          : await resolveCollege(
              log.raw_input
            );

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