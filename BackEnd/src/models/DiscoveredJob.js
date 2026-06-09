import mongoose from "mongoose";

const discoveredJobSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
      index: true,
    },

    onboardingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Onboarding",
    },

    companySlug: {
      type: String,
      required: true,
      index: true,
    },

    companyName: {
      type: String,
      required: true,
    },

    companyNormalized: String,

    title: {
      type: String,
      required: true,
    },

    jobUrl: {
      type: String,
      required: true,
    },

    applyUrl: String,
    location: String,
    workMode: String,
    department: String,

    jdSnippet: String,
    description: String,

    requiredSkills: {
      type: [String],
      default: [],
    },

    matchedSkills: {
      type: [String],
      default: [],
    },

    missingSkills: {
      type: [String],
      default: [],
    },

    experienceRequired: String,
    salaryRange: String,
    postedDate: Date,

    jobId: {
      type: String,
      required: true,
    },

    atsSource: {
      type: String,
      enum: ["Greenhouse", "Lever", "Workday", "Custom"],
      required: true,
    },

    matchScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    scoreBreakdown: {
      skills: { type: Number, default: 0 },
      role: { type: Number, default: 0 },
      experience: { type: Number, default: 0 },
      location: { type: Number, default: 0 },
      workMode: { type: Number, default: 0 },
      candidateType: { type: Number, default: 0 },
    },

    alumniCount: {
      type: Number,
      default: 0,
    },

    totalEmployeeCount: {
      type: Number,
      default: 0,
    },

    discoveredAt: {
      type: Date,
      default: Date.now,
    },

    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    referralRequested: {
      type: Boolean,
      default: false,
    },

    referralRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReferralRequest",
    },
  },
  { timestamps: true }
);

discoveredJobSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
discoveredJobSchema.index({ candidateId: 1, companySlug: 1 });
discoveredJobSchema.index({ candidateId: 1, alumniCount: -1, matchScore: -1 });

discoveredJobSchema.index(
  { candidateId: 1, companySlug: 1, jobId: 1, atsSource: 1 },
  { unique: true }
);

export default mongoose.models.DiscoveredJob ||
  mongoose.model("DiscoveredJob", discoveredJobSchema);