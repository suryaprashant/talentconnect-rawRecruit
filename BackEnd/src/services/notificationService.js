import Notification from "../models/notificationModel.js";
import Auth from "../models/authModel.js";
import CompanyProfile from "../models/companyDashboard/companyProfileModel.js";
import EmployerProfile from "../models/employerDashboard/employerProfileModel.js";
import CollegeOnboarding from "../models/collegeDashboard/collegeOnboardingModel.js";
import { getReceiverSocketId, io } from "../socketIO/server.js";
import { pushNotification } from "./firebaseAdmin.js";
import Application from "../models/applicationModel.js";
import Onboarding from "../models/studentonboardingModel.js";
import { JobPostingTable } from "../models/jobPostingsModel.js";
console.log("✅✅✅ notificationService.js LOADED ✅✅✅");
export const NOTIFICATION_SCREEN_MAP = {
  REFERRAL_JOB_APPROVED: {
    topic: "Jobs",
    subtopic: "My Posted",
    body: { jobId: "jobId" },
  },
  REFERRAL_JOB_REJECTED: {
    topic: "Jobs",
    subtopic: "My Posted",
    body: { jobId: "jobId" },
  },
  REFERRAL_APPLICATION_APPROVED: {
    topic: "Referrer",
    subtopic: "Applied By Me",
    body: { applicationId: "applicationId" },
  },
  JOB_REGISTRATION: {
    topic: "Jobs",
    subtopic: "JobDetail",
    body: { jobId: "jobId" },
  },
  NEW_APPLICATION_FOR_JOB: {
    topic: "Job Detail",
    subtopic: "Candidates",
    body: { jobId: "jobId", applicationId: "referenceId" },
  },
  INTERVIEW_SCHEDULED: {
    topic: "Scheduled Interviews",
    subtopic: "",
    body: { applicationId: "referenceId", jobId: "jobId" },
  },
  APPLICATION_INTERVIEW_SCHEDULED: {
    topic: "Referrer",
    subtopic: "Applied By Me",
    body: { applicationId: "referenceId", jobId: "jobId" },
  },
  APPLICATION_SHORTLISTED: {
    topic: "Referrer",
    subtopic: "Applied By Me",
    body: { applicationId: "referenceId", jobId: "jobId" },
  },
  APPLICATION_ACCEPTED: {
    topic: "Referrer",
    subtopic: "Applied By Me",
    body: { applicationId: "referenceId", jobId: "jobId" },
  },
  APPLICATION_REJECTED: {
    topic: "Referrer",
    subtopic: "Applied By Me",
    body: { applicationId: "referenceId", jobId: "jobId" },
  },
  APPLICATION_OFFER_EXTENDED: {
    topic: "Referrer",
    subtopic: "Applied By Me",
    body: { applicationId: "referenceId", jobId: "jobId" },
  },
  APPLICATION_REFERRED_TO_COMPANY: {
    topic: "Referrer",
    subtopic: "Applied By Me",
    body: { applicationId: "referenceId", jobId: "jobId" },
  },
  NEW_CHAT_MESSAGE: {
    topic: "Chat",
    subtopic: "",
    body: { senderId: "senderId", referenceId: "referenceId" },
  },
  MESSAGE: {
    topic: "Chat",
    subtopic: "",
    body: { senderId: "senderId", referenceId: "referenceId" },
  },
  NEW_MATCHING_REFERRAL_JOB : {
    topic: "Jobs",
    subtopic: "JobDetail",
    body: { jobId: "jobId" },
  },
  NEW_ALUMNI_JOINED_NETWORK : {
    topic: "Alumni Network",
    subtopic: "Alumni Detail",
    body: { userId: "userId" },
  },
  REFERRAL_MILESTONE_REACHED: {
    topic: "Profile",
    subtopic: "",
    body: {},
  },
  NEW_REFERRAL_REQUEST: {
    topic: "Referrals",
    subtopic: "Received Requests",
    body: { requestId: "referenceId", userId: "senderId" },
  },
  REFERRAL_REQUEST_ACCEPTED: {
    topic: "Referrer",
    subtopic: "Applied By Me",
    body: { requestId: "referenceId" },
  },
  REFERRAL_REQUEST_REJECTED: {
    topic: "Referrer",
    subtopic: "Applied By Me",
    body: { requestId: "referenceId" },
  },
};
// ─── CORE HELPER ────────────────────────────────────────────────────────────
const SKIP_DB_TYPES = ["NEW_CHAT_MESSAGE", "MESSAGE", "INTERVIEW_SCHEDULED", "APPLICATION_INTERVIEW_SCHEDULED" ];
const sendNotification = async ({
  recipientId, senderId, type, message, referenceId, jobType, meta, jobId, userId,
}) => {
  // Build enriched meta with deep link info
  const screenInfo = NOTIFICATION_SCREEN_MAP[type];
  
  console.log("===== NOTIFICATION DEBUG =====");
  console.log("type:", type);
  console.log("screenInfo:", screenInfo);
  console.log("Input - userId:", userId, "jobId:", jobId, "referenceId:", referenceId, "senderId:", senderId);
  
  // ✅ FIXED: Build body with proper value mapping
  let enrichedBody = {};
  if (screenInfo?.body) {
    enrichedBody = Object.fromEntries(
      Object.entries(screenInfo.body)
        .map(([key, sourceKey]) => {
          let value = null;
          
          // Map source key to actual value
          if (sourceKey === "senderId")      value = senderId?.toString();
          else if (sourceKey === "jobId")    value = jobId?.toString();
          else if (sourceKey === "userId")   value = userId?.toString();
          else if (sourceKey === "referenceId")  value = referenceId?.toString();
          else if (sourceKey === "applicationId") value = referenceId?.toString();
          
          // Only include if value exists
          if (value) {
            return [key, value];
          }
          return null;
        })
        .filter(Boolean) // Remove null entries
    );
  }
 
  const enrichedMeta = {
    ...meta,
    ...(screenInfo && {
      topic: screenInfo.topic,
      subtopic: screenInfo.subtopic,
      body: enrichedBody,
    }),
  };
  
  console.log("enrichedMeta:", JSON.stringify(enrichedMeta, null, 2));
  console.log("==============================");
  let notification = null;
  // 1. Save to DB
  console.error("\n🔵 ABOUT TO SAVE NOTIFICATION 🔵");
  console.error("enrichedMeta being saved:", JSON.stringify(enrichedMeta, null, 2));
  console.error("🔵\n");
  if (!SKIP_DB_TYPES.includes(type)) {
   notification = await Notification.create({
    recipientId, 
    senderId, 
    type, 
    message,
    referenceId, 
    jobType,
    meta: enrichedMeta,   // 👈 now includes topic, subtopic, body
    jobId, 
    read: false,
  });
   }
  // console.error("\n🟢 NOTIFICATION SAVED 🟢");
  // console.error("ID:", notification._id);
  // console.error("meta from DB:", JSON.stringify(notification.meta, null, 2));
  // console.error("🟢\n");
 
  // 2. Socket emit
  // const socketId = getReceiverSocketId(recipientId.toString());
  // if (socketId) {
  //   const populatedNotification = await Notification.findById(notification._id)
  //     .populate("senderId", "name userType profileImage");
  //   io.to(socketId).emit("newNotification", populatedNotification);
  // }
  const socketId = getReceiverSocketId(recipientId.toString());
  if (socketId) {
    const payload = notification
      ? await Notification.findById(notification._id)
          .populate("senderId", "name userType profileImage")
      : {
          recipientId, senderId, type, message,
          referenceId, jobType, meta: enrichedMeta, jobId,
          read: false, createdAt: new Date(),
        };
    io.to(socketId).emit("newNotification", payload);
  }
  // 3. FCM
  try {
    const user = await Auth.findById(recipientId).select("deviceToken");
    if (user?.deviceToken) {
      await pushNotification({
        deviceToken: user.deviceToken,
        title: type,
        body: message,
        data: {
          topic:    screenInfo?.topic    ?? "",
          subtopic: screenInfo?.subtopic ?? "",
          type,
          // Add resolved body values to FCM payload
          ...enrichedBody,
        },
      });
    }
  } catch (fcmErr) {
    console.error("FCM error (non-critical):", fcmErr);
  }
 
  return notification;
};

// ─── GET NOTIFICATIONS ───────────────────────────────────────────────────────
export const notifyReferralJobPosterOnApproval = async ({
  job,
  approvalStatus,
  adminAuthId,
}) => {
  try {
    // candidatePosted is the Onboarding doc of the job poster
    // populated with "userId" — that's the Auth ID we need
    const posterAuthId = job.candidatePosted?.userId;

    if (!posterAuthId) {
      console.error("❌ Could not resolve job poster authId from candidatePosted");
      return;
    }

    const message =
      approvalStatus === "Approved"
        ? "Your referral job posting has been approved by admin"
        : "Your referral job posting has been rejected by admin";

    await sendNotification({
      recipientId: posterAuthId,
      senderId: adminAuthId,
      type: approvalStatus === "Approved" ? "REFERRAL_JOB_APPROVED" : "REFERRAL_JOB_REJECTED",
      message,
      referenceId: job._id,
      jobId: job._id, 
      jobType: "Referral",
      meta: { approvalStatus },
    });

    console.log(`✅ Notified job poster (${posterAuthId}) — ${approvalStatus}`);
  } catch (error) {
    console.error("notifyReferralJobPosterOnApproval failed:", error.message);
  }
};

export async function getNotificationService(Id) {
  try {
    const response = await Notification.find({ recipientId: Id })
      .populate("senderId", "name profileImage")
      .sort({ createdAt: -1 });
    return response;
  } catch (error) {
    console.log("Error: ", error.message);
    throw new Error("Failed");
  }
}

export async function getNotificationByIdService(Id) {
  try {
    return await Notification.findById(Id);
  } catch (error) {
    console.log("Error: ", error.message);
    throw new Error("Failed");
  }
}

export async function markAsReadService(Id) {
  try {
    return await Notification.findById(Id);
  } catch (error) {
    console.log("Error: ", error.message);
    throw new Error("Failed");
  }
}

// ─── BULK NOTIFICATIONS (DB only, no push) ───────────────────────────────────

const getRecipientFilterByJobType = (jobType) => {
  switch (jobType) {
    case "Off-campus":
    case "Internship":
      return { userType: { $in: ["student", "fresher"] } };
    default:
      return null;
  }
};

export const notifyUsersOnJobPost = async ({
  companyId,
  companyName,
  jobTitle,
  jobId,
  jobType,
}) => {
  try {
    const recipientFilter = getRecipientFilterByJobType(jobType);
    if (!recipientFilter) return;

    const users = await Auth.find(recipientFilter).select("_id");
    if (!users.length) return;

    const notifications = users.map((user) => ({
      recipientId: user._id,
      senderId: companyId,
      type: "SYSTEM_UPDATE",
      message: `${companyName} posted a new ${jobType} opportunity`,
      referenceId: jobId,
      jobType,
      read: false,
    }));

    await Notification.insertMany(notifications);
    // No FCM here — bulk broadcast, mobile fetches on app open
  } catch (error) {
    console.error("Notification Service Error:", error);
  }
};

export const notifyCollegesOnOnCampusJob = async ({
  companyId,
  companyName,
  jobId,
  jobType,
}) => {
  try {
    const colleges = await Auth.find({ userType: "college" }).select("_id");
    if (!colleges.length) return;

    const notifications = colleges.map((college) => ({
      recipientId: college._id,
      senderId: companyId,
      type: "SYSTEM_UPDATE",
      message: `${companyName} posted a ${jobType} job`,
      referenceId: jobId,
      jobType,
      read: false,
    }));

    await Notification.insertMany(notifications);
    // No FCM here — bulk broadcast
  } catch (error) {
    console.error("Notification Service Error:", error);
  }
};

export const notifyCompaniesOnCollegeJobRequest = async ({
  collegeId,
  collegeName,
  jobId,
  jobType,
}) => {
  try {
    const recipients = await Auth.find({
      userType: { $in: ["company", "employer"] },
    }).select("_id");
    if (!recipients.length) return;

    const notifications = recipients.map((user) => ({
      recipientId: user._id,
      senderId: collegeId,
      type: "SYSTEM_UPDATE",
      message: `${collegeName} posted a ${jobType} job request`,
      referenceId: jobId,
      jobType,
      read: false,
    }));

    await Notification.insertMany(notifications);
    // No FCM here — bulk broadcast
  } catch (error) {
    console.error("notifyCompaniesOnCollegeJobRequest error:", error);
  }
};

// ─── INDIVIDUAL NOTIFICATIONS (DB + socket + FCM) ────────────────────────────

export const notifyOnApplicationStatusChange = async ({
  recipientId,
  senderId,
  companyName,
  status,
  applicationId,
  jobType,
}) => {
  const statusMessageMap = {
    "Shortlisted": `${companyName} shortlisted your application`,

    "Interview Scheduled":
      `${companyName} scheduled an interview for your application`,

    "Offer Extended":
      `${companyName} extended an offer for your application`,

    "Accepted":
      `${companyName} accepted your application`,

    "Rejected":
      `${companyName} rejected your application`,

    "Referred To Company":
      `${companyName} referred your application to the company`,
  };

  const message = statusMessageMap[status];
  if (!message){
    console.error(`No notification message configured for status: ${status}`);
    return;
  }
  let finalRecipientAuthId = recipientId;

  // 🔍 Check if recipientId is actually Auth ID
  const authExists = await Auth.findById(recipientId).select("_id");

  if (!authExists && applicationId) {
    console.log("⚠️ recipientId is not Auth. Resolving via application...");

    const application = await Application.findById(applicationId).lean();
    if (!application) return;

    switch (application.applicantType) {
      case "student":
      case "fresher":
      case "professional": {
        const onboarding = await Onboarding.findById(application.applicant).select("userId");
        finalRecipientAuthId = onboarding?.userId;
        break;
      }

      case "college": {
        const college = await CollegeOnboarding.findById(application.applicant).select("userId");
        finalRecipientAuthId = college?.userId;
        break;
      }

      case "company": {
        const company = await CompanyProfile.findById(application.applicant).select("userId");
        finalRecipientAuthId = company?.userId;
        break;
      }

      default:
        break;
    }
  }

  if (!finalRecipientAuthId) {
    console.error("❌ Could not resolve Auth ID for notification");
    return;
  }

  await sendNotification({
    recipientId: finalRecipientAuthId,
    senderId,
    type: `APPLICATION_${status
      .toUpperCase()
      .replace(/\s+/g, "_")}`,
    message,
    referenceId: applicationId,
    jobType,
  });
};

export async function notifyOnCollegeApplicationStatusChange({
  application,
  newStatus,
  actorAuthId,
}) {
  try {
    let recipientAuthIds = [];

    switch (application.applicantType) {
      case "company": {
        const company = await CompanyProfile.findById(application.applicant).select("userId");
        if (company?.userId) recipientAuthIds.push(company.userId);
        break;
      }
      case "employer": {
        const employer = await EmployerProfile.findById(application.applicant).select("userId");
        if (employer?.userId) recipientAuthIds.push(employer.userId);
        break;
      }
      default:
        return;
    }

    if (!recipientAuthIds.length) return;

    const college = await CollegeOnboarding.findOne({ userId: actorAuthId }).select(
      "collegeUniversityDetails.collegeName"
    );
    const collegeName = college?.collegeUniversityDetails?.collegeName || "College";

    const STATUS_TYPE_MAP = {
      Shortlisted: "COLLEGE_APPLICATION_SHORTLISTED",
      Accepted: "COLLEGE_APPLICATION_ACCEPTED",
      Rejected: "COLLEGE_APPLICATION_REJECTED",
    };

    const notificationType = STATUS_TYPE_MAP[newStatus];
    if (!notificationType) return;

    // Use sendNotification for each recipient (socket + FCM included)
    await Promise.all(
      recipientAuthIds.map((recipientId) =>
        sendNotification({
          recipientId,
          senderId: actorAuthId,
          type: notificationType,
          message: `${collegeName} ${newStatus.toLowerCase()} your application`,
          referenceId: application._id,
        })
      )
    );
  } catch (error) {
    console.error("Application status notification failed:", error.message);
  }
}

export async function createNotification({
  recipientId,
  senderId,
  type,
  message,
  referenceId,
  jobType,
  meta,
  jobId,
  userId,
}) {
  console.error("\n🟢🟢🟢 createNotification CALLED 🟢🟢🟢");
  console.error("Type:", type);
  console.error("RecipientId:", recipientId);
  console.error("UserId:", userId);
  console.error("🟢🟢🟢 About to call sendNotification 🟢🟢🟢\n");
  
  try {
    const result = await sendNotification({ recipientId, senderId, type, message, referenceId, jobType, meta, jobId, userId });
    console.error("🟢 createNotification returned successfully\n");
    return result;
  } catch (error) {
    console.error("🔴 ERROR in createNotification:", error.message);
    console.error(error);
    throw error;
  }
}

export const notifyCompanyOnCollegeApply = async ({
  companyAuthId,
  collegeAuthId,
  collegeName,
  jobTitle,
  jobId,
  jobType,
}) => {
  await sendNotification({
    recipientId: companyAuthId,
    senderId: collegeAuthId,
    type: "JOB_REGISTRATION",
    message: `${collegeName} applied for your job: ${jobTitle}`,
    referenceId: jobId,
    jobId: jobId,
    jobType,
  });
};

export const notifyCompanyOnStudentApply = async ({
  companyAuthId,
  studentAuthId,
  studentName,
  jobTitle,
  jobId,
  jobType,
}) => {
  await sendNotification({
    recipientId: companyAuthId,
    senderId: studentAuthId,
    type: "JOB_REGISTRATION",
    message: `${studentName} applied for your job: ${jobTitle}`,
    referenceId: jobId,
    jobId: jobId,
    jobType,
  });
};

export const notifyCollegeOnCompanyApply = async ({
  collegeAuthId,
  companyAuthId,
  companyName,
  jobTitle,
  jobId,
  jobType,
}) => {
  await sendNotification({
    recipientId: collegeAuthId,
    senderId: companyAuthId,
    type: "JOB_REGISTRATION",
    message: `${companyName} applied to your campus job request: ${jobTitle}`,
    referenceId: jobId,
    jobId: jobId,
    jobType,
  });
};

export const notifyCollegeOnInterviewScheduled = async ({
  collegeAuthId,
  companyAuthId,
  companyName,
  applicationId,
  jobId,
  jobType,
  date,
  time,
}) => {
  await sendNotification({
    recipientId: collegeAuthId,
    senderId: companyAuthId,
    type: "INTERVIEW_SCHEDULED",
    message: `${companyName} scheduled an interview with you`,
    referenceId: applicationId,
    jobId,
    jobType,
    meta: { date, time },
  });
};

export const notifyCandidateOnAdminInterviewScheduled = async ({
  recipientId,
  senderId,
  companyName,
  applicationId,
  jobId,
  jobType,
  date,
  time,
}) => {
  await sendNotification({
    recipientId,          // candidate authId
    senderId,             // admin authId
    type: "INTERVIEW_SCHEDULED",
    message: `Admin scheduled interview for ${companyName} application`,
    referenceId: applicationId,
    jobId,
    jobType,
    meta: { date, time },
  });
};

export const notifyOnNewChatMessage = async ({
  senderId,
  receiverId,
  message,
  conversationId,
}) => {
  try {
    await sendNotification({
      recipientId: receiverId,     // MUST be Auth._id
      senderId,
      type: "NEW_CHAT_MESSAGE",
      message,
      referenceId: conversationId, // optional
    });
  } catch (err) {
    console.error("Chat notification error:", err.message);
  }
};

export const notifyCandidateOnReferralApproval = async ({
  applicationId,
  applicantProfileId,
  applicantType,
  action,
  adminAuthId
}) => {
  try {
    let candidateAuthId = null;

    // 🔹 Resolve candidate AUTH ID (who applied)
    if (
      applicantType === "student" ||
      applicantType === "fresher" ||
      applicantType === "professional"
    ) {
      const onboarding = await Onboarding.findById(applicantProfileId)
        .select("userId");

      candidateAuthId = onboarding?.userId;
    }

    if (!candidateAuthId) {
      console.error("❌ Candidate authId not found:", applicantProfileId);
      return;
    }

    // 🔹 Resolve company name from job poster onboarding
    const application = await Application.findById(applicationId)
      .populate("job");
      
    let companyName = "the company";
      
    if (application?.job?.candidatePosted) {
    
      const jobPosterOnboarding = await Onboarding.findById(
        application.job.candidatePosted
      ).select("currentCompany");
    
      if (jobPosterOnboarding?.currentCompany) {
        companyName = jobPosterOnboarding.currentCompany;
      }
    }

    // 🔹 Build notification message
    const message =
      action === "Approved"
        ? `Your referral application has been approved by admin for ${companyName}`
        : `Your referral application has been rejected by admin for ${companyName}`;

    await sendNotification({
      recipientId: candidateAuthId,
      senderId: adminAuthId,
      type: `REFERRAL_APPLICATION_${action.toUpperCase()}`,
      message,
      referenceId: applicationId,
      jobType: "Referral",
    });

  } catch (error) {
    console.error("Referral approval notification failed:", error.message);
  }
};

export const notifyReferralJobPosterOnNewApplication = async ({
  jobId,
  applicationId,
  adminAuthId,
}) => {
  try {
    // 🔹 Fetch job and populate referrer's onboarding profile
    const job = await JobPostingTable.findById(jobId)
      .populate("candidatePosted", "userId currentCompany");

    if (!job) {
      console.error("❌ Job not found for referrer notification:", jobId);
      return;
    }

    const referrerAuthId = job.candidatePosted?.userId;

    if (!referrerAuthId) {
      console.error("❌ Could not resolve referrer authId");
      return;
    }

    await sendNotification({
      recipientId: referrerAuthId,
      senderId: adminAuthId,
      type: "NEW_APPLICATION_FOR_JOB",
      message: `There is a new application for your referral job`,
      referenceId: applicationId,
      jobId: job._id,
      jobType: "Referral",
    });

    console.log(`✅ Notified referrer (${referrerAuthId}) of new approved application`);
  } catch (error) {
    console.error("notifyReferralJobPosterOnNewApplication failed:", error.message);
  }
};

export const notifyAlumniOnNewReferralRequest = async ({
  alumniAuthId,
  senderUserId,
  senderName,
  companyName,
  requestId,
}) => {
  try {
    await sendNotification({
      recipientId: alumniAuthId,
      senderId: senderUserId,
      type: "NEW_REFERRAL_REQUEST",
      message: `${senderName} requested a referral for ${companyName}`,
      referenceId: requestId,
      jobType: "Referral",
    });
  } catch (error) {
    console.error("notifyAlumniOnNewReferralRequest failed:", error.message);
  }
};

export const notifySenderOnReferralRequestStatusChange = async ({
  senderAuthId,
  receiverAuthId,
  status,
  requestId,
  companyName,
}) => {
  try {
    const message =
      status === "accepted"
        ? `Your referral request for ${companyName} was accepted`
        : `Your referral request for ${companyName} was declined`;

    await sendNotification({
      recipientId: senderAuthId,
      senderId: receiverAuthId,
      type: status === "accepted" ? "REFERRAL_REQUEST_ACCEPTED" : "REFERRAL_REQUEST_REJECTED",
      message,
      referenceId: requestId,
      jobType: "Referral",
    });
  } catch (error) {
    console.error("notifySenderOnReferralRequestStatusChange failed:", error.message);
  }
};