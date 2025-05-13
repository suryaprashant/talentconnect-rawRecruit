import FresherProfile from '../models/fresherProfileModel.js';
import cloudinary from '../utils/cloudinary.js';

export const createFresherProfile = async (req, res) => {
  try {
    // Logging for debugging
    console.log(req.body);  // Log the form data
    console.log(req.files);  // Log the uploaded files

    // Destructure the data from req.body
    const {
      userId,
      name,
      email,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
      mobileNumber,
      education,
      skills,
      interestedIndustryType,
      interestedJobRoles,
      jobDetails,
      preferredJobLocations,
      expectedSalary,
      lookingFor,
      employmentType,
      languages,
      careerGoals,
      internshipsTrainings,
      skillsDescription,
      websiteUrl,
      certificationsUrl,
    } = req.body;

    // Validate if required fields are present
    if (!userId || !name || !email) {
      return res.status(400).json({ error: "userId, name, and email are required." });
    }

    // Upload files to Cloudinary
    const resumeResult = req.files.resume
      ? await cloudinary.uploader.upload_stream(
          { folder: 'resumes', resource_type: 'auto' },
          (error, result) => {
            if (error) return res.status(500).json({ error: "Failed to upload resume" });
            return result;
          }
        ).end(req.files.resume[0].buffer)
      : null;

    const profileResult = req.files.profileImage
      ? await cloudinary.uploader.upload_stream(
          { folder: 'profileImages' },
          (error, result) => {
            if (error) return res.status(500).json({ error: "Failed to upload profile image" });
            return result;
          }
        ).end(req.files.profileImage[0].buffer)
      : null;

    const bgResult = req.files.backgroundImage
      ? await cloudinary.uploader.upload_stream(
          { folder: 'backgroundImages' },
          (error, result) => {
            if (error) return res.status(500).json({ error: "Failed to upload background image" });
            return result;
          }
        ).end(req.files.backgroundImage[0].buffer)
      : null;

    // Create a new fresher profile object
    const profile = new FresherProfile({
      userId,
      name,
      email,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
      mobileNumber,
      education,  // Assuming education is already an object
      skills,  // Assuming skills is already an array
      interestedIndustryType,
      interestedJobRoles,  // Assuming it's an array
      jobDetails,  // Assuming it's an object
      preferredJobLocations,  // Assuming it's an array
      expectedSalary,
      lookingFor,
      employmentType,
      languages,  // Assuming languages is an array
      careerGoals,
      internshipsTrainings,  // Assuming it's an array of objects
      skillsDescription,
      websiteUrl,
      certificationsUrl,  // Assuming it's an array
      resume: resumeResult?.secure_url,
      profileImage: profileResult?.secure_url,
      backgroundImage: bgResult?.secure_url,
    });

    // Save the fresher profile to the database
    const savedProfile = await profile.save();
    res.status(201).json(savedProfile);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while creating profile.' });
  }
};
export const updateFresherProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const updatedProfile = await FresherProfile.findOneAndUpdate(
      { userId },
      { $set: req.body },
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.status(200).json({ message: "Profile updated", updatedProfile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update profile" });
  }
};
