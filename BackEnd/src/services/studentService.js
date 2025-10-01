import OnboardingModel from '../models/studentonboardingModel.js';
import Auth from '../models/authModel.js';

export async function getStudentService(userId) {
    try {
        const userData = await OnboardingModel.find({ userId: userId }).lean();
        return { success: true, data: userData };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}

export async function getCandidatEmail(studentId) {
    try {
        const student = await OnboardingModel.findOne({ _id: studentId }).lean();
        return { success: true, email: student.email };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}

export async function checkStudentService(studentId) {
    try {
        const student = await OnboardingModel.exists({ userId: studentId });
        // console.log(student);
        if (student) return true;
        return false;

    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}

export const handleOnboardingUpdate = async (updateData, files) => {
  // Upload files and update data (the core logic from controller)
  const streamUpload = require('../utils/streamUpload'); // adjust import

  // File uploads (same as previous controller logic)
  if (files?.resume?.[0]) {
    const upload = await streamUpload(files.resume[0].buffer, "resumes");
    updateData.resume = upload.secure_url;
  }
  if (files?.degreeCertificate?.[0]) {
    const upload = await streamUpload(files.degreeCertificate[0].buffer, "degreeCertificates");
    updateData.degreeCertificate = upload.secure_url;
  }
  if (files?.project?.[0]) {
    const upload = await streamUpload(files.project[0].buffer, "projects");
    updateData.project = upload.secure_url;
  }
  if (files?.backgroundImage?.[0]) {
    const upload = await streamUpload(files.backgroundImage[0].buffer, "userBackgroundImages");
    updateData.backgroundImage = upload.secure_url;
  }
  if (files?.profileImage?.[0]) {
    const upload = await streamUpload(files.profileImage[0].buffer, "userProfileImages");
    updateData.profileImage = upload.secure_url;
  }

  // Array certificates
  if (files?.experienceCertificate && updateData.experiences) {
    const experienceCerts = files.experienceCertificate;
    for (let i = 0; i < updateData.experiences.length && i < experienceCerts.length; i++) {
      const uploadedCert = await streamUpload(
        experienceCerts[i].buffer,
        "experienceCertificates"
      );
      updateData.experiences[i].experienceCertificate = uploadedCert.secure_url;
    }
  }
  if (files?.leadershipCertificate && updateData.leadership) {
    const leadershipCerts = files.leadershipCertificate;
    for (let i = 0; i < updateData.leadership.length && i < leadershipCerts.length; i++) {
      const uploadedCert = await streamUpload(
        leadershipCerts[i].buffer,
        "leadershipCertificates"
      );
      updateData.leadership[i].certificate = uploadedCert.secure_url;
    }
  }
  if (files?.internationalExperienceCertificate && updateData.internationalExperience) {
    const internationalCerts = files.internationalExperienceCertificate;
    for (let i = 0; i < updateData.internationalExperience.length && i < internationalCerts.length; i++) {
      const uploadedCert = await streamUpload(
        internationalCerts[i].buffer,
        "internationalExperienceCertificates"
      );
      updateData.internationalExperience[i].certificate = uploadedCert.secure_url;
    }
  }
  if (files?.awardCertificate && updateData.awards) {
    const awardCerts = files.awardCertificate;
    for (let i = 0; i < updateData.awards.length && i < awardCerts.length; i++) {
      const uploadedCert = await streamUpload(
        awardCerts[i].buffer,
        "awardCertificates"
      );
      updateData.awards[i].certificate = uploadedCert.secure_url;
    }
  }

  // Save onboarding data
  const updatedOnboarding = await OnboardingModel.findOneAndUpdate(
    { userId: updateData.userId }, 
    { $set: updateData },     
    { upsert: true, new: true, runValidators: true }
  );

  // Set userType logic
  let finalUserTypeForResponse = "candidate";
  let authUserType = "candidate";
  if (updateData.profileType) {
    authUserType = updateData.profileType.toLowerCase();
    if (authUserType === "student") authUserType = "student";
    else if (authUserType === "fresher") authUserType = "fresher";
    else if (authUserType === "professional") authUserType = "professional";
    else authUserType = "candidate";
    finalUserTypeForResponse = authUserType;
  }

  const updatedUser = await Auth.findByIdAndUpdate(
    updateData.userId,
    { 
      userType: authUserType,
      onboardingCompleted: true,
      onboardingStep: 6
    },
    { new: true }
  ).select("-password");

  return {
    finalUserTypeForResponse,
    authUserType,
    updatedUser,
    updatedOnboarding
  };
};