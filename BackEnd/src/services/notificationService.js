import Notification from "../models/notificationModel.js";
import Auth from "../models/authModel.js";

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
  jobId
}) => {
  try {
    // ✅ FIXED QUERY
    const colleges = await Auth.find({ userType: "college" }).select("_id");

    console.log("Colleges found for notification:", colleges.length);

    if (!colleges.length) return;

    const notifications = colleges.map(college => ({
      recipientId: college._id,
      senderId: companyId,
      type: "SYSTEM_UPDATE",
      message: `${companyName} posted a ${jobTitle} job`,
      referenceId: jobId,
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
  jobId
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
      message: `${collegeName} posted an on-campus job request`,
      referenceId: jobId,
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