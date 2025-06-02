import StudentProfile from '../models/StudentProfile.js';
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

// Helper function to upload buffer to Cloudinary
const streamUpload = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto', folder },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

/**
 * @desc Create a new student profile
 * @route POST /api/student-profiles
 * @access Public (or private with auth middleware)
 */
export const createStudentProfile = async (req, res) => {
  try {
    // req.body.data will be a JSON string from the frontend's FormData
    const parsedData = JSON.parse(req.body.data);

    const {
      about,
      educationalBackground,
      careerGoals,
      skills,
      socialProfiles,
      certificationsUrls,
      workExperiences,
      fullName,
      email,
      phoneNumber,
      location,
    } = parsedData;

    // Prepare file upload promises
    const uploads = {};

    // Check for files and upload them
    if (req.files && req.files['profileImage']) {
      const profileImageRes = await streamUpload(req.files['profileImage'][0].buffer, 'rawrecruit/profileImages');
      uploads.profileImageUrl = profileImageRes.secure_url;
    }

    if (req.files && req.files['backgroundImage']) {
      const backgroundImageRes = await streamUpload(req.files['backgroundImage'][0].buffer, 'rawrecruit/backgroundImages');
      uploads.backgroundImageUrl = backgroundImageRes.secure_url;
    }

    if (req.files && req.files['resume']) {
      const resumeRes = await streamUpload(req.files['resume'][0].buffer, 'rawrecruit/resumes');
      uploads.resumeUrl = resumeRes.secure_url;
    }

    if (req.files && req.files['degreeCertificate']) {
      const degreeCertRes = await streamUpload(req.files['degreeCertificate'][0].buffer, 'rawrecruit/degreeCertificates');
      uploads.degreeCertificateUrl = degreeCertRes.secure_url;
    }

    // Merge educationalBackground with degreeCertificateUrl if uploaded
    const finalEducationalBackground = {
      ...educationalBackground,
      degreeCertificateUrl: uploads.degreeCertificateUrl || (educationalBackground ? educationalBackground.degreeCertificateUrl : ''),
    };

    const profile = new StudentProfile({
      fullName,
      email,
      phoneNumber,
      location,
      about,
      educationalBackground: finalEducationalBackground,
      careerGoals,
      skills,
      socialProfiles,
      certificationsUrls,
      workExperiences,
      profileImageUrl: uploads.profileImageUrl || '',
      backgroundImageUrl: uploads.backgroundImageUrl || '',
      resumeUrl: uploads.resumeUrl || '',
      // If you have user authentication, you'd add userId: req.user.id here
    });

    await profile.save();

    res.status(201).json({ message: 'Student profile created successfully', profile });
  } catch (error) {
    console.error('Error in createStudentProfile:', error);
    res.status(500).json({ message: 'Failed to create student profile', error: error.message });
  }
};

/**
 * @desc Get a student profile
 * @route GET /api/student-profiles/:id or /api/student-profiles/me
 * @access Public (or private with auth middleware)
 *
 * This function can fetch by a specific ID or, if no ID is provided (e.g., /me endpoint),
 * it attempts to fetch the first profile found. In a real application, '/me' would
 * typically use `req.user.id` from an authentication middleware.
 */
export const getStudentProfile = async (req, res) => {
  try {
    let profile;
    const profileId = req.params.id; // Check for ID in URL params

    if (profileId === 'me') {
      // In a real app, replace this with fetching by authenticated user's ID:
      // profile = await StudentProfile.findOne({ userId: req.user.id });
      // For demonstration, fetch the first one found or handle as "no profile yet"
      profile = await StudentProfile.findOne({}); // Fetches the first profile
    } else if (profileId) {
      profile = await StudentProfile.findById(profileId);
    } else {
      // No specific ID and not "me" - perhaps return a 400 or default to trying to find one
      return res.status(400).json({ message: 'Invalid profile ID or no ID provided.' });
    }

    if (!profile) {
      // Return 404 if no profile found, allows frontend to create new
      return res.status(404).json({ message: 'Student profile not found' });
    }

    res.status(200).json({ profile });
  } catch (error) {
    console.error('Error in getStudentProfile:', error);
    res.status(500).json({ message: 'Failed to fetch student profile', error: error.message });
  }
};

/**
 * @desc Update an existing student profile
 * @route PUT /api/student-profiles/:id
 * @access Private (requires auth middleware)
 */
export const updateStudentProfile = async (req, res) => {
  try {
    const profileId = req.params.id; // Get profile ID from URL parameters
    const parsedData = JSON.parse(req.body.data);

    const {
      about,
      educationalBackground,
      careerGoals,
      skills,
      socialProfiles,
      certificationsUrls,
      workExperiences,
      fullName,
      email,
      phoneNumber,
      location,
    } = parsedData;

    let profile = await StudentProfile.findById(profileId);

    if (!profile) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    // Update existing profile fields, only if new values are provided
    profile.fullName = fullName !== undefined ? fullName : profile.fullName;
    profile.email = email !== undefined ? email : profile.email;
    profile.phoneNumber = phoneNumber !== undefined ? phoneNumber : profile.phoneNumber;
    profile.location = location !== undefined ? location : profile.location;
    profile.about = about !== undefined ? about : profile.about;

    // Deep merge for nested objects/arrays to avoid overwriting completely
    if (educationalBackground) {
        profile.educationalBackground.degree = educationalBackground.degree !== undefined ? educationalBackground.degree : profile.educationalBackground.degree;
        profile.educationalBackground.institution = educationalBackground.institution !== undefined ? educationalBackground.institution : profile.educationalBackground.institution;
        profile.educationalBackground.graduationYear = educationalBackground.graduationYear !== undefined ? educationalBackground.graduationYear : profile.educationalBackground.graduationYear;
        // degreeCertificateUrl is handled by file upload logic below
    }

    if (careerGoals) {
        profile.careerGoals.interestedIndustryType = careerGoals.interestedIndustryType !== undefined ? careerGoals.interestedIndustryType : profile.careerGoals.interestedIndustryType;
        profile.careerGoals.interestedJobRoles = careerGoals.interestedJobRoles !== undefined ? careerGoals.interestedJobRoles : profile.careerGoals.interestedJobRoles;
        profile.careerGoals.preferredJobLocations = careerGoals.preferredJobLocations !== undefined ? careerGoals.preferredJobLocations : profile.careerGoals.preferredJobLocations;
        profile.careerGoals.lookingFor = careerGoals.lookingFor !== undefined ? careerGoals.lookingFor : profile.careerGoals.lookingFor;
        profile.careerGoals.employmentType = careerGoals.employmentType !== undefined ? careerGoals.employmentType : profile.careerGoals.employmentType;
    }

    if (skills) {
        profile.skills = skills; // Directly assign updated array
    }

    if (socialProfiles) {
        profile.socialProfiles.linkedin = socialProfiles.linkedin !== undefined ? socialProfiles.linkedin : profile.socialProfiles.linkedin;
        profile.socialProfiles.github = socialProfiles.github !== undefined ? socialProfiles.github : profile.socialProfiles.github;
        profile.socialProfiles.website = socialProfiles.website !== undefined ? socialProfiles.website : profile.socialProfiles.website;
    }

    if (certificationsUrls) {
        profile.certificationsUrls = certificationsUrls; // Directly assign updated array
    }

    if (workExperiences) {
        profile.workExperiences = workExperiences; // Directly assign updated array
    }


    // Handle file uploads for updates
    if (req.files && req.files['profileImage']) {
      const profileImageRes = await streamUpload(req.files['profileImage'][0].buffer, 'rawrecruit/profileImages');
      profile.profileImageUrl = profileImageRes.secure_url;
    }
    if (req.files && req.files['backgroundImage']) {
      const backgroundImageRes = await streamUpload(req.files['backgroundImage'][0].buffer, 'rawrecruit/backgroundImages');
      profile.backgroundImageUrl = backgroundImageRes.secure_url;
    }
    if (req.files && req.files['resume']) {
      const resumeRes = await streamUpload(req.files['resume'][0].buffer, 'rawrecruit/resumes');
      profile.resumeUrl = resumeRes.secure_url;
    }
    if (req.files && req.files['degreeCertificate']) {
      const degreeCertRes = await streamUpload(req.files['degreeCertificate'][0].buffer, 'rawrecruit/degreeCertificates');
      profile.educationalBackground.degreeCertificateUrl = degreeCertRes.secure_url;
    }

    await profile.save();

    res.status(200).json({ message: 'Student profile updated successfully', profile });
  } catch (error) {
    console.error('Error in updateStudentProfile:', error);
    res.status(500).json({ message: 'Failed to update student profile', error: error.message });
  }
};