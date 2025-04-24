// src/controllers/fresherProfileController.js

import FresherOverview from '../models/fresherOverviewModel.js';

// Create a new Fresher Profile
export const createFresherProfile = async (req, res) => {
  try {
    const {
      name,
      college,
      yearOfGraduation,
      linkedin,
      github,
      portfolio,
      resume,
      about,
      mobileNumber,
      branchOfStudy,
      profilePhoto,
      cgpa,
      degree,
      degreeCertificate,
      skills,
      interestedIndustry,
      interestedJobRoles,
      preferredJobLocations,
      expectedSalary,
      lookingFor,
      employmentType,
      language,
      jobDetails,
      internshipDetails,
      certifications,
    } = req.body;

    // Check if fresher with the same email already exists
    const existingFresher = await FresherOverview.findOne({ email: req.body.email });

    if (existingFresher) {
      return res.status(400).json({
        success: false,
        message: 'Fresher profile already exists!',
      });
    }

    // Create a new fresher profile
    const fresher = new FresherOverview({
      name,
      college,
      yearOfGraduation,
      linkedin,
      github,
      portfolio,
      resume,
      about,
      mobileNumber,
      branchOfStudy,
      profilePhoto,
      cgpa,
      degree,
      degreeCertificate,
      skills,
      interestedIndustry,
      interestedJobRoles,
      preferredJobLocations,
      expectedSalary,
      lookingFor,
      employmentType,
      language,
      jobDetails,
      internshipDetails,
      certifications,
    });

    // Save the new fresher profile to the database
    const newFresher = await fresher.save();

    res.status(201).json({
      success: true,
      message: 'Fresher profile created successfully!',
      data: newFresher,
    });
  } catch (error) {
    console.error('Error creating fresher profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

// Get Fresher Profile by Email
export const getFresherProfileByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    
    // Find fresher by email
    const fresher = await FresherOverview.findOne({ email });
    
    if (!fresher) {
      return res.status(404).json({
        success: false,
        message: 'Fresher profile not found!',
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Fresher profile fetched successfully',
      data: fresher,
    });
  } catch (error) {
    console.error('Error fetching fresher profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

// Update Fresher Profile
export const updateFresherProfile = async (req, res) => {
  try {
    const { email } = req.params;
    const {
      name,
      college,
      yearOfGraduation,
      linkedin,
      github,
      portfolio,
      resume,
      about,
      mobileNumber,
      branchOfStudy,
      profilePhoto,
      cgpa,
      degree,
      degreeCertificate,
      skills,
      interestedIndustry,
      interestedJobRoles,
      preferredJobLocations,
      expectedSalary,
      lookingFor,
      employmentType,
      language,
      jobDetails,
      internshipDetails,
      certifications,
    } = req.body;

    // Find fresher by email
    const fresher = await FresherOverview.findOne({ email });

    if (!fresher) {
      return res.status(404).json({
        success: false,
        message: 'Fresher profile not found!',
      });
    }

    // Update fresher profile fields
    fresher.name = name || fresher.name;
    fresher.college = college || fresher.college;
    fresher.yearOfGraduation = yearOfGraduation || fresher.yearOfGraduation;
    fresher.linkedin = linkedin || fresher.linkedin;
    fresher.github = github || fresher.github;
    fresher.portfolio = portfolio || fresher.portfolio;
    fresher.resume = resume || fresher.resume;
    fresher.about = about || fresher.about;
    fresher.mobileNumber = mobileNumber || fresher.mobileNumber;
    fresher.branchOfStudy = branchOfStudy || fresher.branchOfStudy;
    fresher.profilePhoto = profilePhoto || fresher.profilePhoto;
    fresher.cgpa = cgpa || fresher.cgpa;
    fresher.degree = degree || fresher.degree;
    fresher.degreeCertificate = degreeCertificate || fresher.degreeCertificate;
    fresher.skills = skills || fresher.skills;
    fresher.interestedIndustry = interestedIndustry || fresher.interestedIndustry;
    fresher.interestedJobRoles = interestedJobRoles || fresher.interestedJobRoles;
    fresher.preferredJobLocations = preferredJobLocations || fresher.preferredJobLocations;
    fresher.expectedSalary = expectedSalary || fresher.expectedSalary;
    fresher.lookingFor = lookingFor || fresher.lookingFor;
    fresher.employmentType = employmentType || fresher.employmentType;
    fresher.language = language || fresher.language;
    fresher.jobDetails = jobDetails || fresher.jobDetails;
    fresher.internshipDetails = internshipDetails || fresher.internshipDetails;
    fresher.certifications = certifications || fresher.certifications;

    // Save updated fresher profile
    const updatedFresher = await fresher.save();

    res.status(200).json({
      success: true,
      message: 'Fresher profile updated successfully!',
      data: updatedFresher,
    });
  } catch (error) {
    console.error('Error updating fresher profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};
