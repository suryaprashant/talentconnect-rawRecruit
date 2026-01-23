import mongoose from "mongoose";

const interviewScheduleSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobPostingTable",
      required: true,
    },

    jobType: {
      type: String,
      enum: ["On-campus", "Off-campus", "Pool-campus", "Internship"],
      required: true,
    },

    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },

    companyAuthId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },

    applicantType: {
      type: String,
      enum: ["college", "student", "fresher", "professional", "company"],
      required: true,
    },

    applicantAuthId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
    applicantSnapshot: {
      name: String,
      collegeName: String,
      designation: String,
      profileType: String,
    },


    applicantProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    coordinator: {
      name: String,
      designation: String,
      collegeName: String,
    },
    companySnapshot: {
    companyName: { type: String, required: true },

    scheduledBy: {
      name: { type: String },        // HR / Recruiter name
      email: { type: String },       // Official contact
      designation: { type: String }, // HR / TA / Recruiter
    }
  },


    jobRole: {
      type: [String],
      default: [],
    },

    date: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    meetLink: {
      type: String,
      required: true,
    },

    message: {
      type: String,
    },

    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled"],
      default: "Scheduled",
    },

    emailStatus: {
      type: String,
      enum: ["PENDING", "SENT", "FAILED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export default mongoose.model("InterviewSchedule", interviewScheduleSchema);
