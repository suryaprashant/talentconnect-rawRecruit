// src/controllers/professionalOverviewController.js

import ProfessionalOverview from '../models/professionalOverviewModel.js';

// Create Professional Overview
export const createProfessionalOverview = async (req, res) => {
  try {
    const { email, name, college, yearOfGraduation, linkedinUrl, githubUrl, portfolioUrl, resumeUrl, about, mobileNumber, branchOfStudy, profilePicture, currentCgpa, skills, interestedIndustry, interestedJobRoles, jobDetails, preferredJobLocations, currentSalary, expectedSalary, lookingFor, employmentType, language } = req.body;

    // Validate mandatory fields
    if (!email || !name || !college || !yearOfGraduation || !mobileNumber || !branchOfStudy || !currentCgpa) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided',
      });
    }

    // Check if the professional overview already exists for the given email
    const existingProfile = await ProfessionalOverview.findOne({ email });
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: 'Profile already exists for this email',
      });
    }

    const newProfessionalProfile = new ProfessionalOverview({
      email,
      name,
      college,
      yearOfGraduation,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
      resumeUrl,
      about,
      mobileNumber,
      branchOfStudy,
      profilePicture,
      currentCgpa,
      skills,
      interestedIndustry,
      interestedJobRoles,
      jobDetails,
      preferredJobLocations,
      currentSalary,
      expectedSalary,
      lookingFor,
      employmentType,
      language,
    });

    await newProfessionalProfile.save();

    res.status(201).json({
      success: true,
      message: 'Professional profile created successfully',
      data: newProfessionalProfile,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

// Update Professional Overview
export const updateProfessionalOverview = async (req, res) => {
  try {
    const { email } = req.params;
    const updatedData = req.body;

    const updatedProfile = await ProfessionalOverview.findOneAndUpdate({ email }, updatedData, { new: true });

    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        message: 'Professional profile not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Professional profile updated successfully',
      data: updatedProfile,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

// Get Professional Overview by Email
export const getProfessionalOverview = async (req, res) => {
  try {
    const { email } = req.params;

    const profile = await ProfessionalOverview.findOne({ email });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Professional profile not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Professional profile retrieved successfully',
      data: profile,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};
