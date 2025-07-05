// import OnboardingModel from "../models/studentonboardingmodel.js";
// import Auth from "../models/auth.js"; // Import the Auth model
// import cloudinary from "../../config/cloudinary.js"; // Assuming cloudinary config is here
// import streamifier from "streamifier";

// // Utility for streaming upload
// const streamUpload = (buffer, folder) => {
//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       { resource_type: "auto", folder: `rawrecruit/${folder}` },
//       (error, result) => {
//         if (result) resolve(result);
//         else reject(error);
//       }
//     );
//     streamifier.createReadStream(buffer).pipe(stream);
//   });
// };

// export const getAllOnboardingForms = async (req, res) => {
//   try {
//     const forms = await OnboardingModel.find({});
//     res.status(200).json({
//       message: "Successfully fetched all onboarding forms.",
//       data: forms,
//     });
//   } catch (error) {
//     console.error("Error fetching all onboarding forms:", error);
//     res.status(500).json({
//       message: "Internal server error while fetching forms.",
//       error: error.message,
//     });
//   }
// };

// export const submitOnboardingForm = async (req, res) => {
//   try {
//     if (!req.user || !req.user._id) {
//       return res
//         .status(401)
//         .json({ error: "Unauthorized: User not authenticated." });
//     }

//     const {
//       name,
//       email,
//       phone,
//       profileType,
//       college,
//       degree,
//       semester,
//       specialization,
//       cgpa,
//       yearOfGraduation,
//       industry,
//       jobRoles,
//       locations,
//       expectedSalaryCurrency,
//       expectedSalaryAmount,
//       currentSalaryCurrency,
//       currentSalaryAmount,
//       lookingFor,
//       employmentType,
//       skills,
//       certifications,
//       linkedin,
//       github,
//       portfolio,
//       referralSource,
//       experiences,
//     } = req.body;

//     const newEntry = new OnboardingModel({
//       userId: req.user._id,
//       name,
//       email,
//       phone,
//       profileType: profileType,
//       college,
//       degree,
//       semester,
//       specialization,
//       cgpa,
//       yearOfGraduation,
//       industry: industry ? industry.split(",") : [],
//       jobRoles: jobRoles ? jobRoles.split(",") : [],
//       locations: locations ? locations.split(",") : [],
//       expectedSalaryCurrency,
//       expectedSalaryAmount,
//       currentSalaryCurrency,
//       currentSalaryAmount,
//       lookingFor,
//       employmentType,
//       skills: skills ? skills.split(",") : [],
//       certifications,
//       linkedin,
//       github,
//       portfolio,
//       referralSource,
//       experiences: experiences ? JSON.parse(experiences) : [],
//     });

//     const files = req.files;
//     const uploads = {};

//     // Upload resume
//     if (files?.resume?.[0]) {
//       uploads.resumeUrl = (
//         await streamUpload(files.resume[0].buffer, "resumes")
//       ).secure_url;
//       newEntry.resume = uploads.resumeUrl;
//     }

//     // Upload degree certificate
//     if (files?.degreeCertificate?.[0]) {
//       uploads.degreeCertificateUrl = (
//         await streamUpload(files.degreeCertificate[0].buffer, "degreeCertificates")
//       ).secure_url;
//       newEntry.degreeCertificate = uploads.degreeCertificateUrl;
//     }

//     // Upload project
//     if (files?.project?.[0]) {
//       uploads.projectUrl = (
//         await streamUpload(files.project[0].buffer, "projects")
//       ).secure_url;
//       newEntry.project = uploads.projectUrl;
//     }

//     // Upload background image
//     if (files?.backgroundImage?.[0]) {
//       uploads.backgroundImageUrl = (
//         await streamUpload(files.backgroundImage[0].buffer, "userBackgroundImages")
//       ).secure_url;
//       newEntry.backgroundImage = uploads.backgroundImageUrl;
//     }

//     // Upload profile image
//     if (files?.profileImage?.[0]) {
//       uploads.profileImageUrl = (
//         await streamUpload(files.profileImage[0].buffer, "userProfileImages")
//       ).secure_url;
//       newEntry.profileImage = uploads.profileImageUrl;
//     }

//     // Experience certificates (optional, multiple)
//     if (files?.experienceCertificate && newEntry.experiences) {
//       const experienceCerts = files.experienceCertificate;
//       for (let i = 0; i < newEntry.experiences.length && i < experienceCerts.length; i++) {
//         const uploadedCert = await streamUpload(
//           experienceCerts[i].buffer,
//           "experienceCertificates"
//         );
//         newEntry.experiences[i].experienceCertificate = uploadedCert.secure_url;
//       }
//     }

//     await newEntry.save();

//     let finalUserTypeForResponse = "candidate";
//     if (profileType) {
//       let authUserType = profileType.toLowerCase();
//       if (authUserType === "student") authUserType = "student";
//       else if (authUserType === "fresher") authUserType = "fresher";
//       else if (authUserType === "professional") authUserType = "professional";
//       else authUserType = "candidate";

//       await Auth.findByIdAndUpdate(req.user._id, { userType: authUserType });
//       console.log(`User ${req.user.email} userType updated to ${authUserType}`);
//       finalUserTypeForResponse = authUserType;
//     }

//     res.status(201).json({
//       message: "Form submitted successfully!",
//       profileType: profileType,
//       userType: finalUserTypeForResponse,
//     });
//   } catch (error) {
//     console.error("Form submission error (backend):", error);
//     res
//       .status(500)
//       .json({ error: "Form submission failed.", details: error.message });
//   }
// };

// export const getOnboardingForm = async (req, res) => {
//   try {
//     if (!req.user || !req.user._id) {
//       return res.status(401).json({ error: "Unauthorized: User not authenticated." });
//     }

//     // No need to exclude binary data if storing URLs
//     const entry = await OnboardingModel.findOne({ userId: req.user._id });

//     if (!entry) {
//       return res.status(404).json({ error: "Onboarding entry not found for this user." });
//     }

//     res.json(entry);
//   } catch (error) {
//     console.error("Fetch error:", error);
//     res.status(500).json({ error: "Failed to fetch data.", details: error.message });
//   }
// };

// export const updateOnboardingForm = async (req, res) => {
//   try {
//     if (!req.user || !req.user._id) {
//       return res
//         .status(401)
//         .json({ error: "Unauthorized: User not authenticated." });
//     }

//     const updates = { ...req.body };

//     // Parse stringified arrays if they exist
//     if (updates.jobRoles) updates.jobRoles = updates.jobRoles.split(",");
//     if (updates.locations) updates.locations = updates.locations.split(",");
//     if (updates.industry) updates.industry = updates.industry.split(",");
//     if (updates.skills) updates.skills = updates.skills.split(",");
//     if (updates.experiences) updates.experiences = JSON.parse(updates.experiences);

//     const files = req.files;

//     // Handle resume upload
//     if (files?.resume?.[0]) {
//       updates.resume = (await streamUpload(files.resume[0].buffer, "resumes")).secure_url;
//     }

//     // Handle degree certificate upload
//     if (files?.degreeCertificate?.[0]) {
//       updates.degreeCertificate = (
//         await streamUpload(files.degreeCertificate[0].buffer, "degreeCertificates")
//       ).secure_url;
//     }

//     // Handle project upload
//     if (files?.project?.[0]) {
//       updates.project = (await streamUpload(files.project[0].buffer, "projects")).secure_url;
//     }

//     // Handle background image upload
//     if (files?.backgroundImage?.[0]) {
//       updates.backgroundImage = (
//         await streamUpload(files.backgroundImage[0].buffer, "userBackgroundImages")
//       ).secure_url;
//     }

//     // Handle profile image upload
//     if (files?.profileImage?.[0]) {
//       updates.profileImage = (
//         await streamUpload(files.profileImage[0].buffer, "userProfileImages")
//       ).secure_url;
//     }

//     // Handle experience certificates (multiple)
//     if (files?.experienceCertificate && updates.experiences) {
//       const certs = files.experienceCertificate;
//       for (let i = 0; i < certs.length && i < updates.experiences.length; i++) {
//         const uploadedCert = await streamUpload(
//           certs[i].buffer,
//           "experienceCertificates"
//         );
//         updates.experiences[i].experienceCertificate = uploadedCert.secure_url;
//       }
//     }

//     const updated = await OnboardingModel.findByIdAndUpdate(
//       req.params.id,
//       updates,
//       { new: true, runValidators: true }
//     );

//     if (!updated) return res.status(404).json({ error: "Entry not found." });

//     if (updates.profileType) {
//       let authUserType = updates.profileType.toLowerCase();
//       if (authUserType === "student") authUserType = "student";
//       else if (authUserType === "fresher") authUserType = "fresher";
//       else if (authUserType === "professional") authUserType = "professional";
//       else authUserType = "candidate";

//       await Auth.findByIdAndUpdate(req.user._id, { userType: authUserType });
//       console.log(`User ${req.user.email} userType updated to ${authUserType}`);
//     }

//     res.json({ message: "Form updated successfully.", data: updated });
//   } catch (error) {
//     console.error("Update error:", error);
//     res.status(500).json({ error: "Update failed.", details: error.message });
//   }
// };




import OnboardingModel from "../models/studentonboardingmodel.js";
import Auth from "../models/auth.js"; // Import the Auth model
import cloudinary from "../../config/cloudinary.js"; // Assuming cloudinary config is here
import streamifier from "streamifier";

// Utility for streaming upload
const streamUpload = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto", folder: `rawrecruit/${folder}` },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export const getAllOnboardingForms = async (req, res) => {
  try {
    const forms = await OnboardingModel.find({});
    res.status(200).json({
      message: "Successfully fetched all onboarding forms.",
      data: forms,
    });
  } catch (error) {
    console.error("Error fetching all onboarding forms:", error);
    res.status(500).json({
      message: "Internal server error while fetching forms.",
      error: error.message,
    });
  }
};

export const submitOnboardingForm = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User not authenticated." });
    }

    const {
      name,
      email,
      phone,
      profileType,
      college,
      degree,
      semester,
      specialization,
      cgpa,
      yearOfGraduation,
      industry,
      jobRoles,
      locations,
      expectedSalaryCurrency,
      expectedSalaryAmount,
      currentSalaryCurrency,
      currentSalaryAmount,
      lookingFor,
      employmentType,
      skills,
      certifications,
      linkedin,
      github,
      portfolio,
      referralSource,
      experiences,
    } = req.body;

    const newEntry = new OnboardingModel({
      userId: req.user._id,
      name,
      email,
      phone,
      profileType: profileType,
      college,
      degree,
      semester,
      specialization,
      cgpa,
      yearOfGraduation,
      industry: industry ? industry.split(",") : [],
      jobRoles: jobRoles ? jobRoles.split(",") : [],
      locations: locations ? locations.split(",") : [],
      expectedSalaryCurrency,
      expectedSalaryAmount,
      currentSalaryCurrency,
      currentSalaryAmount,
      lookingFor,
      employmentType,
      skills: skills ? skills.split(",") : [],
      certifications,
      linkedin,
      github,
      portfolio,
      referralSource,
      experiences: experiences ? JSON.parse(experiences) : [],
    });

    const files = req.files;
    const uploads = {};

    // Upload resume
    if (files?.resume?.[0]) {
      uploads.resumeUrl = (
        await streamUpload(files.resume[0].buffer, "resumes")
      ).secure_url;
      newEntry.resume = uploads.resumeUrl;
    }

    // Upload degree certificate
    if (files?.degreeCertificate?.[0]) {
      uploads.degreeCertificateUrl = (
        await streamUpload(files.degreeCertificate[0].buffer, "degreeCertificates")
      ).secure_url;
      newEntry.degreeCertificate = uploads.degreeCertificateUrl;
    }

    // Upload project
    if (files?.project?.[0]) {
      uploads.projectUrl = (
        await streamUpload(files.project[0].buffer, "projects")
      ).secure_url;
      newEntry.project = uploads.projectUrl;
    }

    // Upload background image
    if (files?.backgroundImage?.[0]) {
      uploads.backgroundImageUrl = (
        await streamUpload(files.backgroundImage[0].buffer, "userBackgroundImages")
      ).secure_url;
      newEntry.backgroundImage = uploads.backgroundImageUrl;
    }

    // Upload profile image
    if (files?.profileImage?.[0]) {
      uploads.profileImageUrl = (
        await streamUpload(files.profileImage[0].buffer, "userProfileImages")
      ).secure_url;
      newEntry.profileImage = uploads.profileImageUrl;
    }

    // Experience certificates (optional, multiple)
    if (files?.experienceCertificate && newEntry.experiences) {
      const experienceCerts = files.experienceCertificate;
      for (let i = 0; i < newEntry.experiences.length && i < experienceCerts.length; i++) {
        const uploadedCert = await streamUpload(
          experienceCerts[i].buffer,
          "experienceCertificates"
        );
        newEntry.experiences[i].experienceCertificate = uploadedCert.secure_url;
      }
    }

    await newEntry.save();

    let finalUserTypeForResponse = "candidate";
    if (profileType) {
      let authUserType = profileType.toLowerCase();
      if (authUserType === "student") authUserType = "student";
      else if (authUserType === "fresher") authUserType = "fresher";
      else if (authUserType === "professional") authUserType = "professional";
      else authUserType = "candidate";

      await Auth.findByIdAndUpdate(req.user._id, { userType: authUserType });
      console.log(`User ${req.user.email} userType updated to ${authUserType}`);
      finalUserTypeForResponse = authUserType;
    }

    res.status(201).json({
      message: "Form submitted successfully!",
      profileType: profileType,
      userType: finalUserTypeForResponse,
    });
  } catch (error) {
    console.error("Form submission error (backend):", error);
    res
      .status(500)
      .json({ error: "Form submission failed.", details: error.message });
  }
};

export const getOnboardingForm = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Unauthorized: User not authenticated." });
    }

    // No need to exclude binary data if storing URLs
    const entry = await OnboardingModel.findOne({ userId: req.user._id });

    if (!entry) {
      return res.status(404).json({ error: "Onboarding entry not found for this user." });
    }

    res.json(entry);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Failed to fetch data.", details: error.message });
  }
};

export const updateOnboardingForm = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User not authenticated." });
    }

    // Check if user already has onboarding data
    let existingEntry = await OnboardingModel.findOne({ userId: req.user._id });
    
    const updates = { ...req.body };

    // Parse stringified arrays if they exist
    if (updates.jobRoles) updates.jobRoles = updates.jobRoles.split(",");
    if (updates.locations) updates.locations = updates.locations.split(",");
    if (updates.industry) updates.industry = updates.industry.split(",");
    if (updates.skills) updates.skills = updates.skills.split(",");
    if (updates.experiences) updates.experiences = JSON.parse(updates.experiences);

    const files = req.files;

    // Handle resume upload
    if (files?.resume?.[0]) {
      updates.resume = (await streamUpload(files.resume[0].buffer, "resumes")).secure_url;
    }

    // Handle degree certificate upload
    if (files?.degreeCertificate?.[0]) {
      updates.degreeCertificate = (
        await streamUpload(files.degreeCertificate[0].buffer, "degreeCertificates")
      ).secure_url;
    }

    // Handle project upload
    if (files?.project?.[0]) {
      updates.project = (await streamUpload(files.project[0].buffer, "projects")).secure_url;
    }

    // Handle background image upload
    if (files?.backgroundImage?.[0]) {
      updates.backgroundImage = (
        await streamUpload(files.backgroundImage[0].buffer, "userBackgroundImages")
      ).secure_url;
    }

    // Handle profile image upload
    if (files?.profileImage?.[0]) {
      updates.profileImage = (
        await streamUpload(files.profileImage[0].buffer, "userProfileImages")
      ).secure_url;
    }

    // Handle experience certificates (multiple)
    if (files?.experienceCertificate && updates.experiences) {
      const certs = files.experienceCertificate;
      for (let i = 0; i < certs.length && i < updates.experiences.length; i++) {
        const uploadedCert = await streamUpload(
          certs[i].buffer,
          "experienceCertificates"
        );
        updates.experiences[i].experienceCertificate = uploadedCert.secure_url;
      }
    }

    let updated;
    
    if (existingEntry) {
      // Update existing entry
      updated = await OnboardingModel.findByIdAndUpdate(
        existingEntry._id,
        updates,
        { new: true, runValidators: true }
      );
    } else {
      // Create new entry if it doesn't exist
      const newEntry = new OnboardingModel({
        userId: req.user._id,
        ...updates
      });
      updated = await newEntry.save();
    }

    if (!updated) return res.status(404).json({ error: "Entry not found." });

    if (updates.profileType) {
      let authUserType = updates.profileType.toLowerCase();
      if (authUserType === "student") authUserType = "student";
      else if (authUserType === "fresher") authUserType = "fresher";
      else if (authUserType === "professional") authUserType = "professional";
      else authUserType = "candidate";

      await Auth.findByIdAndUpdate(req.user._id, { userType: authUserType });
      console.log(`User ${req.user.email} userType updated to ${authUserType}`);
    }

    res.json({ message: "Form updated successfully.", data: updated });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Update failed.", details: error.message });
  }
};