import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  company: String,
  jobRole: String,
  startDate: Date,
  endDate: Date,
  description: String,
  certificateUrl: { type: String, default: '' },
});

const awardSchema = new mongoose.Schema({
  company: String,
  jobRole: String,
  startDate: Date,
  endDate: Date,
  description: String,
  certificateUrl: { type: String, default: '' },
});

const professionalProfileSchema = new mongoose.Schema({
  // Basic Details
  name: String,
  profilePhoto: { type: String, default: '' },
  email: { type: String, unique: true },
  mobileNumber: String,
  college: String,
  degree: String,
  graduationYear: Number,
  currentCGPA: String,
  degreeCertificateUrl: { type: String, default: '' },
  about: String,

  // Resume
  resumeUrl: { type: String, default: '' },

  // Career Goals
  interestedIndustry: [String],
  interestedJobRoles: [String],
  preferredJobLocations: [String],
  currentSalary: String,
  expectedSalary: String,
  employmentType: String,
  lookingFor: String,
  languages: [String],

  // Experience
  workExperience: [experienceSchema],
  internationalExperience: [experienceSchema],
  awardsAndRecognitions: [awardSchema],

  // Skills & Certifications
  skills: String,
  certifications: [String],

  // Socials
  socialProfiles: {
    linkedin: String,
    github: String,
    portfolio: String,
  },
}, { timestamps: true });

const ProfessionalProfile = mongoose.model('ProfessionalProfile', professionalProfileSchema);

export default ProfessionalProfile;
