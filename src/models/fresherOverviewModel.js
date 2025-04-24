// src/models/fresherOverviewModel.js

import mongoose from 'mongoose';

const internshipSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
  },
  jobRole: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const jobDetailsSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
});

const fresherOverviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    college: { type: String, required: true },
    yearOfGraduation: { type: String, required: true },
    linkedin: { type: String },
    github: { type: String },
    portfolio: { type: String },
    resume: { type: String }, // Cloudinary URL
    about: { type: String },
    email: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    branchOfStudy: { type: String, required: true },
    profilePhoto: { type: String, default: '' },
    cgpa: { type: Number },
    degree: { type: String },
    degreeCertificate: { type: String }, // optional URL

    skills: { type: String }, // paragraph format

    interestedIndustry: {
      type: String,
      enum: ['IT Industry'],
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
    expectedSalary: { type: String },
    lookingFor: {
      type: String,
      enum: ['Job', 'Internship', 'Both'],
    },
    employmentType: {
      type: String,
      enum: ['Part time', 'Full time', 'Contract'],
    },
    language: {
      type: String,
      enum: ['English'],
    },

    jobDetails: jobDetailsSchema, // one job
    internshipDetails: [internshipSchema], // multiple internships
    certifications: [String], // List of certification titles/URLs
  },
  { timestamps: true }
);

const FresherOverview = mongoose.model('FresherOverview', fresherOverviewSchema);
export default FresherOverview;
