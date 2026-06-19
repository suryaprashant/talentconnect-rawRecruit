import NormalizationLog from "../../models/normalizationLogModel.js";

import CompanyMaster
  from "../../models/companyMasterModel.js";

import CollegeMaster
  from "../../models/collegeMasterModel.js";

import { normalizeText }
  from "../../utils/normalizeText.js";
import {refreshFuseIndex} from "../../services/fuseIndexService.js";
import {backfillCompanyCanonical, backfillCollegeCanonical} from "../../services/backfillNormalizationService.js";
export const getPendingNormalizations =  async (req, res) => {
    try {
      const logs =
        await NormalizationLog.find({
          reviewed: false,
          match_type: {
            $in: ["fuzzy", "unmatched"],
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

export const createCanonicalEntity =  async (req, res) => {

    try {

      const { id } = req.params;

      const {
        displayName,
      } = req.body;

      const log =
        await NormalizationLog.findById(
          id
        );

      if (!log) {
        return res.status(404).json({
          success: false,
          message: "Log not found",
        });
      }

      if (log.reviewed) {
        return res.status(400).json({
          success: false,
          message:
            "Already reviewed",
        });
      }
      const canonicalId =
        normalizeText(
          displayName
        );

      const alias =
        normalizeText(
          log.raw_input
        );

      const existing =
        log.entity_type === "company"
          ? await CompanyMaster.findOne({
              canonical_id:
                canonicalId,
            })
          : await CollegeMaster.findOne({
              canonical_id:
                canonicalId,
            });

      if (existing) {
        return res.status(400).json({
          success: false,
          message:
            "Canonical entity already exists",
        });
      }

      
      if (
        log.entity_type ===
        "company"
      ) {

        await CompanyMaster.create({
          canonical_id:
            canonicalId,

          display_name:
            displayName,

          aliases: [alias],
        });

      } else {

        await CollegeMaster.create({
          canonical_id:
            canonicalId,

          display_name:
            displayName,

          aliases: [alias],
        });
      }

      log.suggested_canonical_id =
        canonicalId;

      log.matched_display_name =
        displayName;

      log.accepted = true;

      log.reviewed = true;

      await log.save();

      await refreshFuseIndex();
      if (log.entity_type === "company") {
        await backfillCompanyCanonical(
          canonicalId
        );
      } else {
        await backfillCollegeCanonical(
          canonicalId
        );
      }

      return res.status(200).json({
        success: true,
        message:
          "Canonical entity created",
      });

    } catch (err) {

      return res.status(500).json({
        success: false,
        message:
          err.message,
      });
    }  };