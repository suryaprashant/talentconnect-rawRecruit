import {
  ChangeStatusService,
  createApplicationService,
  fetchApplicationStatusService,
  fetchApplicationsByJobService,
  fetchCandidatesbyStatus,
  fetchCollegeApplicationsByJobService,
  getApplicationService,
  getSavedJobsService,
  saveJobService,
  fetchCompanyDashboardMetrics,
  getSavedCollegesService,
  fetchCollegeSideApplicationsByJobService,
  createInternshipApplicationService,
  fetchProfessionalDashboardMetrics,
  getCandidateDashboardStatsService,
  // getApplicationService,
  // getOffCampusApplicantsService, fetchShortlistedCandidates, fetchInternshipApplicationService, fetchApplicationStatusService
} from "../services/applicationService.js";
import {
  getCollegeEmail,
  getCollegeService,
} from "../services/collegeService.js";
import {
  getCompanyEmail,
  getCompanyService,
  getEmployerService,
} from "../services/companyService.js";
// import { checkJobListingOpportunityService, checkOpportunityService } from "../services/Job.service.js";
import {
  getCandidatEmail,
  getStudentService,
} from "../services/studentService.js";
import sendStatusChangeEmail from "../utils/sendStatusChangeEmail.js";
import sendScheduledInterviewEmail from "../utils/sendScheduledInterviewEmail.js";
import { submitAlternateDatesService } from "../services/alternateDateService.js";
// import { getCompanyProfile } from "./CompanyDashboard/companyProfileController.js";
import {
  notifyCollegeOnCompanyApply,
  notifyCollegeOnInterviewScheduled,
  notifyCompanyOnCollegeApply,
  notifyCompanyOnStudentApply,
  notifyOnApplicationStatusChange,
  notifyOnCollegeApplicationStatusChange,
} from "../services/notificationService.js";
import CompanyProfile from "../models/companyDashboard/companyProfileModel.js";
import CollegeOnboarding from "../models/collegeDashboard/collegeOnboardingModel.js";
import { unsaveJobService } from "../services/applicationService.js";
import { JobPostingTable } from "../models/jobPostingsModel.js";
import InterviewSchedule from "../models/InterviewSchedule.Model.js";
import { resolveStudentAuthId } from "../utils/resolveStudentAuthId.js";
import {
  fetchReferralApplicationsService,
  getAllProfessionalReferralsService,
  getCompanyReferralFeedService,
  fetchProfessionalReferralMetrics,
  getReferralAskedService,
} from "../controllers/../services/adminService.js";
import Application from "../models/applicationModel.js";
import Onboarding from "../models/studentonboardingModel.js";
import { scheduleScoreUpdate } from "../utils/scheduleScoreUpdate.js";
import { paginatedResponse } from "../utils/paginate.js";
/// export const getReferralsForCompany = async (req, res, next) => {
//   try {
//     const userId = req.user._id;
//     let professionalProfileId = req.user._id;

//     // Resolve Professional Profile if not in token
//     if (!professionalProfileId) {
//       const profile = await getStudentService(userId);
//       if (profile?.success && profile.data?.length > 0) {
//         professionalProfileId = profile.data[0]._id;
//       }
//     }

//     if (!professionalProfileId) {
//       return res.status(404).json({ success: false, message: "Professional profile not found." });
//     }

//     // Use the service that looks for jobs POSTED by this professional
//     const response = await getAllProfessionalReferralsService(professionalProfileId);
//     return res.status(200).json(response);
//   } catch (error) {
//     next(error);
//   }
// };

export async function getCandidateDashboardStats(req, res) {
  try {
    const userId = req.user._id;
    const userType = req.user.userType;

    const allowedTypes = ["student", "fresher", "professional"];
    if (!allowedTypes.includes(userType)) {
      return res.status(403).json({ error: "Access denied. Candidates only." });
    }

    const user = await getStudentService(userId);
    if (!user?.data?.length) {
      return res.status(404).json({ error: "User profile not found" });
    }

    const profileId = user.data[0]._id;
    const result = await getCandidateDashboardStatsService(profileId);

    return res.status(200).json(result);
  } catch (error) {
    console.error("getCandidateDashboardStats error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export const getProfessionalReferralMetrics = async (req, res) => {
  try {
    const userId = req.user._id;

    // Resolve the professional's onboarding profile ID
    const userProfile = await getStudentService(userId);

    if (!userProfile?.data?.length) {
      return res.status(404).json({
        success: false,
        message: "Professional profile not found.",
      });
    }

    const professionalProfileId = userProfile.data[0]._id;

    const metrics = await fetchProfessionalReferralMetrics(
      professionalProfileId,
    );

    return res.status(200).json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    console.error("❌ getProfessionalReferralMetrics error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getReferralsForCompany = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const userProfile = await getStudentService(userId);
    console.log(
      "👤 userProfile:",
      JSON.stringify(userProfile?.data?.[0], null, 2),
    );

    if (!userProfile?.data?.length) {
      return res
        .status(404)
        .json({ success: false, message: "Professional profile not found." });
    }

    const professionalProfileId = userProfile.data[0]._id;
    console.log("🔑 professionalProfileId:", professionalProfileId);

    // ✅ DEBUG: Check raw applications
    const rawApps = await Application.find({ jobType: "Referral" })
      .limit(5)
      .lean();
    console.log(
      "📋 Raw Referral Applications:",
      JSON.stringify(rawApps, null, 2),
    );

    // ✅ DEBUG: Check jobs posted by this professional
    const jobs = await JobPostingTable.find({
      candidatePosted: professionalProfileId,
      jobType: "Referral",
    }).lean();
    console.log(
      "💼 Jobs posted by professional:",
      JSON.stringify(jobs, null, 2),
    );

    const response = await getAllProfessionalReferralsService(
      professionalProfileId,
    );
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getGlobalReferralApplications = async (req, res, next) => {
  try {
    const userId = req.user._id;

    console.log(userId);

    // Resolve professional profile
    const userProfile = await getStudentService(userId);

    if (!userProfile || !userProfile.data || userProfile.data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Professional profile not found for this account.",
      });
    }

    const professionalProfileId = userProfile.data[0]._id;

    console.log(professionalProfileId);

    // Fetch all referrals
    const response = await getAllProfessionalReferralsService(
      professionalProfileId,
      req.pagination,
    );

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// controllers/professionalController.js
export const getReferralApplicationsForProfessional = async (
  req,
  res,
  next,
) => {
  try {
    const professionalProfileId = req.user.profileId;
    const { jobId, adminApprovalStatus, isVisited } = req.query;

    // ✅ FIX: declare isVisitedBool properly
    const isVisitedBool =
      isVisited === "true" ? true : isVisited === "false" ? false : undefined;

    const response = await fetchReferralApplicationsService({
      professionalProfileId,
      jobId,
      adminApprovalStatus: adminApprovalStatus || "Approved",
      currentStatus: "Application Sent",
      isVisited: isVisitedBool,
    });

    // ✅ Mark as visited AFTER fetching new ones
    if (isVisitedBool === false && jobId) {
      await Application.updateMany(
        {
          job: jobId,
          isVisited: false,
          jobType: "Referral",
          currentStatus: "Application Sent",
        },
        { $set: { isVisited: true } },
      );
    }

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
// ==============================
// FETCH REFERRED CANDIDATES PIPELINE
// ==============================

export const getReferredCandidatesPipeline = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { page, limit, skip } = req.pagination;
    // Resolve professional profile
    const userProfile = await getStudentService(userId);

    if (!userProfile || !userProfile.data || userProfile.data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Professional profile not found.",
      });
    }

    const professionalProfileId = userProfile.data[0]._id;

    // Fetch all jobs posted by this professional
    const jobs = await JobPostingTable.find({
      candidatePosted: professionalProfileId, // <-- CHANGE THIS FIELD IF NEEDED
    }).select("_id");

    const jobIds = jobs.map((job) => job._id);

    // Fetch referral pipeline applications
    const query = {
      job: { $in: jobIds },
      jobType: "Referral",
      currentStatus: {
        $in: [
          "Referred To Company",
          "Shortlisted",
          "Interview Scheduled",
          "Offer Extended",
          "Accepted",
          "Rejected",
          "Offer Accepted",
          "Offer Rejected",
          "Joined the Company",
        ],
      },
    };

    const [applications, total] = await Promise.all([
      Application.find(query)
        .populate("job")
        .populate({
          path: "applicant",
          select: "userId name email profileImage",
        })
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit),

      Application.countDocuments(query),
    ]);

    const cleanedApplications = applications.map((application) => {
      const app = application.toObject ? application.toObject() : application;

      if (app.job) {
        const {
          packageDetails,
          currency,
          totalCTC,
          fixedPay,
          joiningBonus,
          jobType,
          visibleTo,
          broadcastType,
          degree,
          collegeTypes,
          jobTitle,
          jobStatus,
          workMode,
          jobRoles,
          collegeCategories,
          studentStreams,
          endDate,
          rounds,
          selectionProcess,
          numberOfOpenings,
          numberOfStudent,
          minEducation,
          yearsOfExperience,
          minYearofExperience,
          skills,
          certifications,
          workAuthorization,
          workAchievements,
          cgpa,
          toolsAndPlatforms,
          eligibilityCriteria,
          amenitiesRequired,
          benefits,
          tags,
          views,
          senderProfile,
          ...cleanJob
        } = app.job;

        app.job = cleanJob;
      }

      return app;
    });

    return res.status(200).json({
      success: true,
      ...paginatedResponse(cleanedApplications, total, {
        page,
        limit,
      }),
    });
  } catch (error) {
    console.error("Error fetching referred candidates:", error);
    next(error);
  }
};
// ==============================
// UPDATE REFERRAL CANDIDATE STATUS
// ==============================

export const updateReferralCandidateStatus = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    if (!applicationId || !status) {
      return res.status(400).json({
        success: false,
        message: "Application ID and status are required.",
      });
    }

    // Resolve professional profile
    const userProfile = await getStudentService(req.user._id);

    if (!userProfile || !userProfile.data || userProfile.data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Professional profile not found.",
      });
    }

    const professionalProfileId = userProfile.data[0]._id;

    // Find application with job populated
    const application = await Application.findById(applicationId).populate({
      path: "job",
      select: "candidatePosted jobTitle referralCompany",
    });
    const companyName = application?.referralCompany || "Company";
    const jobRole = application?.job?.jobTitle || "";
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    // Authorization check
    if (
      application.job.candidatePosted.toString() !==
      professionalProfileId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access.",
      });
    }

    // Update status using existing service
    const response = await ChangeStatusService(applicationId, status);
    if (!response.success) {
      return res.status(400).json(response);
    }
    if (status === "Referred To Company") {
      try {
        const job = await JobPostingTable.findById(response.data.job).populate(
          "candidatePosted",
          "userId",
        );

        const referrerAuthId = job?.candidatePosted?.userId;

        if (referrerAuthId) {
          await Onboarding.updateOne(
            {
              userId: referrerAuthId,
            },
            {
              $inc: {
                totalCandidatesReferred: 1,
              },
            },
          );

          await handleReferralMilestone(referrerAuthId);
        }
      } catch (err) {
        console.error("Referral milestone failed:", err);
      }
    }

    // =========================
    // SEND EMAIL
    // =========================

    let applicantMail;

    switch (response.data.applicantType) {
      case "student":
      case "fresher":
      case "professional":
        applicantMail = await getCandidatEmail(response.data.applicant);
        break;

      case "college":
        applicantMail = await getCollegeEmail(response.data.applicant);
        break;

      case "company":
        applicantMail = await getCompanyEmail(response.data.applicant);
        break;

      default:
        break;
    }

    if (applicantMail?.success) {
      sendStatusChangeEmail(
        applicantMail.email,
        response.data.currentStatus,
        response.data._id,
        jobRole,
        companyName,
      ).catch((err) => {
        console.error("Email sending failed:", err.message);
      });
    }

    // =========================
    // SEND NOTIFICATION
    // =========================
    console.log("entering send notification...")

    try {
      let recipientAuthId = null;

      // STUDENT / FRESHER / PROFESSIONAL
      if (
        response.data.applicantType === "student" ||
        response.data.applicantType === "fresher" ||
        response.data.applicantType === "professional"
      ) {
        const onboarding = await Onboarding.findById(
          response.data.applicant,
        ).select("userId");

        recipientAuthId = onboarding?.userId || null;
      }

      // COLLEGE
      else if (response.data.applicantType === "college") {
        const collegeOnboarding = await CollegeOnboarding.findById(
          response.data.applicant,
        ).select("userId");

        recipientAuthId = collegeOnboarding?.userId || null;
      }
      console.log("entering send notification2...", recipientAuthId);
      console.log("entering send notification3...", response.data.currentStatus);
      if (recipientAuthId) {
        notifyOnApplicationStatusChange({
          recipientId: recipientAuthId,
          senderId: req.user._id,
          companyName,
          status: response.data.currentStatus,
          applicationId: response.data._id,
          jobType: response.data.jobType,
        });
      }
    } catch (err) {
      console.error("Referral notification failed:", err);
    }

    return res.status(200).json(response);
  } catch (error) {
    console.log("Error updating referral candidate status:", error);
    next(error);
  }
};
export async function getReferralAsked(req, res) {
  try {
    console.log(req.query.referralRequestId);
    const resp = await getReferralAskedService({ referralRequestId: req.query.referralRequestId });
    res.status(200).json(resp);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
}
export async function unsaveJobByUser(req, res) {
  const { jobId } = req.params; // jobId passed in the URL
  const userId = req.user._id;
  const userType = req.user?.userType;

  try {
    let userProfile;
    // Identify the profile ID (matches your saveJobByUser logic)
    switch (userType) {
      case "student":
      case "fresher":
      case "professional":
        userProfile = await getStudentService(userId);
        break;
      case "college":
        userProfile = await getCollegeService(userId);
        break;
      case "company":
        userProfile = await getCompanyService(userId);
        break;
      case "employer":
        userProfile = await getEmployerService(userId);
        break;
    }

    if (!userProfile || !userProfile.data || userProfile.data.length === 0) {
      return res.status(404).json({ msg: "User profile not found!" });
    }

    const applicantId = userProfile.data[0]._id;

    // Call the unsave service
    const result = await unsaveJobService(applicantId, jobId);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error("Unsave Controller Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// save opportunity r
export async function saveJobByUser(req, res) {
  const { jobId, jobType, matchScore } = req.body;
  const userId = req.user._id;
  const userType = req.user?.userType;
  try {
    let user;
    switch (userType) {
      case "student":
        user = await getStudentService(userId);
        break;
      case "fresher":
        user = await getStudentService(userId);
        break;
      case "professional":
        user = await getStudentService(userId);
        break;
      case "college":
        user = await getCollegeService(userId);
        break;
      case "company":
        user = await getCompanyService(userId);
        break;
      case "employer":
        user = await getEmployerService(userId);
        break;
      default:
        break;
    }

    if (!jobId || !user)
      return res.status(404).json({ msg: "User or Job not found!" });
    // if (await getApplicationService(user.data[0]._id, req.user.userType, jobId, jobType).success === true) return res.status(403).json({ msg: "Already Applied" });

    const application = await saveJobService(
      user?.data[0]._id,
      userType,
      jobId,
      jobType,
    );
    if (application.success === false)
      return res.status(403).json({ msg: application.message });
    res.status(201).json(application);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// get saved opportunities
export async function fetchSavedJobs(req, res) {
  // const { applicantType } = req.params;

  const userId = req.user._id;
  const userType = req.user.userType;

  try {
    let user;
    switch (userType) {
      case "student":
      case "fresher":
      case "professional":
        user = await getStudentService(userId);
        break;
      case "college":
        user = await getCollegeService(userId);
        break;
      case "company":
        user = await getCompanyService(userId);
        break;
      case "employer":
        user = await getEmployerService(userId);
        break;
      default:
        break;
    }

    if (!userType || !user)
      return res.status(404).json({ msg: "User not found!" });

    let result;

    // ✅ candidate saved jobs
    if (["student", "fresher", "professional", "college"].includes(userType)) {
      result = await getSavedJobsService(user.data[0]._id, req.pagination);
    }

    // ✅ company saved colleges
    else if (["company", "employer"].includes(userType)) {
      result = await getSavedCollegesService(user.data[0]._id, userType);
    }

    if (result?.success) return res.status(200).json(result);

    return res.status(503).json(result);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// apply for opportunity

// offcampus
{
  /*export async function createOffcampusApplication(req, res) {
  const { jobId } = req.body;
  const userId = req.user._id;

  try {
    const user = await getStudentService(userId);

   
    if (!jobId || !user)
      return res.status(404).json({ msg: "User or Job not found!" });

    const application = await createApplicationService(
      user.data[0]._id,
      req.user.userType,
      jobId,
      "Off-campus"
    );
    if (application.success === false)
      return res.status(403).json({ msg: application.message });

    res.status(201).json(application);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}*/
}

//updated for debounced score update
export async function createOffcampusApplication(req, res) {
  console.log("applied offcampus");

  const { jobId, matchScore } = req.body;
  const userId = req.user._id;
  const userType = req.user.userType;

  try {
    const user = await getStudentService(userId);

    if (!jobId) {
      return res.status(404).json({ msg: "Job not found!" });
    }

    if (!user || !user.data?.length) {
      return res.status(404).json({ msg: "User not found!" });
    }

    // 🔹 Validate match score
    if (matchScore !== undefined) {
      if (
        typeof matchScore !== "number" ||
        matchScore < 0 ||
        matchScore > 100
      ) {
        return res.status(400).json({
          msg: "Invalid match score. Must be between 0 and 100.",
        });
      }
    }

    const actorProfile = user.data[0];

    const job = await JobPostingTable.findById(jobId).populate("companyPosted");

    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }

    // 🔹 Create application
    const application = await createApplicationService({
      appliedByUserId: actorProfile._id,
      appliedByType: userType,
      appliedForCompanyId: null,
      jobId,
      jobType: "Off-campus",
      matchScore: matchScore ?? null,
    });

    if (application.success === false) {
      return res.status(403).json({ msg: application.message });
    }

    await JobPostingTable.findByIdAndUpdate(
      jobId,
      { $inc: { applicationCount: 1 } }
    );
    // NEW: Trigger score + ranking calculation (debounced, non-blocking)
    scheduleScoreUpdate(userId).catch((err) => {
      console.error("❌ Failed to schedule score update:", err);
    });

    // 🔹 Notification (non-blocking)
    try {
      if (job.companyPosted?.userId) {
        const studentName =
          actorProfile?.fullName || actorProfile?.name || "A candidate";

        const jobTitle =
          job.jobTitle || `${job.jobType} ${job.lookingFor || "Job"}`;

        await notifyCompanyOnStudentApply({
          companyAuthId: job.companyPosted.userId,
          studentAuthId: userId,
          studentName,
          jobTitle,
          jobId: job._id,
          jobType: job.jobType,
        });
      }
    } catch (notifyErr) {
      console.error("🔕 Off-campus notification failed:", notifyErr);
    }

    return res.status(201).json(application);
  } catch (error) {
    console.log("❌ createOffcampusApplication error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// joblisting
export async function createJobListingApplication(req, res) {
  const { jobId } = req.body;
  const userId = req.user._id;

  if (!userId || !jobId) return res.status(404).json({ msg: "Fields missing" });

  try {
    const user = await getStudentService(userId);

    if (!jobId || !user)
      return res.status(404).json({ msg: "User or Job not found!" });

    const application = await createApplicationService(
      user.data[0]._id,
      req.user.userType,
      jobId,
      "Off-campus",
    );
    if (application.success === false)
      return res.status(403).json({ msg: application.message });

    await JobPostingTable.findByIdAndUpdate(
      jobId,
      { $inc: { applicationCount: 1 } }
    );

    res.status(201).json(application);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// internship
export async function createIntershipApplication(req, res) {
  const { internshipId, matchScore } = req.body; // ✅ added
  const userId = req.user._id;
  const userType = req.user.userType;
  console.log("🔥 hit me");

  try {
    const user = await getStudentService(userId);

    if (!user || !user.data?.length || !internshipId) {
      return res.status(404).json({ msg: "User or Internship not found!" });
    }

    //  VALIDATE MATCH SCORE
    if (matchScore !== undefined) {
      if (
        typeof matchScore !== "number" ||
        matchScore < 0 ||
        matchScore > 100
      ) {
        return res.status(400).json({
          msg: "Invalid match score",
        });
      }
    }

    const actorProfile = user.data[0];

    const internship =
      await JobPostingTable.findById(internshipId).populate("companyPosted");

    if (!internship) {
      return res.status(404).json({ msg: "Internship not found" });
    }

    const application = await createApplicationService({
      appliedByUserId: actorProfile._id,
      appliedByType: userType,
      appliedForCompanyId: internship.companyPosted?._id || null,
      jobId: internshipId,
      jobType: "Internship",

      matchScore: matchScore ?? null, //  SAVE HERE
    });

    if (application.success === false)
      return res.status(403).json({ msg: application.message });

    await JobPostingTable.findByIdAndUpdate(
      internshipId,
      { $inc: { applicationCount: 1 } }
    );

    // NEW: Trigger score + ranking calculation (debounced, non-blocking)
    scheduleScoreUpdate(userId).catch((err) => {
      console.error("❌ Failed to schedule score update:", err);
    });

    //  NOTIFICATION (NON-BLOCKING)
    try {
      if (internship.companyPosted?.userId) {
        const studentName =
          actorProfile?.fullName || actorProfile?.name || "A candidate";

        const jobTitle =
          internship.jobTitle ||
          `${internship.jobType} ${internship.lookingFor || "Role"}`;

        await notifyCompanyOnStudentApply({
          companyAuthId: internship.companyPosted.userId,
          studentAuthId: userId,
          studentName,
          jobTitle,
          jobId: internship._id,
          jobType: internship.jobType,
        });
      }
    } catch (notifyErr) {
      console.error("🔕 Internship notification failed:", notifyErr);
    }

    res.status(201).json(application);
  } catch (error) {
    console.log("❌ createIntershipApplication error: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// referral step 3 apply
export async function createReferralApplication(req, res) {
  const { referralId, matchScore, referralCompany } = req.body; // added referralCompany
  const userId = req.user._id;
  const userType = req.user.userType;

  try {
    const user = await getStudentService(userId);

    if (!user || !referralId) {
      return res.status(404).json({ msg: "Invalid" });
    }

    if (matchScore !== undefined) {
      if (
        typeof matchScore !== "number" ||
        matchScore < 0 ||
        matchScore > 100
      ) {
        return res.status(400).json({ msg: "Invalid match score" });
      }
    }

    const actorProfile = user.data[0];

    const application = await createApplicationService({
      appliedByUserId: actorProfile._id,
      appliedByType: userType,
      appliedForCompanyId: null,
      jobId: referralId,
      jobType: "Referral",
      matchScore: matchScore ?? null,
      referralCompany: referralCompany ?? null, // pass it down
    });

    if (application.success === false) {
      return res.status(403).json({ msg: application.message });
    }
    await JobPostingTable.findByIdAndUpdate(
      referralId,
      { $inc: { applicationCount: 1 } }
    );

    scheduleScoreUpdate(userId).catch((err) => {
      console.error("❌ Failed to schedule score update:", err);
    });

    res.status(201).json(application);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// oncampus

// oncampus -> notification done
export async function createOncampusApplication(req, res) {
  if (!req.user) {
    return res.status(401).json({ msg: "User not logged in!" });
  }
  const { jobId } = req.body;
  const authUser = req.user;
  const userId = req.user._id;
  const userType = req.user.userType;

  try {
    let user;
    switch (userType) {
      case "college":
        user = await getCollegeService(userId);
        break;
      case "company":
        user = await getCompanyService(userId);
        break;
      case "employer":
        user = await getEmployerService(req.user);
        break;
      default:
        return res.status(400).json({ msg: "Invalid user type" });
    }

    if (!jobId) {
      return res.status(404).json({ msg: "job not found!" });
    }

    if (!user || !user.data || user.data.length === 0) {
      return res.status(404).json({ msg: "User not found!" });
    }

    const actorProfile = user.data[0];

    const job = await JobPostingTable.findById(jobId)
      .populate("companyPosted")
      .populate("collegePosted");

    if (!job) return res.status(404).json({ msg: "Job not found" });

    const appliedByUserId = actorProfile._id;

    const isEmployeeWithCompany =
      authUser.userType === "employer" && authUser.activeCompanyId;

    const appliedByType = isEmployeeWithCompany
      ? "employer"
      : authUser.userType;

    let appliedForCompanyId = null;

    if (authUser.userType === "employer") {
      appliedForCompanyId = authUser.activeCompanyId || actorProfile._id;
    } else if (authUser.userType === "company") {
      appliedForCompanyId = actorProfile._id;
    }

    const jobType = job.jobType;

    const application = await createApplicationService({
      appliedByUserId,
      appliedByType,
      appliedForCompanyId,
      jobId,
      jobType: "On-campus",
    });

    if (application.success === false) {
      return res.status(403).json({ msg: application.message });
    }

    //🔔 NOTIFICATIONS (ISOLATED – NEVER BREAK API)

    try {
      // 🟢 College → Company
      if (userType === "college" && job.companyPosted?.userId) {
        const collegeName =
          actorProfile?.collegeUniversityDetails?.collegeName ||
          actorProfile?.collegeName ||
          "A college";

        const jobTitle =
          job.jobTitle || `${job.jobType} ${job.lookingFor || "Job"}`;

        await notifyCompanyOnCollegeApply({
          companyAuthId: job.companyPosted.userId, // ✅ FIXED
          collegeAuthId: userId,
          collegeName,
          jobTitle,
          jobId: job._id,
          jobType,
        });
      }

      // 🟢 Company / Employer → College
      if (
        (userType === "company" || userType === "employer") &&
        job.collegePosted?.userId
      ) {
        const companyName =
          actorProfile?.companyName ||
          actorProfile?.companyDetails?.companyName ||
          actorProfile?.companyBasicDetails?.companyName ||
          actorProfile?.organizationName ||
          "A company";

        const jobTitle =
          job.jobTitle || `${job.jobType} ${job.lookingFor || "Job"}`;

        await notifyCollegeOnCompanyApply({
          collegeAuthId: job.collegePosted.userId, // ✅ FIXED
          companyAuthId: userId,
          companyName,
          jobTitle,
          jobId: job._id,
          jobType,
        });
      }
    } catch (notifyErr) {
      console.error("🔕 Notification failed (non-blocking):", notifyErr);
    }

    return res.status(201).json(application);
  } catch (error) {
    console.error("❌ createOncampusApplication error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// poolcampus

//pool campus notification done
export async function createPoolcampusApplication(req, res) {
  const { jobId } = req.body;
  const userId = req.user._id;
  const userType = req.user.userType;
  const authUser = req.user;

  // who clicked apply

  // employee acting for a company
  const isEmployeeWithCompany =
    authUser.userType === "employer" && authUser.activeCompanyId;

  // who the application belongs to
  {
    /*const appliedForCompanyId = isEmployeeWithCompany
    ? authUser.activeCompanyId
    : authUser.userType === "company"
      ? user.data?.[0]?._id
      : null;*/
  }

  // how it was applied
  const appliedByType = isEmployeeWithCompany ? "employer" : authUser.userType;

  try {
    let user;
    switch (userType) {
      case "college":
        user = await getCollegeService(userId);
        break;
      case "company":
        user = await getCompanyService(userId);
        break;
      case "employer":
        user = await getEmployerService(req.user);
        break;
      default:
        return res.status(400).json({ msg: "Invalid user type" });
    }

    if (!user || !user.data || user.data.length === 0 || !jobId) {
      return res.status(404).json({ msg: "User or job not found!" });
    }

    const actorProfile = user.data[0];
    let appliedForCompanyId = null;

    const appliedByUserId = actorProfile._id;

    if (authUser.userType === "employer") {
      appliedForCompanyId = authUser.activeCompanyId || actorProfile._id;
    } else if (authUser.userType === "company") {
      appliedForCompanyId = actorProfile._id;
    }

    const job = await JobPostingTable.findById(jobId)
      .populate("companyPosted")
      .populate("collegePosted");

    if (!job) return res.status(404).json({ msg: "Job not found" });

    const jobType = job.jobType; // should be "Pool-campus"

    const application = await createApplicationService({
      appliedByUserId,
      appliedByType,
      appliedForCompanyId,
      jobId,
      jobType: "Pool-campus",
    });

    if (application.success === false) {
      return res.status(403).json({ msg: application.message });
    }

    //🔔 NOTIFICATIONS (NON-BLOCKING)

    try {
      const jobTitle =
        job.jobTitle || `${job.jobType} ${job.lookingFor || "Job"}`;

      // 🟢 College → Company
      if (userType === "college" && job.companyPosted?.userId) {
        const collegeName =
          actorProfile?.collegeUniversityDetails?.collegeName ||
          actorProfile?.collegeName ||
          "A college";

        await notifyCompanyOnCollegeApply({
          companyAuthId: job.companyPosted.userId,
          collegeAuthId: userId,
          collegeName,
          jobTitle,
          jobId: job._id,
          jobType,
        });
      }

      // 🟢 Company / Employer → College
      if (
        (userType === "company" || userType === "employer") &&
        job.collegePosted?.userId
      ) {
        const companyName =
          actorProfile?.companyName ||
          actorProfile?.companyDetails?.companyName ||
          actorProfile?.companyBasicDetails?.companyName ||
          actorProfile?.organizationName ||
          "A company";

        await notifyCollegeOnCompanyApply({
          collegeAuthId: job.collegePosted.userId,
          companyAuthId: userId,
          companyName,
          jobTitle,
          jobId: job._id,
          jobType,
        });
      }
    } catch (notifyErr) {
      console.error("🔕 Pool-campus notification failed:", notifyErr);
    }

    return res.status(201).json(application);
  } catch (error) {
    console.error("❌ createPoolcampusApplication error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// campus-internship
export async function createCampusInternshipApplication(req, res) {
  const { jobId } = req.body;
  const userId = req.user._id;

  try {
    // to get collegeId from college database
    const user = await getCollegeService(userId);

    if (!user || !jobId) return res.status(404).json({ msg: "Invalid" });
    if (
      (await getApplicationService(
        user.data[0]._id,
        req.user.userType,
        jobId,
        "Internship",
      )) === true
    )
      return res.status(403).json({ msg: "Already Applied" });

    const application = await createApplicationService(
      user.data[0]._id,
      req.user.userType,
      jobId,
      "Internship",
    );
    if (application.success === false) return res.status(403).json(application);

    res.status(201).json(application);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// get application details by candidate
export async function getUserApplicationStatus(req, res) {
  ////
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    ///

    const userId = req.user._id;
    const userType = req.user.userType;
    const { jobType } = req.params;

    if (!jobType) {
      return res.status(400).json({ error: "jobType is required" });
    }

    let user;
    switch (userType) {
      case "college":
        user = await getCollegeService(userId);
        break;
      case "employer":
        user = await getEmployerService(req.user);
        break;
      case "company":
        user = await getCompanyService(userId);
        break;
      case "student":
      case "fresher":
      case "professional":
        user = await getStudentService(userId);
        break;
      default:
        break;
    }

    if (!user?.data || !user.data.length) {
      return res.status(404).json({ error: "User profile not found" });
    }

    let activeCompanyId = null;

    if (userType === "employer") {
      activeCompanyId = req.user.activeCompanyId;
    }

    console.log("this pipeline");
    const response = await fetchApplicationStatusService(
      user.data[0]._id,
      jobType,
      userType,
      activeCompanyId,
      req.pagination,
    );

    // console.log(response);

    if (response.success) res.status(200).json(response);
    else res.status(404).json(response);
  } catch (error) {
    console.log("Error fetching application status: ", error);
    res.status(500).json({ Error: "Internal server error" });
  }
}

// action by company
// offcampus and joblisting
export async function getApplicationsByJob(req, res) {
  const { jobId, jobType, targetStatus, isVisited } = req.query;
  const userType = req.user.userType;
  if (!jobId || !jobType)
    return res.status(404).json({ msg: "Job not found!" });

  try {
    const response = await fetchCollegeApplicationsByJobService(
      jobId,
      jobType,
      userType,
      targetStatus,
      isVisited,
    );

    // to be implement -- sorting feature like ATS

    res.status(200).json(response.data);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ Error: "Internal server error" });
  }
}

// oncampus and poolcampus

//past new working for company prathmesh
export async function getCollegeApplicationsByJob(req, res) {
  console.log("hello");

  const { jobId, jobType, targetStatus, isVisited } = req.query;
  const userType = req.user.userType;
  if (!jobId || !jobType || !targetStatus)
    return res.status(404).json({ msg: "Job not found with given criteria!" });

  try {
    const response = await fetchCollegeApplicationsByJobService(
      jobId,
      jobType,
      userType,
      targetStatus,
      isVisited,
    );

    // to be implement -- sorting feature like ATS
    console.log(response);

    res.status(200).json(response.data);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ Error: "Internal server error" });
  }
}

// shortlist candidate/college
export async function shortlistApplicant(req, res) {
  const { applicationId } = req.params;
  const { jobRole } = req.body;
  if (!applicationId)
    return res.status(404).json({ msg: "Application not found!" });
  try {
    const response = await ChangeStatusService(applicationId, "Shortlisted");

    if (response.success === true) {
      // service -> send mail to candidate
      let applicantMail;
      switch (response.data.applicantType) {
        case "student":
        case "fresher":
        case "professional":
          applicantMail = await getCandidatEmail(response.data.applicant);
          break;
        case "college":
          applicantMail = await getCollegeEmail(response.data.applicant);
          break;
        case "company":
          applicantMail = await getCompanyEmail(response.data.applicant);
          break;
        default:
          break;
      }
      if (applicantMail.success) {
        sendStatusChangeEmail(
          applicantMail.email,
          response.data.currentStatus,
          response.data._id,
          jobRole /*companyName*/,
        ).catch((err) => {
          console.error("Email sending failed:", err.message);
        });
      }

      // 🔔 SEND NOTIFICATION TO COLLEGE
      if (response.data.applicantType === "college") {
        try {
          // get company name (keep your existing logic)
          const companyResult = await getEmployerService(req.user);
          if (!companyResult.success) return;

          const companyId = companyResult.data[0]._id;

          const companyProfile = await CompanyProfile.findById(
            companyId,
          ).select("companyDetails.companyName");

          const companyName =
            companyProfile?.companyDetails?.companyName || "Company";

          // ✅ THIS IS THE KEY FIX
          const collegeOnboarding = await CollegeOnboarding.findById(
            response.data.applicant,
          ).select("userId");

          if (!collegeOnboarding?.userId) {
            console.error(
              "❌ College auth userId missing for onboardingId:",
              response.data.applicant,
            );
            return;
          }

          const collegeAuthId = collegeOnboarding.userId;

          // ✅ Send notification using AUTH ID
          notifyOnApplicationStatusChange({
            recipientId: collegeAuthId, // ✅ AUTH _id
            senderId: req.user._id, // company/employer AUTH _id
            companyName,
            status: response.data.currentStatus, // Shortlisted
            applicationId: response.data._id,
            jobType: response.data.jobType,
          });
        } catch (err) {
          console.error("Shortlist notification failed:", err);
        }
      }

      // 🔔 SEND NOTIFICATION TO STUDENT / FRESHER
      if (
        response.data.applicantType === "student" ||
        response.data.applicantType === "fresher"
      ) {
        try {
          const companyResult = await getEmployerService(req.user);
          if (!companyResult.success) return;

          const companyId = companyResult.data[0]._id;

          const companyProfile = await CompanyProfile.findById(
            companyId,
          ).select("companyDetails.companyName");

          const companyName =
            companyProfile?.companyDetails?.companyName || "Company";

          const resolveStudentAuthId = async (onboardingId) => {
            const onboarding =
              await Onboarding.findById(onboardingId).select("userId");
            return onboarding?.userId || null;
          };

          const studentAuthId = await resolveStudentAuthId(
            response.data.applicant,
          );
          if (!studentAuthId) {
            console.error(
              "❌ Student authId not found:",
              response.data.applicant,
            );
            return;
          }

          notifyOnApplicationStatusChange({
            recipientId: studentAuthId,
            senderId: req.user._id,
            companyName,
            status: "Shortlisted",
            applicationId: response.data._id,
            jobType: response.data.jobType,
          });
        } catch (err) {
          console.error("Student shortlist notification failed:", err);
        }
      }

      return res.status(200).json(response);
    }
    return res.status(404).json(response);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ Error: "Internal server error" });
  }
}

// shortList applicant of company by college
export async function shortlistApplicantForCompany(req, res) {
  const { applicationId } = req.params;
  const { jobRole } = req.body;
  if (!applicationId)
    return res.status(404).json({ msg: "Application not found!" });
  try {
    const response = await ChangeStatusService(applicationId, "Shortlisted");

    if (response.success === true) {
      // 🔔 Notify company/employer (NON-BLOCKING)

      notifyOnCollegeApplicationStatusChange({
        application: response.data,
        newStatus: "Shortlisted",
        actorAuthId: req.user._id,
      });

      // ✅ ONLY NOW return response
      return res.status(200).json(response);
    }

    return res.status(404).json(response);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ Error: "Internal server error" });
  }
}

export async function rejectApplicant(req, res) {
  const { applicationId } = req.params;
  const { jobRole } = req.body;
  if (!applicationId)
    return res.status(404).json({ msg: "Application not found!" });
  try {
    const response = await ChangeStatusService(applicationId, "Rejected");

    if (response.success === true) {
      // service -> send mail to candidate
      let applicantMail;
      switch (response.data.applicantType) {
        case "student":
        case "fresher":
        case "professional":
          applicantMail = await getCandidatEmail(response.data.applicant);
          break;
        case "college":
          applicantMail = await getCollegeEmail(response.data.applicant);
          break;
        case "company":
          applicantMail = await getCompanyEmail(response.data.applicant);
          break;
        case "employer":
          applicantMail = await getCompanyEmail(response.data.applicant);
          break;
        default:
          break;
      }
      if (applicantMail.success) {
        sendStatusChangeEmail(
          applicantMail.email,
          response.data.currentStatus,
          response.data._id,
          jobRole /*companyName*/,
        ).catch((err) => {
          console.error("Email sending failed:", err.message);
        });
      }

      // 🔔 SEND NOTIFICATION TO COLLEGE ON REJECT
      if (response.data.applicantType === "college") {
        try {
          const companyResult = await getEmployerService(req.user);
          if (!companyResult.success) return;

          const companyId = companyResult.data[0]._id;

          const companyProfile = await CompanyProfile.findById(
            companyId,
          ).select("companyDetails.companyName");

          const companyName =
            companyProfile?.companyDetails?.companyName || "Company";

          // ✅ Convert CollegeOnboarding → Auth ID
          const collegeOnboarding = await CollegeOnboarding.findById(
            response.data.applicant,
          ).select("userId");

          if (!collegeOnboarding?.userId) {
            console.error(
              "❌ College auth userId missing for onboardingId:",
              response.data.applicant,
            );
            return;
          }

          notifyOnApplicationStatusChange({
            recipientId: collegeOnboarding.userId, // ✅ AUTH ID
            senderId: req.user._id, // company AUTH ID
            companyName,
            status: "Rejected",
            applicationId: response.data._id,
            jobType: response.data.jobType,
          });
        } catch (err) {
          console.error("Reject notification failed:", err);
        }
      }

      // 🔔 SEND NOTIFICATION TO student/fresher ON REJECT
      if (
        response.data.applicantType === "student" ||
        response.data.applicantType === "fresher"
      ) {
        try {
          const companyResult = await getEmployerService(req.user);
          if (!companyResult.success) return;

          const companyId = companyResult.data[0]._id;

          const companyProfile = await CompanyProfile.findById(
            companyId,
          ).select("companyDetails.companyName");

          const companyName =
            companyProfile?.companyDetails?.companyName || "Company";

          const resolveStudentAuthId = async (onboardingId) => {
            const onboarding =
              await Onboarding.findById(onboardingId).select("userId");
            return onboarding?.userId || null;
          };

          const studentAuthId = await resolveStudentAuthId(
            response.data.applicant,
          );

          if (!studentAuthId) {
            console.error(
              "❌ Student authId not found:",
              response.data.applicant,
            );
            return;
          }

          notifyOnApplicationStatusChange({
            recipientId: studentAuthId,
            senderId: req.user._id,
            companyName,
            status: "Rejected",
            applicationId: response.data._id,
            jobType: response.data.jobType,
          });
        } catch (err) {
          console.error("Student reject notification failed:", err);
        }
      }

      return res.status(200).json(response);
    }
    return res.status(404).json(response);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ Error: "Internal server error" });
  }
}

export async function rejectCompanyApplicationByCollege(req, res) {
  const { applicationId } = req.params;
  const { jobRole } = req.body;

  if (!applicationId)
    return res.status(404).json({ msg: "Application not found!" });

  try {
    const response = await ChangeStatusService(applicationId, "Rejected");

    if (response.success === true) {
      // For college rejecting company, we need to send email to the COMPANY
      const companyMail = await getCompanyService(response.data.applicant);
      const companyData = companyMail.data ? companyMail.data[0] : null;
      const workEmail = companyData?.employerDetails?.workEmail;

      // console.log("Company work email for rejection:", workEmail);

      // if (companyMail.success && workEmail) {
      //     sendStatusChangeEmail(
      //         workEmail,
      //         response.data.currentStatus,
      //         response.data._id,
      //         jobRole
      //     );
      // }

      return res.status(200).json(response);
    }

    return res.status(404).json(response);
  } catch (error) {
    console.log("Error in rejectCompanyApplicationByCollege: ", error);
    res.status(500).json({ Error: "Internal server error" });
  }
}

//incase below fails

//important fixed
export async function acceptApplicant(req, res) {
  const { applicationId } = req.params;
  const { jobRole } = req.body;

  if (!applicationId) {
    return res.status(404).json({ msg: "Application not found!" });
  }

  try {
    console.log("🚀 acceptApplicant called for:", applicationId);

    const response = await ChangeStatusService(applicationId, "Accepted");

    if (!response.success) {
      return res.status(404).json(response);
    }

    const application = response.data;
    const actorAuthId = req.user._id;

    /**
     * 🔔 RULE:
     * The APPLICANT always gets notified
     */

    // 👉 CASE 1: College is applicant → Company / Employer accepted college
    if (application.applicantType === "college") {
      try {
        // Resolve college AUTH ID
        const college = await CollegeOnboarding.findById(
          application.applicant,
        ).select("userId");

        if (!college?.userId) {
          console.error(
            "❌ College authId not found for:",
            application.applicant,
          );
        } else {
          // Resolve company name (actor side)
          let companyName = "Company";

          const companyProfile = await CompanyProfile.findOne({
            userId: actorAuthId,
          }).select("companyDetails.companyName");

          if (companyProfile?.companyDetails?.companyName) {
            companyName = companyProfile.companyDetails.companyName;
          }

          // 🔔 Notify college
          notifyOnApplicationStatusChange({
            recipientId: college.userId, // AUTH ID
            senderId: actorAuthId, // company/employer AUTH
            companyName,
            status: "Accepted",
            applicationId: application._id,
            jobType: response.data.jobType,
          });
        }
      } catch (err) {
        console.error("❌ Accept → College notification failed:", err);
      }
    }

    // 👉 CASE 2: Company / Employer is applicant → College accepted them
    if (
      application.applicantType === "company" ||
      application.applicantType === "employer"
    ) {
      notifyOnCollegeApplicationStatusChange({
        application,
        newStatus: "Accepted",
        actorAuthId,
      });
    }

    // 👉 CASE 3: Student / Fresher is applicant → Company accepted them
    if (
      application.applicantType === "student" ||
      application.applicantType === "fresher" ||
      application.applicantType === "professional"
    ) {
      try {
        const resolveStudentAuthId = async (onboardingId) => {
          const onboarding =
            await Onboarding.findById(onboardingId).select("userId");
          return onboarding?.userId || null;
        };
        const studentAuthId = await resolveStudentAuthId(application.applicant);
        if (!studentAuthId) return;

        let companyName = "Company";

        const companyProfile = await CompanyProfile.findOne({
          userId: actorAuthId,
        }).select("companyDetails.companyName");

        if (companyProfile?.companyDetails?.companyName) {
          companyName = companyProfile.companyDetails.companyName;
        }

        notifyOnApplicationStatusChange({
          recipientId: studentAuthId,
          senderId: actorAuthId,
          companyName,
          status: "Accepted",
          applicationId: application._id,
          jobType: response.data.jobType,
        });
      } catch (err) {
        console.error("Accept → Student notification failed:", err);
      }
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error("❌ acceptApplicant error:", error);
    res.status(500).json({ Error: "Internal server error" });
  }
}

// getAllshortlistedcandidates
export async function getShortlistedCandidatesByCompany(req, res) {
  const companyId = req.user._id;
  const userType = req.user?.userType;

  const { applicantType, jobType } = req.query;

  if (!applicantType || !jobType)
    return res.status(404).json({ msg: "Applicant not defined!" });

  try {
    let profileId;
    switch (userType) {
      case "company":
        const company = await getCompanyService(companyId);
        if (!company || !company.success || company.data.length === 0) {
          return res.status(404).json({ msg: "Company profile not found!" });
        }
        profileId = company.data[0]._id;
        break;
      case "employer":
        const employer = await getEmployerService(req.user);
        if (!employer || !employer.success || employer.data.length === 0) {
          return res
            .status(404)
            .json({ msg: employer.msg || "Employer profile not found!" });
        }
        profileId = employer.data[0]._id;
        break;
      default:
        return res
          .status(403)
          .json({ msg: "This user type cannot access this resource." });
    }

    const response = await fetchCandidatesbyStatus(
      profileId,
      "Shortlisted",
      applicantType,
      jobType,
      "companyPosted",
    );
    // console.log(response);
    res.status(200).json(response);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ Error: "Internal server error" });
  }
}

// get shortlist comapny for the college
export async function getShortlistedCompaniesForCollege(req, res) {
  const collegeId = req.user.id;
  const { applicantType, jobType } = req.query;
  if (!applicantType || !jobType)
    return res.status(404).json({ msg: "Applicant not defined!" });
  try {
    const college = await getCollegeService(collegeId);
    if (!college) return res.status(404).json({ msg: "college not found!" });
    const response = await fetchCandidatesbyStatus(
      college.data[0]._id,
      "Shortlisted",
      applicantType,
      jobType,
      "collegePosted",
    );
    res.status(200).json(response);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ Error: "Internal Server error" });
  }
}

// getAllAcceptedcandidates
export async function getAcceptedCandidatesByCompany(req, res) {
  const companyId = req.user._id;
  const { applicantType, jobType } = req.query;
  if (!applicantType || !jobType)
    return res.status(404).json({ msg: "Applicant not defined!" });

  try {
    const company = await getEmployerService(companyId);
    if (!company) return res.status(404).json({ msg: "company not found!" });
    const response = await fetchCandidatesbyStatus(
      company.data[0]._id,
      "Accepted",
      applicantType,
      jobType,
      "companyPosted",
    );
    // console.log(response);
    res.status(200).json(response);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ Error: "Internal server error" });
  }
}

//Prathmesh interview schedule fix
export async function scheduleInterview(req, res) {
  try {
    console.log("📩 Schedule Interview Payload:", req.body);

    const companyAuthId = req.user._id;

    const {
      applicationId,
      jobId,
      jobType,
      applicantId, // profile id (college / student / etc)
      applicantAuthId, // auth id (already provided)
      applicantType,
      jobRole = [],
      coordinator,
      data,
    } = req.body;

    let finalApplicantType = applicantType;

    if (
      (jobType === "On-campus" || jobType === "Pool-campus") &&
      !finalApplicantType
    ) {
      finalApplicantType = "college";
    }

    if (!finalApplicantType) {
      return res.status(400).json({ msg: "Applicant type missing" });
    }

    if (!data) {
      return res.status(400).json({ msg: "Interview data missing" });
    }

    const { date, time, meetLink, message } = data;

    if (
      !applicationId ||
      !jobId ||
      !jobType ||
      !applicantId ||
      !applicantAuthId
    ) {
      return res.status(400).json({ msg: "Required fields missing" });
    }

    if (!date || !time || !meetLink) {
      return res.status(400).json({ msg: "Date, time and meet link required" });
    }

    // 🔹 COMPANY
    const company = await getCompanyService(companyAuthId);
    if (!company || !company.data?.length) {
      return res.status(404).json({ msg: "Company not found" });
    }

    const companyName = company.data[0].companyDetails.companyName;

    // 🔹 Coordinator snapshot (safe)
    const coordinatorSnapshot = {
      name: coordinator?.name || "",
      designation: coordinator?.designation || "",
      collegeName: coordinator?.collegeName || "",
    };

    console.log("🧠 Interview Save Check:", {
      collegeProfileId: applicantId,
      collegeAuthId: applicantAuthId,
    });

    // 🔹 Applicant snapshot (for display purpose only)
    let applicantSnapshot = {};

    if (finalApplicantType === "college") {
      // College → use coordinator info
      applicantSnapshot = {
        name: coordinator?.name || "",
        designation: coordinator?.designation || "",
        collegeName: coordinator?.collegeName || "",
        profileType: "college",
      };
    } else {
      // Student / Fresher / Professional
      applicantSnapshot = {
        name: req.body?.applicantName || "", // frontend will pass this
        collegeName: req.body?.applicantCollege || "",
        profileType: finalApplicantType,
      };
    }

    // 1️⃣ SAVE INTERVIEW (SOURCE OF TRUTH)
    const interview = await InterviewSchedule.create({
      jobId,
      jobType,
      applicationId,
      companyAuthId,
      applicantType: finalApplicantType,
      applicantAuthId,
      applicantProfileId: applicantId,
      applicantSnapshot,
      coordinator: coordinatorSnapshot,
      companySnapshot: {
        companyName,
        scheduledBy: {
          name: req.user.name,
          email: req.user.email,
          designation: req.user.designation || "Recruiter",
        },
      },
      jobRole,
      date,
      time,
      meetLink,
      message,
      status: "Scheduled",
      emailStatus: "PENDING",
    });

    // 2️⃣ NOTIFICATION (must succeed)
    await notifyCollegeOnInterviewScheduled({
      collegeAuthId: applicantAuthId,
      companyAuthId,
      companyName,
      applicationId,
      jobId,
      jobType,
      interviewId: interview._id,
      date,
      time,
    });

    // 3️⃣ EMAIL RESOLUTION (DO NOT BREAK FLOW)
    let applicantEmail;

    switch (applicantType) {
      case "student":
      case "fresher":
      case "professional": {
        const res = await getCandidatEmail(applicantId);
        applicantEmail = res?.email;
        break;
      }
      case "college": {
        const res = await getCollegeEmail(applicantId);
        applicantEmail = res?.email;
        break;
      }
      case "company": {
        const res = await getCompanyEmail(applicantId);
        applicantEmail = res?.email;
        break;
      }
      default:
        return res.status(400).json({ msg: "Invalid applicant type" });
    }

    // 4️⃣ EMAIL (NON-BLOCKING)
    if (applicantEmail) {
      try {
        await sendScheduledInterviewEmail(
          applicantEmail,
          date,
          time,
          message,
          meetLink,
          jobRole,
          companyName,
        );

        interview.emailStatus = "SENT";
        await interview.save();
      } catch (emailErr) {
        console.error("❌ Email failed:", emailErr.message);
        interview.emailStatus = "FAILED";
        await interview.save();
      }
    }

    // 5️⃣ FINAL RESPONSE
    return res.status(200).json({
      success: true,
      msg: "Interview scheduled successfully",
      data: interview,
    });
  } catch (error) {
    console.error("❌ scheduleInterview error:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
}

// In controllers/applicationController.js
export const getCompanyDashboardMetrics = async (req, res) => {
  try {
    const user = req.user;
    const metricsData = await fetchCompanyDashboardMetrics(user);

    res.status(200).json({
      success: true,
      data: metricsData,
    });
  } catch (error) {
    console.error("❌ Error in getCompanyDashboardMetrics:", error);
    const statusCode = error.statusCode || 500;

    res.status(statusCode).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const getProfessionalDashboardMetrics = async (req, res) => {
  try {
    const user = req.user;

    const metrics = await fetchProfessionalDashboardMetrics(user);

    res.status(200).json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    console.error("❌ Error in getProfessionalDashboardMetrics:", error);

    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

//alternate date controller
export async function submitAlternateDates(req, res) {
  const { jobId } = req.params;

  const { startDate, endDate } = req.body;

  let companyId;
  const userId = req.user._id;

  if (req.user.companyId) {
    companyId = req.user.companyId;
  } else if (req.user.activeCompanyId) {
    companyId = req.user.activeCompanyId;
  } else if (userId) {
    try {
      const companyResponse = await getCompanyService(userId);
      if (
        companyResponse.success &&
        companyResponse.data &&
        companyResponse.data.length > 0
      ) {
        companyId = companyResponse.data[0]._id;
      }
    } catch (error) {
      console.log("Error finding company using getCompanyService:", error);
    }
  }

  if (!jobId || !startDate || !endDate) {
    return res.status(400).json({
      success: false,
      msg: "Job ID, start date, and end date are required",
    });
  }

  if (!companyId) {
    return res.status(400).json({
      success: false,
      msg: "Company ID not found. Please ensure you have a company profile.",
    });
  }

  try {
    const response = await submitAlternateDatesService(jobId, companyId, {
      startDate,
      endDate,
    });

    if (response.success === true) {
      return res.status(200).json(response);
    }
    return res.status(404).json(response);
  } catch (error) {
    console.log("Error in submitAlternateDates: ", error);
    res.status(500).json({
      success: false,
      Error: "Internal server error",
      msg: error.message,
    });
  }
}

export const updateApplicationStatus = async (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body;

  try {
    const application = await Application.findById(applicationId);
    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }


    application.currentStatus = status;
    application.statusHistory.push({
      status: status,
      date: new Date(),
    });

    await application.save();

    res.status(200).json({
      success: true,
      message: `Status updated to ${status}`,
      data: application,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getApplicationDetailsById = async (req, res) => {
  try {
    const { applicationId } = req.params;

    if (!applicationId) {
      return res.status(400).json({
        success: false,
        message: "applicationId is required",
      });
    }

    const application = await Application.findById(applicationId)

      .populate({
        path: "job",

        populate: [
          {
            path: "companyPosted",
            select: "companyDetails.companyName profileImageUrl companyType",
          },
          {
            path: "candidatePosted",
            select: "fullName name currentCompany currentRole profileImage status",
          },
          {
            path: "collegePosted",
            select: "collegeName logo profileImage",
          },
        ],
      })

      .populate({
        path: "applicant",
        select: "-categorizedSkills",
      })

      .populate({
        path: "appliedForCompany",
        select: "companyDetails.companyName profileImageUrl",
      })

      .lean();
    if (
      application?.job?.jobType === "Referral" &&
      !application?.job?.receiverProfile &&
      application?.job?.candidatePosted?._id
    ) {
      const receiverProfile = await Onboarding.findById(
        application.job.candidatePosted._id,
      )
        .select("-categorizedSkills")
        .lean();

      application.job.receiverProfile = receiverProfile;
    }
    application.applied =
      application?.applicant?.userId?.toString() === req.user._id.toString();
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }
    if (application.job) {
      if (application.job.candidatePosted) {
        // Candidate jobs already use jobTitle
        application.job.jobTitle = application.job.jobTitle;
      } else {
        // Company/College jobs use jobRoles
        application.job.jobTitle = application.job.jobRoles;
      }
    }
    return res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    console.error("Error fetching application:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
