import mongoose from "mongoose";
import { STATUS_ENUM } from "../data/status.js";

const statusSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: STATUS_ENUM,
    default: null,
  },

  since: {
    type: Date,
    default: null,
  },

  note: {
    type: String,
    maxlength: 500,
    default: "",
  },

  expectedReturn: {
    type: Date,
    default: null,
  },
},
{
    _id:false
});

const educationSchema = new mongoose.Schema({
  college: String,
  college_canonical_id: String,

  college_display: String,

  college_master_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CollegeMaster",
  },
  degree: String,
  specialization: String,
  semester: String,
  cgpa: String,
  yearOfGraduation: String,
  degreeCertificate: String,

  startDate: String,
  endDate: String,

  educationType: {
    type: String,
    enum: [
      "school",
      "diploma",
      "bachelors",
      "masters",
      "phd",
      "certification",
      "other",
    ],
    default: "bachelors",
  },

  isCurrent: {
    type: Boolean,
    default: false,
  },
});

const leadershipSchema = new mongoose.Schema({
  organization: String,
  role: String,
  startDate: String,
  endDate: String,
  description: String,
  certificate: String,
});
const internationalExperienceSchema = new mongoose.Schema({
  country: String,
  organization: String,
  role: String,
  startDate: String,
  endDate: String,
  description: String,
  certificate: String,
});

const awardSchema = new mongoose.Schema({
  title: String,
  organization: String,
  startDate: String,
  endDate: String,
  description: String,
});

const publicationSchema = new mongoose.Schema({
  title: String,
  url: String,
});

const achievementSchema = new mongoose.Schema({
  title: String,
  event: String,
  date: String,
});

const projectsHandledSchema = new mongoose.Schema({
  numberOfProjects: Number,
  budget: String,
  impact: String,
});

const studentOnboardingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
      unique: true,
    },
    resume: String,
    name: String,
    email: { type: String, required: true },
    phone: { type: String, required: false },
    profileType: {
      type: String,
      enum: ["student", "fresher", "professional"],
      required: true,
    },

    // Education
    // college: String,
    // degree: String,
    // semester: String,
    // specialization: String,
    // cgpa: String,
    // yearOfGraduation: String,
    // degreeCertificate: String,

    educations: [educationSchema],

    industry: [String],
    jobRoles: [String],
    locations: [String],
    expectedSalaryCurrency: String,
    expectedSalaryAmount: String,
    currentSalaryCurrency: String,
    currentSalaryAmount: String,
    lookingFor: {
      type: [String],
      enum: ["Job", "Internship", "Job,Internship", "Both"],
      default: "Job,Internship",
    },

    employmentType: {
      type: [String],
      enum: ["part time", "full time", "contract"],
    },

    experiences: [
      {
        company: String,
        company_canonical_id: String,

        company_display: String,

        company_master_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "CompanyMaster",
        },

        role: String,
        startDate: String,
        endDate: String,
        description: String,
        experienceCertificate: String,
        isCurrent: { type: Boolean, default: false },
      },
    ],

    leadership: [leadershipSchema],

    internationalExperience: [internationalExperienceSchema],

    awards: [awardSchema],

    publications: [publicationSchema],
    achievements: [achievementSchema],
    projectsHandled: projectsHandledSchema,

    skills: [String],
    categorizedSkills: {
      highInDemand: { type: [String], default: [] },
      growing: { type: [String], default: [] },
      saturated: { type: [String], default: [] },
      obsolete: { type: [String], default: [] },
    },
    languagesKnown: [String],
    toolsAndPlatforms: [String],
    domainKnowledge: [String],

    dob: String,
    gender: String,
    ethnicity: String,
    maritalStatus: String,
    visaStatus: String,
    openToShift: String,
    clientLocation: String,

    about: String,

    currentCompany: String,
    currentCompany_canonical_id: String,

    currentCompany_display: String,

    currentCompany_master_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CompanyMaster",
    },
    status: statusSchema,
    noticePeriod: String,
    servingNoticePeriod: Boolean,
    noticePeriodStartDate: String,
    totalYearsOfExperience: String,

    companyEmail: {
      type: String,
      default: "",
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    totalCandidatesReferred: {
      type: Number,
      default: 0,
    },

    referralMilestonesAchieved: {
      type: [Number],
      default: [],
    },
    certifications: String,
    linkedin: String,
    github: String,
    portfolio: String,
    backgroundImage: String,
    profileImage: String,
    project: String,
    referralSource: String,
  },
  { timestamps: true },
);

export default mongoose.models.Onboarding ||
  mongoose.model("Onboarding", studentOnboardingSchema);
