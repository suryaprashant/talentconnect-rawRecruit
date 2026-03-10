import Notification from "../models/notificationModel.js";
import Auth from "../models/authModel.js";
import CompanyProfile from "../models/companyDashboard/companyProfileModel.js";
import EmployerProfile from "../models/employerDashboard/employerProfileModel.js";
import CollegeOnboarding from "../models/collegeDashboard/collegeOnboardingModel.js";
import { getReceiverSocketId, io } from "../socketIO/server.js";
import { pushNotification } from "./firebaseAdmin.js";

// ─── CORE HELPER ────────────────────────────────────────────────────────────

const sendNotification = async ({
  recipientId, senderId, type, message, referenceId, jobType, meta, jobId,
}) => {
  // 1. Save to DB
  const notification = await Notification.create({
    recipientId, senderId, type, message, referenceId, jobType, meta, jobId, read: false,
  });

  // 2. Socket emit — sync, no await
  const socketId = getReceiverSocketId(recipientId.toString());
  console.log("socketId found:", socketId);
  if (socketId) {
    io.to(socketId).emit("newNotification", notification);
    console.log("🚀 emitted to socket");
  }

  // 3. FCM — completely non-blocking, runs after socket
  setImmediate(async () => {
    try {
      const user = await Auth.findById(recipientId).select("deviceToken");
      if (user?.deviceToken) {
        await pushNotification({
          deviceToken: user.deviceToken,
          title: type,
          body: message,
        });
      }
    } catch (fcmErr) {
      console.error("FCM error (non-critical):", fcmErr.message);
    }
  });

  return notification;
};

// ─── GET NOTIFICATIONS ───────────────────────────────────────────────────────

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
    Shortlisted: `${companyName} shortlisted your application`,
    Accepted: `${companyName} accepted your application`,
    Rejected: `${companyName} rejected your application`,
  };

  const message = statusMessageMap[status];
  if (!message) return;

  await sendNotification({
    recipientId,
    senderId,
    type: `APPLICATION_${status.toUpperCase()}`,
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
}) {
  await sendNotification({ recipientId, senderId, type, message, referenceId, jobType });
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