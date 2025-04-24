// src/controllers/studentResumeController.js

import StudentProfile from '../models/studentOverviewModel.js';

// Add Resume
export const addStudentResume = async (req, res) => {
  try {
    const { email, resumeUrl } = req.body;

    // Ensure email and resume are provided
    if (!email || !resumeUrl) {
      return res.status(400).json({
        success: false,
        message: 'Email and Resume URL are required',
      });
    }

    // Find profile by email
    const existingProfile = await StudentProfile.findOne({ email });
    if (!existingProfile) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found',
      });
    }

    // If already exists
    if (existingProfile.resumeUrl) {
      return res.status(400).json({
        success: false,
        message: 'Resume already exists. Use update route.',
      });
    }

    existingProfile.resumeUrl = resumeUrl;
    await existingProfile.save();

    res.status(200).json({
      success: true,
      message: 'Resume added successfully',
      data: existingProfile,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

// Update Resume
export const updateStudentResume = async (req, res) => {
  try {
    const { email } = req.params;
    const { resumeUrl } = req.body;

    const updatedProfile = await StudentProfile.findOneAndUpdate(
      { email },
      { resumeUrl },
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Resume updated successfully',
      data: updatedProfile,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};

// Get Resume
export const getStudentResume = async (req, res) => {
  try {
    const { email } = req.params;

    const student = await StudentProfile.findOne({ email }).select('resumeUrl');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Resume retrieved successfully',
      data: student.resumeUrl,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
};
