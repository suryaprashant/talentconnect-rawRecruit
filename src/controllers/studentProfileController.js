// src/controllers/studentProfileController.js

import StudentOverview from '../models/studentOverviewModel.js';

// @desc    Add student profile details
// @route   POST /api/student/profile
// @access  Public or Protected (based on usage)
export const addStudentProfile = async (req, res) => {
  try {
    const {
      name,
      email,
      profilePhoto,
      mobileNumber,
      collegeName,
      degree,
      yearOfGraduation,
      cgpa,
      degreeCertificateUrl,
      interestedIndustry,
      interestedJobRoles,
      preferredJobLocations,
      lookingFor,
      employmentType,
      about,
      skills,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
      resumeUrl,
      certificationUrls,
      language,
    } = req.body;

    // Check if profile already exists
    const existingProfile = await StudentOverview.findOne({ email });

    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: 'Profile already exists for this email',
      });
    }

    const newProfile = new StudentOverview({
      name,
      email,
      profilePhoto,
      mobileNumber,
      collegeName,
      degree,
      yearOfGraduation,
      cgpa,
      degreeCertificateUrl,
      interestedIndustry,
      interestedJobRoles,
      preferredJobLocations,
      lookingFor,
      employmentType,
      about,
      skills,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
      resumeUrl,
      certificationUrls,
      language,
    });

    await newProfile.save();

    res.status(201).json({
      success: true,
      message: 'Student profile created successfully',
      data: newProfile,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get student profile by email
// @route   GET /api/student/profile/:email
// @access  Public or Protected
export const getStudentProfileByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const profile = await StudentOverview.findOne({ email });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found',
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update student profile by email
// @route   PUT /api/student/profile/:email
// @access  Protected
export const updateStudentProfileByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const updatedProfile = await StudentOverview.findOneAndUpdate(
      { email },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found to update',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student profile updated successfully',
      data: updatedProfile,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
