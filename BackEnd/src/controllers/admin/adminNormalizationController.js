import NormalizationLog from "../../models/normalizationLogModel.js";

import CompanyMaster from "../../models/companyMasterModel.js";

import CollegeMaster from "../../models/collegeMasterModel.js";

import Onboarding from "../../models/studentonboardingModel.js";

import mongoose from "mongoose";

import { normalizeText } from "../../utils/normalizeText.js";
import { refreshFuseIndex } from "../../services/fuseIndexService.js";
import {
  resolveCompany,
  resolveCollege,
} from "../../services/normalizationService.js";
import {
  backfillCompanyCanonical,
  backfillCollegeCanonical,
} from "../../services/backfillNormalizationService.js";
export const getPendingNormalizations = async (req, res) => {
  try {
    // =====================================
    // RECALCULATE PENDING LOGS
    // =====================================

    // const pendingLogs =
    //   await NormalizationLog.find({
    //     reviewed: false,
    //   });

    // for (const log of pendingLogs) {

    // const result =
    //   log.entity_type === "company"
    //     ? await resolveCompany(
    //         log.raw_input
    //       )
    //     : await resolveCollege(
    //         log.raw_input
    //       );

    // if (result) {

    //   log.suggested_canonical_id =
    //     result.canonicalId;

    //   log.matched_display_name =
    //     result.displayName;

    //   log.confidence =
    //     result.confidence;

    //   log.match_type =
    //     result.matchType;

    // } else {

    //   log.suggested_canonical_id =
    //     null;

    //   log.matched_display_name =
    //     null;

    //   log.confidence =
    //     null;

    //   log.match_type =
    //     "unmatched";
    // }

    // await log.save();
    // }

    // =====================================
    // FETCH UPDATED LOGS
    // =====================================

    const logs = await NormalizationLog.find({
      reviewed: false,
      match_type: {
        $in: [
          "fuzzy",
          "unmatched",
          // "first_instance",
        ],
      },
    })
      .sort({
        createdAt: -1,
      })
      .limit(100)
      .lean();


    console.log("logs",logs);  

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

export const approveNormalization = async (req, res) => {
  try {
    const { id } = req.params;

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
        message: "Normalization already reviewed",
      });
    }
    if (!log.suggested_canonical_id) {
      return res.status(400).json({
        success: false,
        message: "No canonical entity attached to this log",
      });
    }

    const alias = normalizeText(log.raw_input);

    if (log.entity_type === "company") {
      await CompanyMaster.updateOne(
        {
          canonical_id: log.suggested_canonical_id,
        },
        {
          $addToSet: {
            aliases: alias,
          },
        },
      );
      // await refreshFuseIndex();
    } else {
      await CollegeMaster.updateOne(
        {
          canonical_id: log.suggested_canonical_id,
        },
        {
          $addToSet: {
            aliases: alias,
          },
        },
      );
      // await refreshFuseIndex();
    }
    await refreshFuseIndex();
    if (log.entity_type === "company") {
      await backfillCompanyCanonical(log.suggested_canonical_id);
    } else {
      await backfillCollegeCanonical(log.suggested_canonical_id);
    }
    log.accepted = true;

    log.reviewed = true;

    await log.save();

    return res.status(200).json({
      success: true,
      message: "Approved successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const rejectNormalization = async (req, res) => {
  try {
    const { id } = req.params;

    await NormalizationLog.findByIdAndUpdate(id, {
      reviewed: true,
      accepted: false,
    });

    return res.status(200).json({
      success: true,
      message: "Rejected",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
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

    const cleanedDisplayName = String(displayName || "").trim();

    if (!cleanedDisplayName) {
      return res.status(400).json({
        success: false,
        message: "displayName is required",
      });
    }

    const canonicalId = normalizeText(cleanedDisplayName);

    const primaryAlias = normalizeText(log.raw_input);

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
        },
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

export const mergeCanonicalEntity = async (req, res) => {
  try {
    const {
      masterId: rawMasterIds,
      canonicalId: rawCanonicalId,
      displayName: rawDisplayName,
    } = req.body;

    // =====================================================
    // VALIDATION
    // =====================================================

    if (!Array.isArray(rawMasterIds) || rawMasterIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "masterId must be a non-empty array",
      });
    }

    const cleanedCanonicalId = normalizeText(rawCanonicalId || "");
    const cleanedDisplayName =
      typeof rawDisplayName === "string" ? rawDisplayName.trim() : "";

    if (!cleanedCanonicalId) {
      return res.status(400).json({
        success: false,
        message: "canonicalId is required",
      });
    }

    if (!cleanedDisplayName) {
      return res.status(400).json({
        success: false,
        message: "displayName is required",
      });
    }

    // =====================================================
    // CLEAN AND VALIDATE MASTER IDS
    // =====================================================

    const uniqueMasterIdStrings = [
      ...new Set(
        rawMasterIds.map((id) => String(id || "").trim()).filter(Boolean),
      ),
    ];

    if (uniqueMasterIdStrings.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid master IDs were provided",
      });
    }

    const invalidMasterIds = uniqueMasterIdStrings.filter(
      (id) => !mongoose.Types.ObjectId.isValid(id),
    );

    if (invalidMasterIds.length > 0) {
      return res.status(400).json({
        success: false,
        message: "One or more master IDs are invalid",
        invalidMasterIds,
      });
    }

    const objectMasterIds = uniqueMasterIdStrings.map(
      (id) => new mongoose.Types.ObjectId(id),
    );

    /*
     * Supports master_id stored as:
     * 1. ObjectId
     * 2. String
     * 3. Mixed type
     */
    const masterIdCandidates = [...objectMasterIds, ...uniqueMasterIdStrings];

    console.log("Requested master IDs:", uniqueMasterIdStrings);
    console.log("Master ID candidates:", masterIdCandidates);

    // =====================================================
    // FETCH UNREVIEWED NORMALIZATION LOGS
    // =====================================================

    const logs = await NormalizationLog.find({
      reviewed: false,
      master_id: {
        $in: masterIdCandidates,
      },
    });

    console.log(`Found ${logs.length} normalization logs`);

    if (logs.length === 0) {
      // Debug lookup without reviewed filter
      const existingLogs = await NormalizationLog.find({
        master_id: {
          $in: masterIdCandidates,
        },
      })
        .select("_id master_id entity_type reviewed accepted raw_input")
        .lean();

      return res.status(404).json({
        success: false,
        message: "No unreviewed logs found with the provided master IDs",
        debug: {
          requestedMasterIds: uniqueMasterIdStrings,
          existingLogs,
        },
      });
    }

    // =====================================================
    // VALIDATE ENTITY TYPE
    // =====================================================

    const entityTypes = [
      ...new Set(
        logs
          .map((log) =>
            String(log.entity_type || "")
              .trim()
              .toLowerCase(),
          )
          .filter(Boolean),
      ),
    ];

    if (entityTypes.length !== 1) {
      return res.status(400).json({
        success: false,
        message: "All selected logs must belong to the same entity type",
        entityTypes,
      });
    }

    const entityType = entityTypes[0];

    if (!["company", "college"].includes(entityType)) {
      return res.status(400).json({
        success: false,
        message: `Unsupported entity type: ${entityType}`,
      });
    }

    const MasterModel =
      entityType === "company" ? CompanyMaster : CollegeMaster;

    // =====================================================
    // FETCH REQUESTED MASTER RECORDS
    // =====================================================

    const requestedMasters = await MasterModel.find({
      _id: {
        $in: objectMasterIds,
      },
    });

    if (requestedMasters.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No master entities found with the provided master IDs",
      });
    }

    // =====================================================
    // CHECK FOR AN EXISTING CANONICAL MASTER
    // =====================================================

    /*
     * If another master already uses cleanedCanonicalId,
     * use it as the final master instead of causing a duplicate
     * canonical_id error.
     */
    const existingCanonicalMaster = await MasterModel.findOne({
      canonical_id: cleanedCanonicalId,
    });

    let finalMasterEntity;

    if (existingCanonicalMaster) {
      finalMasterEntity = existingCanonicalMaster;
    } else {
      finalMasterEntity = requestedMasters[0];
    }

    const finalMasterIdString = finalMasterEntity._id.toString();

    // Include final master in alias collection when it wasn't selected
    const allMastersMap = new Map();

    for (const master of requestedMasters) {
      allMastersMap.set(master._id.toString(), master);
    }

    allMastersMap.set(finalMasterEntity._id.toString(), finalMasterEntity);

    const allMasters = [...allMastersMap.values()];

    // IDs that are being merged into the final master
    const sourceMasterIdStrings = [
      ...new Set([
        ...uniqueMasterIdStrings,
        ...allMasters.map((master) => master._id.toString()),
      ]),
    ];

    const sourceObjectIds = sourceMasterIdStrings
      .filter((id) => mongoose.Types.ObjectId.isValid(id))
      .map((id) => new mongoose.Types.ObjectId(id));

    const sourceIdCandidates = [...sourceObjectIds, ...sourceMasterIdStrings];

    const sourceMasterIdSet = new Set(sourceMasterIdStrings);

    // =====================================================
    // COLLECT AND NORMALIZE ALIASES
    // =====================================================

    const aliasesSet = new Set();

    const addAlias = (value) => {
      const normalizedValue = normalizeText(String(value || ""));

      if (normalizedValue) {
        aliasesSet.add(normalizedValue);
      }
    };

    for (const master of allMasters) {
      addAlias(master.canonical_id);
      addAlias(master.display_name);

      if (Array.isArray(master.aliases)) {
        for (const alias of master.aliases) {
          addAlias(alias);
        }
      }
    }

    for (const log of logs) {
      addAlias(log.raw_input);
      addAlias(log.preprocessed_input);
      addAlias(log.suggested_canonical_id);
      addAlias(log.matched_display_name);
    }

    addAlias(cleanedCanonicalId);
    addAlias(cleanedDisplayName);

    const aliases = [...aliasesSet];

    // =====================================================
    // UPDATE FINAL MASTER ENTITY
    // =====================================================

    finalMasterEntity.canonical_id = cleanedCanonicalId;
    finalMasterEntity.display_name = cleanedDisplayName;
    finalMasterEntity.aliases = aliases;

    await finalMasterEntity.save();

    // =====================================================
    // UPDATE NORMALIZATION LOGS
    // =====================================================

    const logUpdateResult = await NormalizationLog.updateMany(
      {
        master_id: {
          $in: sourceIdCandidates,
        },
        reviewed: false,
      },
      {
        $set: {
          suggested_canonical_id: cleanedCanonicalId,
          matched_display_name: cleanedDisplayName,
          master_id: finalMasterEntity._id,
          accepted: true,
          reviewed: true,
        },
      },
    );

    // =====================================================
    // BACKFILL ONBOARDING USERS
    // =====================================================

    let users = [];

    if (entityType === "company") {
      users = await Onboarding.find({
        $or: [
          {
            currentCompany_master_id: {
              $in: sourceIdCandidates,
            },
          },
          {
            "experiences.company_master_id": {
              $in: sourceIdCandidates,
            },
          },
        ],
      });
    } else {
      users = await Onboarding.find({
        "educations.college_master_id": {
          $in: sourceIdCandidates,
        },
      });
    }

    console.log(
      `Found ${users.length} onboarding users for ${entityType} backfill`,
    );

    let usersUpdated = 0;

    for (const user of users) {
      let modified = false;

      if (entityType === "company") {
        // Update top-level current company
        const currentCompanyMasterId = user.currentCompany_master_id
          ? user.currentCompany_master_id.toString()
          : null;

        if (
          currentCompanyMasterId &&
          sourceMasterIdSet.has(currentCompanyMasterId)
        ) {
          // user.currentCompany = cleanedDisplayName;
          user.currentCompany_canonical_id = cleanedCanonicalId;
          user.currentCompany_display = cleanedDisplayName;
          user.currentCompany_master_id = finalMasterEntity._id;

          modified = true;
        }

        // Update experience company references
        if (Array.isArray(user.experiences)) {
          for (const experience of user.experiences) {
            const experienceMasterId = experience.company_master_id
              ? experience.company_master_id.toString()
              : null;

            if (
              experienceMasterId &&
              sourceMasterIdSet.has(experienceMasterId)
            ) {
              // experience.company = cleanedDisplayName;
              experience.company_canonical_id = cleanedCanonicalId;
              experience.company_display = cleanedDisplayName;
              experience.company_master_id = finalMasterEntity._id;

              modified = true;

              if (experience.isCurrent === true) {
                // user.currentCompany = cleanedDisplayName;
                user.currentCompany_canonical_id = cleanedCanonicalId;
                user.currentCompany_display = cleanedDisplayName;
                user.currentCompany_master_id = finalMasterEntity._id;
              }
            }
          }

          user.markModified("experiences");
        }
      } else {
        // Update education college references
        if (Array.isArray(user.educations)) {
          for (const education of user.educations) {
            const educationMasterId = education.college_master_id
              ? education.college_master_id.toString()
              : null;

            if (educationMasterId && sourceMasterIdSet.has(educationMasterId)) {
              // education.college = cleanedDisplayName;
              education.college_canonical_id = cleanedCanonicalId;
              education.college_display = cleanedDisplayName;
              education.college_master_id = finalMasterEntity._id;

              modified = true;
            }
          }

          user.markModified("educations");
        }
      }

      if (modified) {
        await user.save();
        usersUpdated += 1;

        console.log(`Updated onboarding user ${user._id}`);
      }
    }

    // =====================================================
    // DELETE DUPLICATE MASTER ENTITIES
    // =====================================================

    const duplicateMasterIds = sourceObjectIds.filter(
      (id) => id.toString() !== finalMasterIdString,
    );

    let mastersDeleted = 0;

    if (duplicateMasterIds.length > 0) {
      const deleteResult = await MasterModel.deleteMany({
        _id: {
          $in: duplicateMasterIds,
        },
      });

      mastersDeleted = deleteResult.deletedCount || 0;
    }

    // =====================================================
    // REFRESH FUSE INDEX
    // =====================================================

    await refreshFuseIndex();

    // =====================================================
    // RUN ADDITIONAL BACKFILL
    // =====================================================

    if (entityType === "company") {
      await backfillCompanyCanonical(cleanedCanonicalId);
    } else {
      await backfillCollegeCanonical(cleanedCanonicalId);
    }

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,
      message: "Master entities merged successfully",
      data: {
        entityType,
        masterId: finalMasterEntity._id,
        canonicalId: cleanedCanonicalId,
        displayName: cleanedDisplayName,
        aliases,
        requestedMasterIds: uniqueMasterIdStrings,
        mastersFound: requestedMasters.length,
        mastersDeleted,
        logsFound: logs.length,
        logsUpdated: logUpdateResult.modifiedCount || 0,
        usersFound: users.length,
        usersUpdated,
      },
    });
  } catch (error) {
    console.error("createCanonicalEntity error:", error);

    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A master entity already exists with this canonical ID",
        duplicateKey: error.keyValue || null,
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const getAllData = async (req, res) => {
  try {
    const company_data = await CompanyMaster.find(
      {},
      { canonical_id: 1, _id: 0 }
    ).sort({ canonical_id: 1 });

    const college_data = await CollegeMaster.find(
      {},
      { canonical_id: 1, _id: 0 }
    ).sort({ canonical_id: 1 });

    res.status(200).json({
      success: true,
      company_data,
      college_data,
    });
  } catch (error) {
    console.error("Get Company Master Data Error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};