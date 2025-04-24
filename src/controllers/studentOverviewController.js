// src/controllers/studentOverviewController.js
import StudentOverview from '../models/studentOverviewModel.js';
import { uploadToCloudinary } from '../utils/upload.js';

export const createStudentOverview = async (req, res) => {
  try {
    const {
      name,
      email,
      mobileNumber,
      collegeName,
      batch,
      branchOfStudy,
      cgpa,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
      about,
      skills,
      interestedIndustry,
      interestedJobRoles,
      preferredJobLocations,
      lookingFor,
      employmentType,
      language,
    } = req.body;

    // Debug log
    console.log('Incoming Data:', req.body);

    // Upload profile photo
    let profilePhotoUrl = '';
    if (req.files?.profilePhoto?.[0]) {
      const result = await uploadToCloudinary(req.files.profilePhoto[0], 'profilePhotos');
      profilePhotoUrl = result.secure_url;
    }

    // Upload resume
    let resumeUrl = '';
    if (req.files?.resume?.[0]) {
      const result = await uploadToCloudinary(req.files.resume[0], 'resumes');
      resumeUrl = result.secure_url;
    }

    // Create StudentOverview instance
    const student = new StudentOverview({
      name,
      email,
      profilePhoto: profilePhotoUrl,
      mobileNumber,
      collegeName,
      batch,
      branchOfStudy,
      cgpa,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
      resumeUrl,
      about,
      skills: skills?.split(',').map(skill => skill.trim()) || [],
      interestedIndustry,
      interestedJobRoles: parseJsonArray(interestedJobRoles),
      preferredJobLocations: parseJsonArray(preferredJobLocations),
      lookingFor,
      employmentType,
      language,
    });

    await student.save();

    res.status(201).json({
      success: true,
      message: 'Student overview created successfully',
      data: student,
    });
  } catch (error) {
    console.error('Error creating student overview:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating student overview',
      error: error.message,
    });
  }
};

// Helper to parse JSON arrays (from form-data strings)
const parseJsonArray = (value) => {
  try {
    return typeof value === 'string' ? JSON.parse(value) : value || [];
  } catch (e) {
    return [];
  }
};

export const getStudentOverviewByEmail = async (req, res) => {
  try {
    const student = await StudentOverview.findOne({ email: req.params.email });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    console.error('Error fetching student by email:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
export const updateStudentOverviewByEmail = async (req, res) => {
  try {
    const email = req.params.email;

    let profilePhotoUrl;
    let resumeUrl;

    if (req.files?.profilePhoto?.[0]) {
      const result = await uploadToCloudinary(req.files.profilePhoto[0], 'profilePhotos');
      profilePhotoUrl = result.secure_url;
    }

    if (req.files?.resume?.[0]) {
      const result = await uploadToCloudinary(req.files.resume[0], 'resumes');
      resumeUrl = result.secure_url;
    }

    const updatedData = {
      ...req.body,
      skills: req.body.skills?.split(',').map(skill => skill.trim()) || [],
      interestedJobRoles: req.body.interestedRoles,
      preferredJobLocations: req.body.preferredLocations,
    };

    if (profilePhotoUrl) updatedData.profilePhoto = profilePhotoUrl;
    if (resumeUrl) updatedData.resumeUrl = resumeUrl;

    const student = await StudentOverview.findOneAndUpdate(
      { email },
      updatedData,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Student overview updated successfully',
      data: student,
    });
  } catch (error) {
    console.error('Error updating student overview by email:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

