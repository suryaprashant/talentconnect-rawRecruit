import Onboarding from "../models/studentonboardingModel.js";
import { createNotification } from "./notificationService.js";
import {
  buildCollegeAlumniQuery,
  buildCompanyAlumniQuery,
} from "../services/entityQueryService.js";
console.log("✅✅✅ alumniNetworkWorker LOADED ✅✅✅");
export const processAlumniNetworkNotification =
  async (onboardingId) => {
    console.error("\n🟣🟣🟣 processAlumniNetworkNotification CALLED 🟣🟣🟣");
    console.error("onboardingId:", onboardingId);
    console.error("🟣🟣🟣\n");
    try {
      const profile =
        await Onboarding.findById(
          onboardingId
        ).lean();

      if (!profile) {
        console.log(
          `[ALUMNI NETWORK] Profile not found: ${onboardingId}`
        );
        return;
      }

      const userId =
        profile.userId;

      // =====================================================
      // BUILD NORMALIZED QUERIES
      // =====================================================

      const collegeQuery =
        buildCollegeAlumniQuery(
          profile,
          userId
        );

      const companyQuery =
        buildCompanyAlumniQuery(
          profile,
          userId
        );

      // For debugging / response

      const colleges = [
        ...new Set(
          (profile.educations || [])
            .map(
              (edu) =>
                edu.college_canonical_id ||
                edu.college
            )
            .filter(Boolean)
        ),
      ];

      const uniqueCompanies = [
        ...new Set([
          profile.currentCompany_canonical_id ||
            profile.currentCompany,

          ...(profile.experiences || [])
            .map(
              (exp) =>
                exp.company_canonical_id ||
                exp.company
            ),
        ].filter(Boolean)),
      ];
      // =====================================================
      // FETCH MATCHING USERS
      // =====================================================

      let collegeAlumni = [];
      let companyAlumni = [];

      if (collegeQuery) {
        collegeAlumni =
          await Onboarding.find(
            collegeQuery
          ).lean();
      }

      if (companyQuery) {
        companyAlumni =
          await Onboarding.find(
            companyQuery
          ).lean();
      }
      // =====================================================
      // REMOVE DUPLICATES
      // =====================================================

      const recipientsMap =
        new Map();

      collegeAlumni.forEach(
        (person) => {
          if (
            person.userId
          ) {
            recipientsMap.set(
              person.userId.toString(),
              person
            );
          }
        }
      );

      companyAlumni.forEach(
        (person) => {
          if (
            person.userId
          ) {
            recipientsMap.set(
              person.userId.toString(),
              person
            );
          }
        }
      );

      const recipients =
        Array.from(
          recipientsMap.values()
        );

      console.log(
        `[ALUMNI NETWORK] Found ${recipients.length} recipients for ${profile.name}`
      );

      // =====================================================
      // CREATE NOTIFICATIONS
      // =====================================================

      await Promise.all(
        recipients.map(
          async (recipient) => {

            try {
              console.error(`\n🟠🟠🟠 Creating notification for recipient ${recipient.userId} 🟠🟠🟠\n`);
              // ✅ CORRECTED: No jobId/jobType needed for alumni notifications
              // The deep link will use userId to navigate to alumni profile
              await createNotification({
                recipientId: recipient.userId,      // Person who will see the notification
                senderId: profile.userId,           // The new alumni who joined
                type: "NEW_ALUMNI_JOINED_NETWORK",  // Notification type
                message: `${profile.name} joined your alumni network`,
                referenceId: profile._id,           // The new alumni's onboarding profile
                userId: profile.userId,             // ✅ CRITICAL: Pass the new alumni's userId
                // NO jobId, NO jobType (not applicable for alumni notifications)
              });
               console.error(`🟠 Notification created successfully for ${recipient.userId}\n`);
            } catch (err) {
              console.error(
                `[ALUMNI NETWORK] Failed notification for recipient ${recipient.userId}`,
                err.message
              );
            }
          }
        )
      );

      console.log(
        `[ALUMNI NETWORK] Notifications created successfully`
      );
    } catch (error) {
      console.error(
        "[ALUMNI NETWORK] Worker Error:",
        error
      );

      throw error;
    }
  };