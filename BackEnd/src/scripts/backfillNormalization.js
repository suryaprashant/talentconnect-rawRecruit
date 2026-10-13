import mongoose from "mongoose";
import dotenv from "dotenv";

import Onboarding from "../models/studentonboardingModel.js";

import {
  resolveCollege,
  resolveCompany,
} from "../services/normalizationService.js";

dotenv.config();

const backfill = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);

    console.log("Connected");

    const users = await Onboarding.find({});

    console.log(
      `Found ${users.length} profiles`
    );

    for (const user of users) {
      let modified = false;

      // EDUCATIONS
      if (
        Array.isArray(user.educations)
      ) {
        for (const edu of user.educations) {
          if (!edu.college) continue;

          try {
            const result =
              await resolveCollege(
                edu.college
              );

            if (!result) continue;

            edu.college_master_id =
              result.masterId;

            edu.college_canonical_id =
              result.canonicalId;

            edu.college_display =
              result.displayName;

            modified = true;

          } catch (err) {
            console.error(
              "College error:",
              edu.college
            );
          }
        }
      }

      // EXPERIENCES
      if (
        Array.isArray(user.experiences)
      ) {
        for (const exp of user.experiences) {
          if (!exp.company) continue;

          try {
            const result =
              await resolveCompany(
                exp.company
              );

            if (!result) continue;

            exp.company_master_id =
              result.masterId;

            exp.company_canonical_id =
              result.canonicalId;

            exp.company_display =
              result.displayName;

            modified = true;

          } catch (err) {
            console.error(
              "Company error:",
              exp.company
            );
          }
        }
      }

      // CURRENT COMPANY
      if (user.currentCompany) {
        try {
          const result =
            await resolveCompany(
              user.currentCompany
            );

          if (result) {
            user.currentCompany_master_id =
              result.masterId;

            user.currentCompany_canonical_id =
              result.canonicalId;

            user.currentCompany_display =
              result.displayName;

            modified = true;
          }
        } catch (err) {
          console.error(
            "Current company error:",
            user.currentCompany
          );
        }
      }

      if (modified) {

      await Onboarding.updateOne(
        { _id: user._id },
        {
          $set: {
            educations: user.educations,
            experiences: user.experiences,
            currentCompany_master_id:
              user.currentCompany_master_id,
            currentCompany_canonical_id:
              user.currentCompany_canonical_id,
            currentCompany_display:
              user.currentCompany_display,
          },
        }
      );

      console.log(
        `Updated profile ${user._id}`
      );
    }
    }

    console.log("Backfill completed");

    process.exit(0);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

backfill();