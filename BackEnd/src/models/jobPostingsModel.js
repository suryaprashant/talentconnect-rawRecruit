import mongoose from "mongoose";

const jobPostingSchema = new mongoose.Schema(
  {
    companyPosted: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CompanyProfile",
    },
    candidatePosted: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Onboarding",
    },
    collegePosted: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CollegeOnboarding",
    },

    postedByUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      // required: true // Make it required for new postings
      index: true,
    },

    jobType: {
      type: String,
      required: true,
      enum: [
        "Off-campus",
        "On-campus",
        "Pool-campus",
        "Job-listing",
        "Internship",
        "Referral",
      ],
    },
    approvalStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
      index: true,
    },
    visibleTo: {
      type: String,
      enum: ["All", "College", "Company"],
      default: "All",
    },
    broadcastType: {
      type: String,
      enum: ["Everyone", "Location"],
      default: "Everyone",
    },
    state: { type: String },
    city: { type: String },
    country: { type: String },
    pincode: { type: String },
    degree: [String],
    location: { type: [String], required: true },

    collegeTypes: [{ type: String }],
    jobTitle: { type: [String] },
    jobCategory: { type: String },
    venue: { type: String },
    jobStatus: {
      type: String,
      enum: ["Open", "Closed", "Pending"],
      default: "Pending",
    },
    lookingFor: {
      type: String,
      enum: ["Job", "Internship", "Both"],
    },
    employmentType: {
      type: [String],
      enum: ["Part-time", "Full-time", "Contract"],
    },
    workMode: {
      type: [String],
      enum: ["Hybrid", "On-site", "Remote"],
    },
    description: { type: String },
    jobRoles: [{ type: String }],
    packageDetails: {
      currency: { type: String, default: "INR" },
      totalCTC: { type: Number },
      fixedPay: { type: Number },
      joiningBonus: { type: Number },
    },
    collegeCategories: [{ type: String }], // For "tier1", "tier2", etc.
    companyType: [
      {
        type: String,
        // enum: ["MNC", "Startup", "SME", "Public Sector"]
      },
    ],
    companyHiringPreference: {
      preferredMode: {
        type: String,
        enum: [
          "Online",
          "Offline",
          "Hybrid",
          "Online Aptitude and Physical Interview",
        ],
      },
    },
    onlineTestDate: {
      type: Date,
    },
    interviewWindow: {
      start: { type: Date },
      end: { type: Date },
    },
    offerRolloutDate: {
      type: Date,
    },
    proposedSchedule: {
      startDate: { type: Date },
      endDate: { type: Date },
      preferredMode: {
        type: String,
        enum: ["Online", "Offline", "Hybrid"],
      },
    },
    // collegeProctoredTest: {
    //     type: Boolean,
    //     default: false
    // },
    studentStreams: [{ type: String }],

    startDate: { type: Date },
    endDate: { type: Date },
    rounds: [{ type: String }],
    selectionProcess: [{ type: String }],
    numberOfOpenings: { type: Number },
    numberOfStudent: [{ type: String }],
    noOfplacedStudents: { type: String },
    contactPerson: {
      name: { type: String },
      designation: { type: String },
      email: { type: String },
      mobile: { type: String },
      linkedin: { type: String },
    },
    minEducation: {
      type: String,
    },

    yearsOfExperience: {
      type: String,
    },

    minYearofExperience: {
      type: String,
    },

    skills: [{ type: String }],
    certifications: [{ type: String }],
    workAuthorization: {
      type: String,
    },
    workAchievements: [{ type: String }],
    minimumStudents: { type: String },

    internshipDuration: { type: String },
    cgpa: {
      type: Number,
      default: 0.0,
    },

    // Tools and Platforms (Stored as a Vector/Array of Strings)
    toolsAndPlatforms: [
      {
        type: String,
      },
    ],
    eligibilityCriteria: {
      type: String,
    },
    amenitiesRequired: [
      {
        type: String,
      },
    ],
    benefits: [
      {
        type: String,
      },
    ],
    tags: [{ type: String }],
    views: { type: Number, default: 0 },

    //expire at
    expireAt: {
      type: Date,
      // default: null
      expires: 0,
    },
    workLocation: [
      {
        type: String,
      },
    ],
    isAskForReferral: {
      type: Boolean,
      default: false,
    },
    referralRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CareerPageReferralRequest",
      default: null,
      index: true,
    },
    inactive: {
      type: Boolean,
      default: false,
    },
    batchYear: [{ type: String }],
  },
  { timestamps: true },
);

// Ensure virtuals are included when converting to JSON
jobPostingSchema.set("toJSON", { virtuals: true });
jobPostingSchema.set("toObject", { virtuals: true });

export const JobPostingTable =
  mongoose.models.JobPostingTable ||
  mongoose.model("JobPostingTable", jobPostingSchema);
