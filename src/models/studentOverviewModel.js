// src/models/studentOverviewModel.js

import mongoose from 'mongoose';

const studentOverviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    profilePhoto: {
      type: String, // Cloudinary URL
      default: '',
    },
    mobileNumber: {
      type: String,
      required: true,
    },

    // Education Section
    collegeName: {
      type: String,
      required: true,
    },
    degree: {
      type: String,
      required: true,
    },
    yearOfGraduation: {
      type: Number,
      required: true,
    },
    cgpa: {
      type: Number,
      required: true,
    },
    degreeCertificateUrl: {
      type: String, // Optional Cloudinary URL
    },

    // Career Goals
    interestedIndustry: {
      type: String,
      enum: ['IT Industry'],
    },
    interestedJobRoles: [
      {
        type: String,
        enum: ['Software Engineer', 'Data Analyst'], // Add more if needed
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
      enum: ['Internship'],
    },
    employmentType: {
      type: String,
      enum: ['Full-Time', 'Remote'],
    },

    // Other Fields
    about: {
      type: String,
    },
    skills: {
      type: String, // paragraph now
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
      type: String, // Cloudinary resume link
    },

    // Certifications
    certificationUrls: [
      {
        type: String,
      },
    ],

    // Languages
    language: {
      type: String,
      enum: ['English'],
    },
  },
  { timestamps: true }
);

const StudentOverview = mongoose.model('StudentOverview', studentOverviewSchema);

export default StudentOverview;
