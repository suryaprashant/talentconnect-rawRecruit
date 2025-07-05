// import mongoose from "mongoose";

// const onboardingSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Auth", // This links to your 'Auth' model
//       required: true,
//       unique: true, // Ensures one onboarding profile per user
//     },

//     // Resume
//     resume: { data: Buffer, contentType: String },

//     // Basic Info
//     name: String,
//     email: { type: String, required: true },
//     phone: { type: String, required: true },
//     profileType: {
//       type: String,
//       enum: ["student", "fresher", "professional"],
//       required: true,
//     },


//     // Education
//     college: String,
//     degree: String,
//     semester: String,
//     specialization: String,
//     cgpa: String,
//     yearOfGraduation: String,
//     degreeCertificate: { data: Buffer, contentType: String },

//     // Job Preferences
//     industry: [String],
//     jobRoles: [String], // Changed from jobRole to jobRoles for consistency with controller
//     locations: [String],
//     expectedSalaryCurrency: String,
//     expectedSalaryAmount: String,
//     currentSalaryCurrency: String,
//     currentSalaryAmount: String,
//     lookingFor: { type: String, enum: ["Job", "Internship", "Both"] },
//     employmentType: {
//       type: String,
//       enum: ["part time", "full time", "contract"], // <-- Note the SPACE in "full time"
//     },

//     // Internships or Work Experience
//     experiences: [
//       {
//         company: String,
//         role: String, // Added 'role' as it's common in experience and not explicitly in your schema
//         startDate: String,
//         endDate: String,
//         description: String,
//         experienceCertificate: { data: Buffer, contentType: String },
//       },
//     ],

//     // Skills and Certifications
//     skills: [String],
//     certifications: String,

//     // Links
//     linkedin: String,
//     github: String,
//     portfolio: String,
//     backgroundImageUrl: { type: String },
//     profileImageUrl: {type : String},
//     // Project
//     project: { data: Buffer, contentType: String },

//     // Other
//     referralSource: String,
//   },
//   { timestamps: true }
// );

// const OnboardingModel = mongoose.model("Onboarding", onboardingSchema);
// export default OnboardingModel;



// Path: models/studentonboardingmodel.js



import mongoose from "mongoose";

const onboardingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth", // This links to your 'Auth' model
      required: true,
      unique: true, // Ensures one onboarding profile per user
    },

    // Resume (now stores Cloudinary URL)
    resume: String,

    // Basic Info
    name: String,
    email: { type: String, required: true },
    phone: { type: String, required: true },
    profileType: {
      type: String,
      enum: ["student", "fresher", "professional"],
      required: true,
    },

    // Education
    college: String,
    degree: String,
    semester: String,
    specialization: String,
    cgpa: String,
    yearOfGraduation: String,
    degreeCertificate: String, // Now stores Cloudinary URL

    // Job Preferences
    industry: [String],
    jobRoles: [String], // Changed from jobRole to jobRoles for consistency with controller
    locations: [String],
    expectedSalaryCurrency: String,
    expectedSalaryAmount: String,
    currentSalaryCurrency: String,
    currentSalaryAmount: String,
    lookingFor: { type: String, enum: ["Job", "Internship", "Both"] },
    employmentType: {
      type: String,
      enum: ["part time", "full time", "contract"], // <-- Note the SPACE in "full time"
    },

    // Internships or Work Experience
    experiences: [
      {
        company: String,
        role: String, // Added 'role' as it's common in experience and not explicitly in your schema
        startDate: String,
        endDate: String,
        description: String,
        experienceCertificate: String, // Now stores Cloudinary URL
      },
    ],

    // Skills and Certifications
    skills: [String],
    certifications: String,

    // Links
    linkedin: String,
    github: String,
    portfolio: String,

    // Profile Images (now store Cloudinary URLs)
    backgroundImage: String,
    profileImage: String,

    // Project (now stores Cloudinary URL)
    project: String,

    // Other
    referralSource: String,
  },
  { timestamps: true }
);

const OnboardingModel = mongoose.model("Onboarding", onboardingSchema);
export default OnboardingModel;