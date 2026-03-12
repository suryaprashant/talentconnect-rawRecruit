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
import { notifyCollegeOnCompanyApply, notifyCollegeOnInterviewScheduled, notifyCompanyOnCollegeApply, notifyCompanyOnStudentApply, notifyOnApplicationStatusChange, notifyOnCollegeApplicationStatusChange } from "../services/notificationService.js";
import CompanyProfile from "../models/companyDashboard/companyProfileModel.js";
import CollegeOnboarding from "../models/collegeDashboard/collegeOnboardingModel.js";
import { unsaveJobService } from "../services/applicationService.js";
import { JobPostingTable } from "../models/jobPostingsModel.js";
import  InterviewSchedule  from "../models/InterviewSchedule.Model.js";
import { resolveStudentAuthId } from "../utils/resolveStudentAuthId.js";
import { fetchReferralApplicationsService } from "../controllers/../services/adminService.js";
import Application from "../models/applicationModel.js";
// controllers/professionalController.js
export const getReferralApplicationsForProfessional = async (req, res, next) => {
  try {
    const professionalProfileId = req.user.profileId; 

    // 1. Get the specific jobId from the URL query (?jobId=...)
    const { jobId, adminApprovalStatus } = req.query;

    // 2. Pass jobId into the service
    const response = await fetchReferralApplicationsService({
      professionalProfileId,
      jobId, // <--- THIS IS THE KEY CHANGE
      adminApprovalStatus: adminApprovalStatus || "Approved",
    });

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
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

// save opportunity
export async function saveJobByUser(req, res) {
  const { jobId, jobType } = req.body;
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
      jobType
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
      result = await getSavedJobsService(user.data[0]._id);
    }

    // ✅ company saved colleges
    else if (["company", "employer"].includes(userType)) {
  result = await getSavedCollegesService(user.data[0]._id, userType);
}


    //const application = await getSavedJobsService(user?.data[0]._id);
    // if (application.success !== true) return res.status(403).json({ msg: application });
    /*if (application.success === true)
      return res.status(200).json(application.data);
    res.status(503).json(application);*/

    if (result?.success)
      return res.status(200).json(result.data);

    return res.status(503).json(result);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}


// apply for opportunity

// offcampus
{/*export async function createOffcampusApplication(req, res) {
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
}*/}

export async function createOffcampusApplication(req, res) {
  console.log('applied offcampus')
  const { jobId } = req.body;
  const userId = req.user._id;
  const userType = req.user.userType; // student | fresher

  try {
    const user = await getStudentService(userId);
    if (!jobId) {
      return res.status(404).json({ msg: "Job not found!" });
    }

    if ( !user || !user.data?.length) {
      return res.status(404).json({ msg: "User not found!" });
    }

    const actorProfile = user.data[0];

    const job = await JobPostingTable.findById(jobId)
      .populate("companyPosted");

    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }

    const application = await createApplicationService({
      appliedByUserId: actorProfile._id,   // student profile id
      appliedByType: userType,             // student | fresher | professional
      appliedForCompanyId: null,           // 🔑 off-campus has NO company context
      jobId,
      jobType: "Off-campus",
    });

    if (application.success === false) {
      return res.status(403).json({ msg: application.message });
    }

    // 🔔 NOTIFICATION (NON-BLOCKING)
    try {
      if (job.companyPosted?.userId) {
        const studentName =
          actorProfile?.fullName ||
          actorProfile?.name ||
          "A candidate";

        const jobTitle =
          job.jobTitle ||
          `${job.jobType} ${job.lookingFor || "Job"}`;

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
      "Off-campus"
    );
    if (application.success === false)
      return res.status(403).json({ msg: application.message });

    res.status(201).json(application);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// internship
export async function createIntershipApplication(req, res) {
  const { internshipId } = req.body;
  const userId = req.user._id;
  const userType = req.user.userType;
  console.log("🔥 hit me")

  try {
    // to get userId from user database
    const user = await getStudentService(userId);

    if (!user || !user.data?.length || !internshipId) {
      return res.status(404).json({ msg: "User or Internship not found!" });
    }

    const actorProfile = user.data[0];

    const internship = await JobPostingTable.findById(internshipId)
      .populate("companyPosted");

    if (!internship) {
      return res.status(404).json({ msg: "Internship not found" });
    }

    const application = await createApplicationService({
      appliedByUserId: actorProfile._id,
      appliedByType: userType,          // student / fresher
      appliedForCompanyId: internship.companyPosted?._id || null,
      jobId: internshipId,
      jobType: "Internship",
    });



    if (application.success === false)
      return res.status(403).json({ msg: application.message });

     // 🔔 NOTIFICATION (NON-BLOCKING)
    try {
      if (internship.companyPosted?.userId) {
        const studentName =
          actorProfile?.fullName ||
          actorProfile?.name ||
          "A candidate";

        const jobTitle =
          internship.jobTitle ||
          `${internship.jobType} ${internship.lookingFor || "Role"}`;

        await notifyCompanyOnStudentApply({
          companyAuthId: internship.companyPosted.userId,
          studentAuthId: userId,
          studentName,
          jobTitle,
          jobId: internship._id,
          jobType: internship.jobType, // "Internship"
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
  const { referralId } = req.body;
  const userId = req.user._id;
  const userType = req.user.userType;

  try {
    // to get userId from user database
    const user = await getStudentService(userId);
    console.log(user, " ", referralId);
    if (!user || !referralId) return res.status(404).json({ msg: "Invalid" });

     const actorProfile = user.data[0];

    const application = await createApplicationService({
      appliedByUserId: actorProfile._id,     // 🔑 FIX
      appliedByType: userType,               // 🔑 FIX
      appliedForCompanyId: null,              // 🔑 Referral has no company context
      jobId: referralId,                      // 🔑 FIX
      jobType: "Referral",
    });

    if (application.success === false)
      return res.status(403).json({ msg: application.message });

    res.status(201).json(application);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// oncampus 
{/*export async function createOncampusApplication(req, res) {
  const { jobId } = req.body;
  const userId = req.user._id;
  const userType = req.user?.userType;

  console.log("🔥 createOncampusApplication HIT", {
  userType: req.user.userType,
  userId: req.user._id,
  jobId: req.body.jobId,
});


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
        break;
    }
    if (user.data.length == 0 || !user || !jobId)
      return res.status(404).json({ msg: "User or job not found!" });

    const job = await JobPostingTable.findById(jobId)
      .populate("companyPosted")
      .populate("collegePosted");

      console.log("🧾 JOB FOUND:", {
  jobId: job?._id,
  jobType: job?.jobType,
  collegePosted: job?.collegePosted,
  postedByUser: job?.postedByUser?._id,
});

    if (!job) return res.status(404).json({ msg: "Job not found" });

    const jobType = job.jobType; // "On-campus" | "Off-campus" | "Pool-campus"



    const application = await createApplicationService(
      user.data[0]._id,
      req.user.userType,
      jobId,
      "On-campus"
    );
    if (application.success === false)
      return res.status(403).json({ msg: application.message });

     // 🔔 NOTIFICATIONS
    if (userType === "college" && job.companyPosted) {

      console.log("🧠 NOTIFICATION CHECK:", {
  userType,
  hasCollegePosted: !!job.collegePosted,
});

      // College → Company
      await notifyCompanyOnCollegeApply({
        companyAuthId: job.companyPosted.authId,
        collegeAuthId: userId,
        collegeName:
          user.data[0]?.collegeUniversityDetails?.collegeName ||
          "A college",
        jobTitle: job.jobTitle || "Job",
        jobId: job._id,
        jobType,
      });
    }

    if (
      (userType === "company" || userType === "employer") &&
      job.collegePosted
    ) {
      // Company → College
      await notifyCollegeOnCompanyApply({
        collegeAuthId: job.collegePosted.authId,
        companyAuthId: userId,
        companyName: user.data[0]?.companyName || "A company",
        jobTitle: job.jobTitle || "Campus job",
        jobId: job._id,
        jobType,
      });
    }

    res.status(201).json(application);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}*/}

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

    if (!user || !user.data || user.data.length === 0 ) {
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
          job.jobTitle ||
          `${job.jobType} ${job.lookingFor || "Job"}`;

        

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
          job.jobTitle ||
          `${job.jobType} ${job.lookingFor || "Job"}`;

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
{/*export async function createPoolcampusApplication(req, res) {
  const { jobId } = req.body;
  const userId = req.user._id;
  const userType = req.user?.userType;

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
        break;
    }
    if (user.data.length == 0 || !user || !jobId)
      return res.status(404).json({ msg: "User or job not found!" });
    // if (await getApplicationService(user.data[0]._id, req.user.userType, jobId, "Pool-campus") === true) return res.status(403).json({ msg: "Already Applied" });

    const application = await createApplicationService(
      user.data[0]._id,
      req.user.userType,
      jobId,
      "Pool-campus"
    );
    if (application.success === false)
      return res.status(403).json({ msg: application.message });

    res.status(201).json(application);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}*/}

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
  {/*const appliedForCompanyId = isEmployeeWithCompany
    ? authUser.activeCompanyId
    : authUser.userType === "company"
      ? user.data?.[0]?._id
      : null;*/}

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
    }

    else if (authUser.userType === "company") {
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
        job.jobTitle ||
        `${job.jobType} ${job.lookingFor || "Job"}`;

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
        "Internship"
      )) === true
    )
      return res.status(403).json({ msg: "Already Applied" });

    const application = await createApplicationService(
      user.data[0]._id,
      req.user.userType,
      jobId,
      "Internship"
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

    const response = await fetchApplicationStatusService(
      user.data[0]._id,
      jobType,
      userType,
      activeCompanyId
    );

    // console.log(response);

    if (response.success) res.status(200).json(response);
    else res.status(404).json(response);
  } catch (error) {
    console.log("Error: ", error);
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
      isVisited
    );

    // to be implement -- sorting feature like ATS

    res.status(200).json(response.data);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ Error: "Internal server error" });
  }
}

// oncampus and poolcampus
{/*export async function getCollegeApplicationsByJob(req, res) {
  const { jobId, jobType, targetStatus, isVisited } = req.query;
  const userType = req.user.userType;
  if (!jobId || !jobType || !targetStatus)
    return res.status(404).json({ msg: "Job not found with given criteria!" });

  try {
    const response = await fetchCollegeSideApplicationsByJobService(
      jobId,
      jobType,
      userType,
      targetStatus,
      isVisited
    );

    // to be implement -- sorting feature like ATS

    res.status(200).json(response.data);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ Error: "Internal server error" });
  }
}*/}

{/*export async function getCollegeApplicationsByJob(req, res) {
  const { jobId, jobType, targetStatus, isVisited } = req.query;

  if (!jobId || !jobType || !targetStatus) {
    return res.status(404).json({ msg: "Job not found with given criteria!" });
  }

  try {
    const response = await fetchCollegeApplicationsByJobService(
      jobId,
      jobType,
      targetStatus,   // ✅ FIXED
      isVisited
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ Error: "Internal server error" });
  }
}*/}

//past new working for company prathmesh
export async function getCollegeApplicationsByJob(req, res) { 
  console.log("hello")
  
  const { jobId, jobType, targetStatus, isVisited } = req.query; 
  const userType = req.user.userType; if (!jobId || !jobType || !targetStatus) 
    return res.status(404).json({ msg: "Job not found with given criteria!" }); 
  
  try { const response = await fetchCollegeApplicationsByJobService( jobId, jobType, userType, targetStatus, isVisited ); 
    // to be implement -- sorting feature like ATS 
    console.log(response)
    
      res.status(200).json(response.data); 
    } catch (error) 
    { 
      console.log("Error: ", error); res.status(500).json({ Error: "Internal server error" }); 
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
          jobRole /*companyName*/
        ).catch(err => {
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
        
          const companyProfile = await CompanyProfile.findById(companyId)
            .select("companyDetails.companyName");
        
          const companyName =
            companyProfile?.companyDetails?.companyName || "Company";
        
          // ✅ THIS IS THE KEY FIX
          const collegeOnboarding = await CollegeOnboarding.findById(
            response.data.applicant
          ).select("userId");
        
          if (!collegeOnboarding?.userId) {
            console.error(
              "❌ College auth userId missing for onboardingId:",
              response.data.applicant
            );
            return;
          }
        
          const collegeAuthId = collegeOnboarding.userId;
        
          // ✅ Send notification using AUTH ID
          notifyOnApplicationStatusChange({
            recipientId: collegeAuthId,      // ✅ AUTH _id
            senderId: req.user._id,          // company/employer AUTH _id
            companyName,
            status: response.data.currentStatus, // Shortlisted
            applicationId: response.data._id,
            jobType: response.data.jobType
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
        
          const companyProfile = await CompanyProfile.findById(companyId)
            .select("companyDetails.companyName");
        
          const companyName =
            companyProfile?.companyDetails?.companyName || "Company";
        
          const studentAuthId = await resolveStudentAuthId(
            response.data.applicant
          );
        
          if (!studentAuthId) {
            console.error("❌ Student authId not found:", response.data.applicant);
            return;
          }
        
          notifyOnApplicationStatusChange({
            recipientId: studentAuthId,
            senderId: req.user._id,
            companyName,
            status: "Shortlisted",
            applicationId: response.data._id,
            jobType: response.data.jobType
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
        actorAuthId: req.user._id
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
          jobRole /*companyName*/
        ).catch(err => {
          console.error("Email sending failed:", err.message);
        });
      }

      // 🔔 SEND NOTIFICATION TO COLLEGE ON REJECT
      if (response.data.applicantType === "college") {
        try {
          const companyResult = await getEmployerService(req.user);
          if (!companyResult.success) return;
        
          const companyId = companyResult.data[0]._id;
        
          const companyProfile = await CompanyProfile.findById(companyId)
            .select("companyDetails.companyName");
        
          const companyName =
            companyProfile?.companyDetails?.companyName || "Company";
        
          // ✅ Convert CollegeOnboarding → Auth ID
          const collegeOnboarding = await CollegeOnboarding.findById(
            response.data.applicant
          ).select("userId");
        
          if (!collegeOnboarding?.userId) {
            console.error(
              "❌ College auth userId missing for onboardingId:",
              response.data.applicant
            );
            return;
          }
        
          notifyOnApplicationStatusChange({
            recipientId: collegeOnboarding.userId, // ✅ AUTH ID
            senderId: req.user._id,                // company AUTH ID
            companyName,
            status: "Rejected",
            applicationId: response.data._id,
            jobType: response.data.jobType
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
        
          const companyProfile = await CompanyProfile.findById(companyId)
            .select("companyDetails.companyName");
        
          const companyName =
            companyProfile?.companyDetails?.companyName || "Company";
        
          const studentAuthId = await resolveStudentAuthId(
            response.data.applicant
          );
        
          if (!studentAuthId) return;
        
          notifyOnApplicationStatusChange({
            recipientId: studentAuthId,
            senderId: req.user._id,
            companyName,
            status: "Rejected",
            applicationId: response.data._id,
            jobType: response.data.jobType
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
{/*export async function acceptApplicant(req, res) {
  const { applicationId } = req.params;
  const { jobRole } = req.body;
  if (!applicationId)
    return res.status(404).json({ msg: "Application not found!" });
  try {
    console.log("hello")
    const response = await ChangeStatusService(applicationId, "Accepted");

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
          jobRole 
        ).catch(err => {
          console.error("Email sending failed:", err.message);
        });
      }

      // 🔔 SEND NOTIFICATION TO COLLEGE ON ACCEPT
      if (response.data.applicantType === "college") {
        try {
          const companyResult = await getEmployerService(req.user);
          if (!companyResult.success) return;
        
          const companyId = companyResult.data[0]._id;
        
          const companyProfile = await CompanyProfile.findById(companyId)
            .select("companyDetails.companyName");
        
          const companyName =
            companyProfile?.companyDetails?.companyName || "Company";
        
          // ✅ Convert CollegeOnboarding → Auth ID
          const collegeOnboarding = await CollegeOnboarding.findById(
            response.data.applicant
          ).select("userId");
        
          if (!collegeOnboarding?.userId) {
            console.error(
              "❌ College auth userId missing for onboardingId:",
              response.data.applicant
            );
            return;
          }
        
          notifyOnApplicationStatusChange({
            recipientId: collegeOnboarding.userId, // ✅ AUTH ID
            senderId: req.user._id,                // company AUTH ID
            companyName,
            status: "Accepted",
            applicationId: response.data._id
          });
        
        } catch (err) {
          console.error("Accept notification failed:", err);
        }
      }


      return res.status(200).json(response);
    }
    return res.status(404).json(response);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ Error: "Internal server error" });
  }
}*/}

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
        const college = await CollegeOnboarding.findById(application.applicant)
          .select("userId");

        if (!college?.userId) {
          console.error("❌ College authId not found for:", application.applicant);
        } else {
          // Resolve company name (actor side)
          let companyName = "Company";

          const companyProfile = await CompanyProfile.findOne({
            userId: actorAuthId
          }).select("companyDetails.companyName");

          if (companyProfile?.companyDetails?.companyName) {
            companyName = companyProfile.companyDetails.companyName;
          }

          // 🔔 Notify college
          notifyOnApplicationStatusChange({
            recipientId: college.userId,   // AUTH ID
            senderId: actorAuthId,          // company/employer AUTH
            companyName,
            status: "Accepted",
            applicationId: application._id,
            jobType: response.data.jobType
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
        actorAuthId
      });
    }

    // 👉 CASE 3: Student / Fresher is applicant → Company accepted them
    if (
      application.applicantType === "student" ||
      application.applicantType === "fresher"
    ) {
      try {
        const studentAuthId = await resolveStudentAuthId(application.applicant);
        if (!studentAuthId) return;
      
        let companyName = "Company";
      
        const companyProfile = await CompanyProfile.findOne({
          userId: actorAuthId
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
          jobType: response.data.jobType
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
      "companyPosted"
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
      "collegePosted"
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
      "companyPosted"
    );
    // console.log(response);
    res.status(200).json(response);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ Error: "Internal server error" });
  }
}

// schdule Interview
{/*export async function scheduleInterview(req, res) {
  const companyId = req.user._id;
  const { applicantId, applicantType, jobRole } = req.body;
  const { date, time, meetLink, message } = req.body.data;
  // console.log("data", applicantId, applicantType, date, meetLink, jobRole);
  if (!date || !time || !meetLink || !jobRole)
    return res.status(404).json({ msg: "required fields missing" });

  try {
    const company = await getCompanyService(companyId);
    if (!company) return res.status(404).json({ msg: "company not found!" });

    if (company.success === true) {
      const companyName = company.data[0].companyDetails.companyName;
      let applicantMail;
      switch (applicantType) {
        case "student":
        case "fresher":
        case "professional":
          applicantMail = await getCandidatEmail(applicantId);
          break;
        case "college":
          applicantMail = await getCollegeEmail(applicantId);
          break;
        case "company":
          applicantMail = await getCompanyEmail(applicantId);
          break;
        default:
          return res.status(404).json({ msg: "Invalid User!" });
      }
      const response = await sendScheduledInterviewEmail(
        applicantMail.email,
        date,
        time,
        message,
        meetLink,
        jobRole,
        companyName
      );
      res.status(200).json({ success: true, msg: "Interview Scheduled!" });
    }
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ Error: "Internal server error" });
  }
}*/}

//prathmesh interview schedule fix
export async function scheduleInterview(req, res) {
  try {
    console.log("📩 Schedule Interview Payload:", req.body);

    const companyAuthId = req.user._id;

    const {
      applicationId,
      jobId,
      jobType,
      applicantId,        // profile id (college / student / etc)
      applicantAuthId,    // auth id (already provided)
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
      name: req.body?.applicantName || "",        // frontend will pass this
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
            }
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
          companyName
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
    console.error('❌ Error in getCompanyDashboardMetrics:', error);
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
// controllers/applicationController.js


// export const updateApplicationStatus = async (req, res) => {
//     try {
//         const { applicationId } = req.params;
//         const { status } = req.body; // "Accepted" or "Rejected"

//         // Basic validation
//         if (!["Accepted", "Rejected"].includes(status)) {
//             return res.status(400).json({ 
//                 success: false, 
//                 message: "Status must be either 'Accepted' or 'Rejected'" 
//             });
//         }

//         const updatedApplication = await Application.findByIdAndUpdate(
//             applicationId,
//             { currentStatus: status },
//             { new: true }
//         );

//         if (!updatedApplication) {
//             return res.status(404).json({ success: false, message: "Application not found" });
//         }

//         res.status(200).json({
//             success: true,
//             message: `Status updated to ${status}`,
//             data: updatedApplication
//         });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// };

// controllers/applicationController.js

export const updateApplicationStatus = async (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body;

  try {
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    // Update the status and push to history
    application.currentStatus = status;
    application.statusHistory.push({
      status: status,
      date: new Date()
    });

    await application.save();

    res.status(200).json({ 
      success: true, 
      message: `Status updated to ${status}`,
      data: application 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};