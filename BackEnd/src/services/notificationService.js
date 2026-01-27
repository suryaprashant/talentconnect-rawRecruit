import Notification from "../models/notificationModel.js";
import Auth from "../models/authModel.js";
import CompanyProfile from "../models/companyDashboard/companyProfileModel.js";
import EmployerProfile from "../models/employerDashboard/employerProfileModel.js";
import CollegeOnboarding from "../models/collegeDashboard/collegeOnboardingModel.js";
import { JobPostingTable } from "../models/jobPostingsModel.js";
import { getReceiverSocketId , io } from "../socketIO/server.js";


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

//notify candidate about job off-campus posting
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

    const notifications = users.map(user => ({
      recipientId: user._id,
      senderId: companyId,
      type: "SYSTEM_UPDATE",
      message: `${companyName} posted  a new ${jobType} opportunity`,
      referenceId: jobId,
      jobType,
      read: false,
    }));

    await Notification.insertMany(notifications);
  } catch (error) {
    console.error("Notification Service Error:", error);
  }
};


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


//shortlist/accepted real time working
export const notifyOnApplicationStatusChange = async ({
  recipientId,
  recipientType,
  senderId,
  companyName,
  status,
  applicationId,
  jobType
}) => {
  try {
    const statusMessageMap = {
      Shortlisted: `${companyName} shortlisted your application`,
      Accepted: `${companyName} accepted your application`,
      Rejected: `${companyName} rejected your application`
    };

    const message = statusMessageMap[status];
    if (!message) return;

    console.log("🔔 Creating notification for:", recipientId);

    const notification = await Notification.create({
      recipientId,
      senderId,
      type: `APPLICATION_${status.toUpperCase()}`, // eg APPLICATION_SHORTLISTED
      message,
      referenceId: applicationId,
      jobType,
      read: false
    });

    console.log("✅ Notification saved:", notification._id);

    // REAL-TIME PUSH (CHAT STYLE)
    try {
      const receiverSocketId = getReceiverSocketId(recipientId.toString());

      console.log("🧩 receiverSocketId:", receiverSocketId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newNotification", notification);
      } 

    } catch (err) {
      console.error("Socket notification emit failed:", err);
    }

  } catch (error) {
    console.error("Application status notification error:", error);
  }
};

//real time working
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

    

    const createdNotifications = await Notification.insertMany(notifications);

    createdNotifications.forEach(notification => {
      const receiverSocketId = getReceiverSocketId(
        notification.recipientId.toString()
      );
    
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newNotification", notification);
      }
    });


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


/*candidate apply to company off posted job*/ 
export const notifyCompanyOnStudentApply = async ({
  companyAuthId,
  studentAuthId,
  studentName,
  jobTitle,
  jobId,
  jobType,
}) => {
  try {
    await Notification.create({
      recipientId: companyAuthId,
      senderId: studentAuthId,
      type: "JOB_REGISTRATION",
      message: `${studentName} applied for your job: ${jobTitle}`,
      referenceId: jobId,
      jobType,
      read: false,
    });
  } catch (err) {
    console.error("notifyCompanyOnStudentApply error:", err);
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
    const notification = await Notification.create({
      recipientId: collegeAuthId,
      senderId: companyAuthId,
      type: "INTERVIEW_SCHEDULED",
      message: `${companyName} scheduled an interview with you`,
      referenceId: applicationId,
      jobId,
      jobType,
      meta: { date, time },
      read: false,
    });
    
    // 🔔 REAL-TIME SOCKET PUSH
    try {
      const receiverSocketId = getReceiverSocketId(
        collegeAuthId.toString() // 🔥 IMPORTANT
      );
    
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newNotification", notification);
        console.log("🚀 Interview notification sent:", collegeAuthId.toString());
      } else {
        console.log("❌ Interview recipient offline:", collegeAuthId.toString());
      }
    } catch (err) {
      console.error("Socket emit failed (interview):", err.message);
    }
    
  } catch (error) {
    console.error("Interview notification error:", error.message);
  }
};