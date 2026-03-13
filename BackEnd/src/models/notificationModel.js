import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    // The user who receives the notification
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auth',
        required: true,
    },
   
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auth',
        required: true,
    },
    // Type of notification to handle different actions on the frontend
    type: {
        type: String,
        enum: [
    'TEAM_INVITATION',
    'MESSAGE',
    'SYSTEM_UPDATE',
    'FILE_SHARED',
    'EVENT_UPDATE',
    'SERVICE_REQUEST_UPDATE',
    'APPLICATION_SHORTLISTED',
    'APPLICATION_ACCEPTED',
    'APPLICATION_REJECTED',
    'COLLEGE_APPLICATION_SHORTLISTED',
    'COLLEGE_APPLICATION_ACCEPTED',
    'COLLEGE_APPLICATION_REJECTED',
    "JOB_REGISTRATION",
    "INTERVIEW_SCHEDULED",
    "ALTERNATE_DATE_REQUEST",
    "NEW_CHAT_MESSAGE"
  ],
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    // To link directly to the item, e.g., the invitation or a job post
    referenceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
    },
    // Additional data for file sharing notifications
    fileUrl: {
        type: String,
        required: false,
    },
    jobType: {
        type: String,
        enum: ["On-campus", "Off-campus", "Pool-campus", "Internship", "Referral"],
        required: false,
    },

    fileName: {
        type: String,
        required: false,
    },
    eventTitle: {
        type: String,
        required: false,
    },
    // Meeting link for service request approvals
    meetingLink: {
        type: String,
        required: false,
    },
    read: {
        type: Boolean,
        default: false,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobPostingTable",
    },
    
    meta: {
      type: mongoose.Schema.Types.Mixed,
    },

}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;