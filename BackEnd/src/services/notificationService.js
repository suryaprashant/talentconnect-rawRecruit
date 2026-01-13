import Notification from "../models/notificationModel.js";
import Auth from "../models/authModel.js";
import CompanyProfile from "../models/companyDashboard/companyProfileModel.js";
import EmployerProfile from "../models/employerDashboard/employerProfileModel.js";
import CollegeOnboarding from "../models/collegeDashboard/collegeOnboardingModel.js";
import { JobPostingTable } from "../models/jobPostingsModel.js";


export async function getNotificationService(Id) {
    try {
        const response = await Notification.find({ recipientId: Id })
            .populate('senderId', 'name profileImage') // Get sender's name and image
            .sort({ createdAt: -1 });

          // notifications.controller.js
        

        return response;
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed");
    }
}

export async function getNotificationByIdService(Id) {
    try {
        const response = await Notification.findById(Id);
        return response;
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed");
    }
}

export async function markAsReadService(Id) {
    try {
        const response = await Notification.findById(Id);
        return response;
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed");
    }
}

//notify college about compony/employer job posting 
export const notifyCollegesOnOnCampusJob = async ({
  companyId,
  companyName,
  jobTitle,
  jobId,
  jobType,
}) => {
  try {
    
    const colleges = await Auth.find({ userType: "college" }).select("_id");

    console.log("Colleges found for notification:", colleges.length);

    if (!colleges.length) return;

    const notifications = colleges.map(college => ({
      recipientId: college._id,
      senderId: companyId,
      type: "SYSTEM_UPDATE",
      message: `${companyName} posted a ${jobType} job`,
      referenceId: jobId,
       jobType,
      read: false
    }));

    await Notification.insertMany(notifications);

    console.log("Notifications created:", notifications.length);
  } catch (error) {
    console.error("Notification Service Error:", error);
  }
};

//notify company /employer about college job request
export const notifyCompaniesOnCollegeJobRequest = async ({
  collegeId,
  collegeName,
  jobTitle,
  jobId, 
  jobType
}) => {
  try {
    // 🎯 Fetch ALL company + employer users
    const recipients = await Auth.find({
      userType: { $in: ["company", "employer"] }
    }).select("_id");

    console.log("Companies & employers found:", recipients.length);

    if (!recipients.length) return;

    const notifications = recipients.map(user => ({
      recipientId: user._id,     // ✅ AUTH ID
      senderId: collegeId,       // ✅ college AUTH ID
      type: "SYSTEM_UPDATE",
      message: `${collegeName} posted a ${jobType} job request`,
      referenceId: jobId,
        jobType,
      read: false
    }));

    await Notification.insertMany(notifications);

    console.log("College job request notifications sent:", notifications.length);
  } catch (error) {
    console.error("notifyCompaniesOnCollegeJobRequest error:", error);
  }
};


//shortlist/accepted
export const notifyOnApplicationStatusChange = async ({
  recipientId,
  recipientType,
  senderId,
  companyName,
  status,
  applicationId
}) => {
  try {
    const statusMessageMap = {
      Shortlisted: `${companyName} shortlisted your application`,
      Accepted: `${companyName} accepted your application`,
      Rejected: `${companyName} rejected your application`
    };

    const message = statusMessageMap[status];
    if (!message) return;

    await Notification.create({
      recipientId,
      senderId,
      type: `APPLICATION_${status.toUpperCase()}`, // eg APPLICATION_SHORTLISTED
      message,
      referenceId: applicationId,
      read: false
    });
  } catch (error) {
    console.error("Application status notification error:", error);
  }
};

export async function notifyOnCollegeApplicationStatusChange({
  application,
  newStatus,
  actorAuthId // college auth user id
}) {
  

  try {
    let recipientAuthIds = [];

    // 1️⃣ Resolve recipient Auth ID(s)
    switch (application.applicantType) {

      case "company": {
        const company = await CompanyProfile.findById(application.applicant)
          .select("userId");
        if (company?.userId) {
          recipientAuthIds.push(company.userId);
        }
        break;
      }

      case "employer": {
        const employer = await EmployerProfile.findById(application.applicant)
          .select("userId");
        if (employer?.userId) {
          recipientAuthIds.push(employer.userId);
        }
        break;
      }

      default:
        return; // safety
    }

    if (!recipientAuthIds.length) return;

    // 2️⃣ Resolve college name
    const college = await CollegeOnboarding.findOne({ userId: actorAuthId })
      .select("collegeUniversityDetails.collegeName");

    const collegeName =
      college?.collegeUniversityDetails?.collegeName || "College";

    // 3️⃣ Map status → notification type
    const STATUS_TYPE_MAP = {
      Shortlisted: "COLLEGE_APPLICATION_SHORTLISTED",
      Accepted: "COLLEGE_APPLICATION_ACCEPTED",
      Rejected: "COLLEGE_APPLICATION_REJECTED"
    };

    const notificationType = STATUS_TYPE_MAP[newStatus];
    if (!notificationType) return;

    // 4️⃣ Create notifications
    const notifications = recipientAuthIds.map(recipientId => ({
      recipientId,
      senderId: actorAuthId,
      type: notificationType,
      message: `${collegeName} ${newStatus.toLowerCase()} your application`,
      referenceId: application._id,
      read: false
    }));

    await Notification.insertMany(notifications);

  } catch (error) {
    console.error("🔔 Application status notification failed:", error.message);
  }
}



export async function createNotification({
  recipientId,
  senderId,
  type,
  message,
  referenceId,
  jobType
}) {
  try {
    console.log("🔔 Creating notification:", {
      recipientId,
      senderId,
      type,
      referenceId,
      jobType
    });

    await Notification.create({
      recipientId,
      senderId,
      type,
      message,
      referenceId,
      jobType,
      read: false
    });
  } catch (err) {
    console.error("❌ Notification create failed:", err.message);
  }
}

/**
 * 🔔 College applied to Company/Employer job
 */
export const notifyCompanyOnCollegeApply = async ({
  companyAuthId,
  collegeAuthId,
  collegeName,
  jobTitle,
  jobId,
  jobType,
}) => {
  try {
    await Notification.create({
      recipientId: companyAuthId,
      senderId: collegeAuthId,
      type: "JOB_REGISTRATION",
      message: `${collegeName} applied for your job: ${jobTitle}`,
      referenceId: jobId,
      jobType,
      read: false,
    });
  } catch (err) {
    console.error("notifyCompanyOnCollegeApply error:", err);
  }
};

/**
 * 🔔 Company/Employer applied to College job request
 */
export const notifyCollegeOnCompanyApply = async ({
  collegeAuthId,
  companyAuthId,
  companyName,
  jobTitle,
  jobId,
   jobType,
}) => {
  try {
    
    await Notification.create({
      recipientId: collegeAuthId,
      senderId: companyAuthId,
      type: "JOB_REGISTRATION",
      message: `${companyName} applied to your campus job request: ${jobTitle}`,
      referenceId: jobId,
       jobType,
      read: false,
    });
  } catch (err) {
    console.error("notifyCollegeOnCompanyApply error:", err);
  }
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
  try {
    await Notification.create({
      recipientId: collegeAuthId,
      senderId: companyAuthId,
      type: "INTERVIEW_SCHEDULED",
      message: `${companyName} scheduled an interview with you`,
      referenceId: applicationId,
      jobId,
      jobType,
      meta: {
        date,
        time,
      },
      read: false,
    });
  } catch (error) {
    console.error("Interview notification error:", error.message);
  }
};