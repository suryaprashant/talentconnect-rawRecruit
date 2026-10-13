import Onboarding from "../models/studentonboardingModel.js";
import {
  getAllAlumni,
  getAlumniReferredService,
} from "../services/alumniService.js";
import { JobPostingTable } from "../models/jobPostingsModel.js";
import { fetchTrendingThreshold } from "../utils/relevancyEngine.js";
import Application from "../models/applicationModel.js";

export const alumniPosted = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get current user's profile
    const myProfile = await Onboarding.findOne({
      userId,
    }).lean();

    if (!myProfile) {
      return res.status(404).json({
        success: false,
        message: "User profile not found",
      });
    }

    // Get all alumni related to the current user
    const alumniList = await getAllAlumni(myProfile, userId);

    if (!alumniList.length) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    // Get Auth user IDs of all alumni
    const alumniUserIds = alumniList
      .map((alumni) => alumni.userId)
      .filter(Boolean);

    // Get all jobs posted by these alumni
    const jobs = await JobPostingTable.find({
      postedByUser: { $in: alumniUserIds },
       approvalStatus: "Approved",
    }).lean();

    // Map alumni by their Auth userId
    const alumniMap = new Map(
      alumniList.map((alumni) => [alumni.userId.toString(), alumni]),
    );

    const result = jobs
      .map((job) => {
        const alumni = alumniMap.get(job.postedByUser?.toString());

        if (!alumni) return null;

        const alumniName = alumni.name || "An alumnus";

        // =====================================================
        // FIND HOW THIS PERSON IS AN ALUMNI
        // =====================================================

        let organization = null;

        // -----------------------------------------------------
        // 1. Check common college
        // -----------------------------------------------------

        const myColleges = (myProfile.educations || [])
          .map((edu) => edu.college_canonical_id || edu.college)
          .filter(Boolean);

        const alumniColleges = (alumni.educations || [])
          .map((edu) => edu.college_canonical_id || edu.college)
          .filter(Boolean);

        const commonCollege = myColleges.find((college) =>
          alumniColleges.includes(college),
        );

        if (commonCollege) {
          // Prefer the display name
          organization =
            myProfile.educations?.find(
              (edu) =>
                (edu.college_canonical_id || edu.college) === commonCollege,
            )?.college_display ||
            alumni.educations?.find(
              (edu) =>
                (edu.college_canonical_id || edu.college) === commonCollege,
            )?.college_display ||
            commonCollege;
        }

        // -----------------------------------------------------
        // 2. If no common college, check common company
        // -----------------------------------------------------

        if (!organization) {
          const myCompanies = [
            myProfile.currentCompany_canonical_id || myProfile.currentCompany,

            ...(myProfile.experiences || []).map(
              (exp) => exp.company_canonical_id || exp.company,
            ),
          ].filter(Boolean);

          const alumniCompanies = [
            alumni.currentCompany_canonical_id || alumni.currentCompany,

            ...(alumni.experiences || []).map(
              (exp) => exp.company_canonical_id || exp.company,
            ),
          ].filter(Boolean);

          const commonCompany = myCompanies.find((company) =>
            alumniCompanies.includes(company),
          );

          if (commonCompany) {
            organization =
              alumni.currentCompany_display ||
              alumni.currentCompany ||
              alumni.experiences?.find(
                (exp) =>
                  (exp.company_canonical_id || exp.company) === commonCompany,
              )?.company_display ||
              commonCompany;
          }
        }

        // Fallback
        if (!organization) {
          organization = "Alumni";
        }

        // =====================================================
        // JOB ROLE
        // =====================================================

        const jobRole =
          job.jobRoles?.length > 0
            ? job.jobRoles.join(", ")
            : job.jobTitle?.length > 0
              ? job.jobTitle.join(", ")
              : "a job";

        return {
          jobId: job._id,
          alumniId: alumni.userId,
          message: `${alumniName} (${organization}) posted a job for ${jobRole}.`,
        };
      })
      .filter(Boolean);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching alumni posted jobs:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const alumniGotReferred = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get current user's Onboarding profile
    const myProfile = await Onboarding.findOne({
      userId,
    }).lean();

    if (!myProfile) {
      return res.status(404).json({
        success: false,
        message: "User profile not found",
      });
    }

    const data = await getAlumniReferredService(myProfile, userId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("alumniReferred controller error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const trendingjobs = async (req, res) => {
  try {
    const threshold = await fetchTrendingThreshold();

    const applicants = threshold.value?.applicants ?? 0;
    const daysCount = threshold.value?.daysCount ?? 1;

    // Base match condition
    const matchStage = {
      currentStatus: { $ne: "Saved" },
    };

    // daysCount > 0 → only applications from last X days
    // daysCount === 0 → consider ALL applications
    if (daysCount > 0) {
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - daysCount);

      matchStage.createdAt = {
        $gte: fromDate,
      };
    }

    const trendingJobs = await Application.aggregate([
      {
        $match: {
          ...matchStage,
          isAskForReferral: { $ne: true },
        },
      },

      {
        $group: {
          _id: "$job",
          applicationCount: { $sum: 1 },
        },
      },

      {
        $match: {
          applicationCount: { $gt: applicants },
        },
      },

      {
        $lookup: {
          from: "jobpostingtables",
          localField: "_id",
          foreignField: "_id",
          as: "job",
        },
      },

      {
        $unwind: "$job",
      },

      // Exclude off-campus jobs
      {
        $match: {
          "job.jobType": { $ne: "off-campus" },
        },
      },

      {
        $project: {
          _id: 0,
          jobId: "$_id",
          applicationCount: 1,
          job: 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      trendingJobs,
    });
  } catch (error) {
    console.error("Error fetching trending jobs:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch trending jobs",
    });
  }
};
