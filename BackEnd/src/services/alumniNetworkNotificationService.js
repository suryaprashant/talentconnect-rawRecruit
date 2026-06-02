import Onboarding from "../models/studentonboardingModel.js";
import { createNotification } from "./notificationService.js";

export const processAlumniNetworkNotification =
  async (onboardingId) => {
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
      // BUILD COLLEGE LIST
      // =====================================================

      const colleges = [
        ...new Set(
          (profile.educations || [])
            .map((edu) => edu.college)
            .filter(Boolean)
        ),
      ];

      const collegeQuery =
        colleges.length > 0
          ? {
              "educations.college": {
                $in: colleges,
              },

              userId: {
                $ne: userId,
              },
            }
          : null;

      // =====================================================
      // BUILD COMPANY LIST
      // =====================================================

      const allCompanies = [];

      if (profile.currentCompany) {
        allCompanies.push(
          profile.currentCompany
        );
      }

      profile.experiences?.forEach(
        (exp) => {
          if (exp.company) {
            allCompanies.push(
              exp.company
            );
          }
        }
      );

      const uniqueCompanies = [
        ...new Map(
          allCompanies.map((c) => [
            c.toLowerCase(),
            c,
          ])
        ).values(),
      ];

      let companyQuery = null;

      if (
        uniqueCompanies.length > 0
      ) {
        const orConditions =
          uniqueCompanies.flatMap(
            (company) => {
              const regex =
                new RegExp(
                  `^${company.replace(
                    /[.*+?^${}()|[\]\\]/g,
                    "\\$&"
                  )}$`,
                  "i"
                );

              return [
                {
                  currentCompany:
                    regex,
                },
                {
                  "experiences.company":
                    regex,
                },
              ];
            }
          );

        companyQuery = {
          userId: {
            $ne: userId,
          },

          $or: orConditions,
        };
      }

      // =====================================================
      // FETCH MATCHING USERS
      // =====================================================

      const queries = [];

      if (collegeQuery) {
        queries.push(
          Onboarding.find(
            collegeQuery
          ).lean()
        );
      }

      if (companyQuery) {
        queries.push(
          Onboarding.find(
            companyQuery
          ).lean()
        );
      }

      const results =
        await Promise.all(
          queries
        );

      const collegeAlumni =
        results[0] || [];

      const companyAlumni =
        results.length > 1
          ? results[1]
          : [];

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
              await createNotification(
                {
                  recipientId:
                    recipient.userId,

                  senderId:
                    profile.userId,

                  type:
                    "NEW_ALUMNI_JOINED_NETWORK",

                  message: `${profile.name} joined your alumni network`,

                  referenceId:
                    profile._id,

                  meta: {
                    onboardingId:
                      profile._id,

                    profileType:
                      profile.profileType,

                    name:
                      profile.name,

                    currentCompany:
                      profile.currentCompany,

                    colleges,
                  },
                }
              );
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