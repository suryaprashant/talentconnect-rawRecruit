// src/models/studentDashboardProfileModel.js

/*import mongoose from 'mongoose';

const studentDashboardProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  profileImage: {
    type: String, // URL for the image
    required: true,
  },
  profileIcon: {
    type: String, // URL for the icon
    required: true,
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
  resumeUrl: {
    type: String,
  },
  about: {
    type: String,
  },
  mobileNumber: {
    type: String,
  },
  education: {
    degree: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
    collegeName: {
      type: String,
      required: true,
    },
    passingOutYear: {
      type: Number,
      required: true,
    },
    currentCgpa: {
      type: Number,
      required: true,
    },
    degreeCertificate: {
      type: String, // Optional, URL of the certificate
    },
  },
  skills: [
    {
      type: String,
    },
  ],
  interestedIndustry: {
    type: String,
    enum: ['IT Industry'],
    required: true,
  },
  interestedJobRoles: [
    {
      type: String,
      enum: ['Software Engineer', 'Data Analyst'],
    },
  ],
  preferredJobLocations: [
    {
      type: String,
      enum: ['Noida', 'Delhi', 'Gurgaon', 'Bangalore', 'Pune', 'Mumbai', 'Hyderabad'],
    },
  ],
  lookingFor: {
    type: String,
    enum: ['Job', 'Internship', 'Both'],
    required: true,
  },
  employmentType: {
    type: String,
    enum: ['Part Time', 'Full Time', 'Remote', 'Contract'],
  },
  language: {
    type: String,
    enum: ['English'],
    required: true,
  },
  skillExplanation: {
    type: String,
  },
  certificationsUrl: [
    {
      type: String,
    },
  ],
}, { timestamps: true });

const StudentDashboardProfile = mongoose.model('StudentDashboardProfile', studentDashboardProfileSchema);

export default StudentDashboardProfile;*/
