import mongoose from "mongoose";

// applicationSchema
const ApplicationSchema = new mongoose.Schema(
  {
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Onboarding",
      required: true,
    },

    applicantType: {
      type: String,
      required: true,
    },

    appliedForCompany: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CompanyProfile",
      default: null,
      index: true,
    },

    referralCompany: {
      // fixed spelling: refferal → referral
      type: String,
      default: null,
    },

    appliedByType: {
      type: String,
      enum: [
        "employer",
        "company",
        "college",
        "student",
        "fresher",
        "professional",
      ],
      required: true,
    },
    adminApprovalStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
      index: true,
    },

    // applicant: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     refPath: 'applicantType'  // Dynamic reference based on applicantType
    // },
    // applicantType: {
    //     type: String,
    //     required: true,
    //     enum: ['college', 'student', 'company', 'employer']  // Add all possible types
    // },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobPostingTable",
      required: true,
    },
    jobType: {
      type: String,
      required: true,
    },
    isVisited: {
      type: Boolean,
      default: false,
    },
    statusHistory: [
      {
        status: {
          type: String,
          // enum: [
          //     "Applied",
          //     "Application Sent",
          //     "Awaiting Recruiter Action",
          //     "Rejected",
          //     "Shortlisted",
          //     "Interview Scheduled",
          //     "Offer Extended",
          // ],
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    currentStatus: {
      type: String,
      enum: [
        "Saved",
        "Applied",
        "Application Sent",
        "Awaiting Recruiter Action",
        "Shortlisted",
        "Interview Scheduled",
        "Offer Extended",
        "Accepted",
        "Rejected",
        "Referred To Company",
        "Offer Accepted",
        "Offer Rejected",
        "Joined the Company",
      ],
      default: "Applied",
    },
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    adminComment: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true },
);

const Application = mongoose.model("Application", ApplicationSchema);
export default Application;
