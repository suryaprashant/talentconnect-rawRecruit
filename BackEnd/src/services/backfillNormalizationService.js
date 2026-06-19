import Onboarding from "../models/studentonboardingModel.js";

import CompanyMaster from "../models/companyMasterModel.js";
import CollegeMaster from "../models/collegeMasterModel.js";

import {
  resolveCompany,
  resolveCollege,
} from "./normalizationService.js";

// =====================================================
// COMPANY BACKFILL
// =====================================================

export const backfillCompanyCanonical =
  async (canonicalId) => {

    const company =
      await CompanyMaster.findOne({
        canonical_id: canonicalId,
      }).lean();

    if (!company) {
      console.log(
        `[BACKFILL] Company ${canonicalId} not found`
      );
      return;
    }

    const users =
      await Onboarding.find({});

    console.log(
      `[BACKFILL] Scanning ${users.length} users for company ${canonicalId}`
    );

    let updatedCount = 0;

    for (const user of users) {

      let modified = false;

      // =====================================
      // CURRENT COMPANY
      // =====================================

      if (user.currentCompany) {

        const result =
          await resolveCompany(
            user.currentCompany
          );

        if (
          result &&
          result.canonicalId ===
            canonicalId
        ) {

          user.currentCompany_master_id =
            result.masterId;

          user.currentCompany_canonical_id =
            result.canonicalId;

          user.currentCompany_display =
            result.displayName;

          modified = true;
        }
      }

      // =====================================
      // EXPERIENCES
      // =====================================

      if (
        Array.isArray(
          user.experiences
        )
      ) {

        for (const exp of user.experiences) {

          if (!exp.company) {
            continue;
          }

          const result =
            await resolveCompany(
              exp.company
            );

          if (
            result &&
            result.canonicalId ===
              canonicalId
          ) {

            exp.company_master_id =
              result.masterId;

            exp.company_canonical_id =
              result.canonicalId;

            exp.company_display =
              result.displayName;

            modified = true;
          }
        }
      }

      if (modified) {

        await user.save();

        updatedCount++;
      }
    }

    console.log(
      `[BACKFILL] Company ${canonicalId} completed. Updated ${updatedCount} profiles.`
    );
  };


// =====================================================
// COLLEGE BACKFILL
// =====================================================

export const backfillCollegeCanonical =
  async (canonicalId) => {

    const college =
      await CollegeMaster.findOne({
        canonical_id: canonicalId,
      }).lean();

    if (!college) {
      console.log(
        `[BACKFILL] College ${canonicalId} not found`
      );
      return;
    }

    const users =
      await Onboarding.find({});

    console.log(
      `[BACKFILL] Scanning ${users.length} users for college ${canonicalId}`
    );

    let updatedCount = 0;

    for (const user of users) {

      let modified = false;

      for (const edu of user.educations || []) {

        if (!edu.college) {
          continue;
        }

        const result =
          await resolveCollege(
            edu.college
          );

        if (
          result &&
          result.canonicalId ===
            canonicalId
        ) {

          edu.college_master_id =
            result.masterId;

          edu.college_canonical_id =
            result.canonicalId;

          edu.college_display =
            result.displayName;

          modified = true;
        }
      }

      if (modified) {

        await user.save();

        updatedCount++;
      }
    }

    console.log(
      `[BACKFILL] College ${canonicalId} completed. Updated ${updatedCount} profiles.`
    );
  };