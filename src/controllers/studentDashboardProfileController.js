/*import StudentDashboardProfile from "../models/studentDashboardProfileModel.js";
import { uploadToCloudinary } from "../utils/upload.js";

// Helper function to handle file uploads to Cloudinary
const uploadFileToCloudinary = async (file, folder) => {
  if (!file) return null;

  console.log(`Uploading to Cloudinary: field=${file.fieldname}, size=${file.size}`);
  
  try {
    const uploadResponse = await uploadToCloudinary(file.buffer, folder);
    return uploadResponse.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Error uploading file to Cloudinary");
  }
};

// CREATE or UPDATE student profile
export const createOrUpdateStudentProfile = async (req, res) => {
  try {
    const userId = req.params.userId;

    console.log("REQ.FILES:", req.files); // Debugging multer fields
    console.log("REQ.BODY:", req.body);   // Debugging text fields

    // Extract files (make sure these fields match the form data from Postman)
    const profileImage = req.files?.profileImage?.[0];
    const profileIcon = req.files?.profileIcon?.[0]; 
    const resume = req.files?.resume?.[0];

    // Upload to Cloudinary
    const profileImageUrl = await uploadFileToCloudinary(profileImage, "student/profileImages");
    const profileIconUrl = await uploadFileToCloudinary(profileIcon, "student/profileIcons");
    const resumeUrl = await uploadFileToCloudinary(resume, "student/resumes");

    // Extract and process text fields
    const {
      name,
      email,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
      about,
      mobileNumber,
      degree,
      branch,
      collegeName,
      passingOutYear,
      currentCgpa,
      degreeCertificate,
      skills = '',
      interestedIndustry,
      interestedJobRoles = '',
      preferredJobLocations = '',
      lookingFor,
      employmentType,
      language,
      skillExplanation,
      certificationsUrl = '',
    } = req.body;

    const formattedSkills = skills ? skills.split(',').map((s) => s.trim()) : [];
    const formattedCerts = certificationsUrl ? certificationsUrl.split(',').map((c) => c.trim()) : [];
    const jobRoles = interestedJobRoles ? interestedJobRoles.split(',').map((r) => r.trim()) : [];
    const jobLocations = preferredJobLocations ? preferredJobLocations.split(',').map((l) => l.trim()) : [];

    // Final student profile object
    const profileData = {
      userId,
      name,
      email,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
      resumeUrl,
      profileImage: profileImageUrl,
      profileIcon: profileIconUrl,
      about,
      mobileNumber,
      education: {
        degree,
        branch,
        collegeName,
        passingOutYear,
        currentCgpa,
        degreeCertificate,
      },
      skills: formattedSkills,
      interestedIndustry,
      interestedJobRoles: jobRoles,
      preferredJobLocations: jobLocations,
      lookingFor,
      employmentType,
      language,
      skillExplanation,
      certificationsUrl: formattedCerts,
    };

    const profile = await StudentDashboardProfile.findOneAndUpdate(
      { userId },
      profileData,
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: "Student profile created/updated successfully",
      data: profile,
    });

  } catch (error) {
    console.error("Profile upload error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};*/
