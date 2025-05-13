// models/fresherProfileModel.js
import mongoose from 'mongoose';

const fresherProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  backgroundImage: {
    type: String,
  },
  profileImage: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  linkedinUrl: {
    type: String,
  },
  githubUrl: {
    type: String,
  },
  portfolioUrl: {
    type: String,
  },
  resume: {
    type: String, // Cloudinary URL
  },
  mobileNumber: {
    type: String,
  },
  education: {
    degree: String,
    collegeName: String,
    passingOutYear: String,
    currentCgpa: String,
    degreeCertificate: {
      type: String, // Optional
    },
  },
  skills: [String], // Array of skills
  interestedIndustryType: {
    type: String,
    default: 'IT Industry',
  },
  interestedJobRoles: [String],
  jobDetails: {
    jobTitle: String,
    location: String,
    startingDate: Date,
    description: String,
  },
  preferredJobLocations: [String], // Array of preferred job locations
  expectedSalary: String,
  lookingFor: {
    type: String,
    enum: ['job', 'internship', 'both'],
  },
  employmentType: {
    type: String,
    enum: ['full-time', 'remote', 'part-time', 'contract'],
  },
  languages: [String],
  careerGoals: String,
  internshipsTrainings: [
    {
      company: String,
      jobRole: String,
      startDate: Date,
      endDate: Date,
      description: String,
    },
  ],
  skillsDescription: String,
  websiteUrl: String,
  certificationsUrl: [String], // Array of certification URLs
});

const FresherProfile = mongoose.model('FresherProfile', fresherProfileSchema);
export default FresherProfile;
