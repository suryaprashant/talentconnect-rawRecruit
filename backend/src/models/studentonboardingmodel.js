import mongoose from "mongoose";

const onboardingSchema = new mongoose.Schema(
  {
    // Resume
    resume: { data: Buffer, contentType: String },

    // Basic Info
    name: String,
    email: { type: String, required: true },
    phone: { type: String, required: true },
    profileType: { type: String, enum: ["Student", "Fresher", "Professional"] },

    // Education
    college: String,
    degree: String,
    semester: String,
    specialization: String,
    cgpa: String,
    yearOfGraduation: String,
    degreeCertificate: { data: Buffer, contentType: String },

    // Job Preferences
    industry: [String],
    jobRole: [String],
    locations: [String],
    expectedSalaryCurrency: String,
    expectedSalaryAmount: String,
    currentSalaryCurrency: String,
    currentSalaryAmount: String,
    lookingFor: { type: String, enum: ["Job", "Internship", "Both"] },
    employmentType: {
      type: String,
      enum: ["part time", "full time", "contract", "freelance"], // use lowercase
    },

    // Internships or Work Experience
    experiences: [
      {
        company: String,
        // role: String,
        startDate: String,
        endDate: String,
        description: String,
        experienceCertificate: { data: Buffer, contentType: String },
      },
    ],

    // Skills and Certifications
    skills: [String],
    certifications: String,

    // Links
    linkedin: String,
    github: String,
    portfolio: String,

    // Project
    project: { data: Buffer, contentType: String },

    // Other
    referralSource: String,
  },
  { timestamps: true }
);

const OnboardingModel = mongoose.model("Onboarding", onboardingSchema);
export default OnboardingModel;
