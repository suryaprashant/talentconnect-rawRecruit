import OnboardingModel from '../models/studentonboardingModel.js';
import Auth from '../models/authModel.js';
import { updateAuthUserService } from './authService.js';

// Get all onboarding forms
export async function getAllOnboardingFormsService() {
  try {
    const forms = await OnboardingModel.find({});
    return forms;
  } catch (error) {
    throw error;
  }
}

// Get onboarding form for a user
export async function getOnboardingFormService(userId) {
  try {
    const entry = await OnboardingModel.findOne({ userId });
    return entry;
  } catch (error) {
    throw error;
  }
}

// Submit onboarding form (create or update)
export async function submitOnboardingFormService(userId, body, files) {
  // Prepare updateData as in controller
  const updateData = {
    userId,
    name: body.name,
    email: body.email,
    phone: body.phone,
    profileType: body.profileType,
    college: body.college,
    degree: body.degree,
    semester: body.semester,
    specialization: body.specialization,
    cgpa: body.cgpa,
    yearOfGraduation: body.yearOfGraduation,
    expectedSalaryCurrency: body.expectedSalaryCurrency,
    expectedSalaryAmount: body.expectedSalaryAmount,
    currentSalaryCurrency: body.currentSalaryCurrency,
    currentSalaryAmount: body.currentSalaryAmount,
    lookingFor: body.lookingFor,
    employmentType: body.employmentType ? body.employmentType.split(",") : [],
    certifications: body.certifications,
    linkedin: body.linkedin,
    github: body.github,
    portfolio: body.portfolio,
    referralSource: body.referralSource,
    industry: body.industry ? body.industry.split(",") : [],
    jobRoles: body.jobRoles ? body.jobRoles.split(",") : [],
    locations: body.locations ? body.locations.split(",") : [],
    skills: body.skills ? body.skills.split(",") : [],
    experiences: body.experiences ? JSON.parse(body.experiences) : [],
    leadership: body.leadership ? JSON.parse(body.leadership) : [],
    internationalExperience: body.internationalExperience ? JSON.parse(body.internationalExperience) : [],
    awards: body.awards ? JSON.parse(body.awards) : [],
    publications: body.publications ? JSON.parse(body.publications) : [],
    achievements: body.achievements ? JSON.parse(body.achievements) : [],
    about: body.about,
    gender: body.gender,
    openToShift: body.openToShift,
    noticePeriod: body.noticePeriod,
    servingNotivePeriod: body.servingNoticePeriod == 'true',
    totalYearsOfExperience: body.totalYearsOfExperience,
    languagesKnown: body.languagesKnown ? body.languagesKnown.split(",") : [],
    toolsAndPlatforms: body.toolsAndPlatforms ? body.toolsAndPlatforms.split(",") : [],
    domainKnowledge: body.domainKnowledge ? body.domainKnowledge.split(",") : [],
    currentCompany: body.currentCompany,
  };
  return await handleOnboardingUpdate(updateData, files);
}

// Update onboarding form for a user
export async function updateOnboardingFormService(userId, body, files) {
  // Prepare updates as in controller
  const updates = { ...body };
  const fieldsToParse = ['jobRoles', 'locations', 'industry', 'skills', 'languagesKnown', 'toolsAndPlatforms', 'domainKnowledge'];
  fieldsToParse.forEach(field => {
    if (updates[field] && typeof updates[field] === 'string') {
      updates[field] = updates[field].split(',');
    }
  });
  const jsonFields = ['experiences', 'leadership', 'internationalExperience', 'awards', 'publications', 'achievements', 'projectsHandled'];
  jsonFields.forEach(field => {
    if (updates[field] && typeof updates[field] === 'string') {
      updates[field] = JSON.parse(updates[field]);
    }
  });
  // Use handleOnboardingUpdate for file uploads and DB update
  updates.userId = userId;
  const result = await handleOnboardingUpdate(updates, files);
  return result.updatedOnboarding;
}

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

  const updatedUser = await updateAuthUserService(updateData.userId, {
    userType: authUserType,
    onboardingCompleted: true,
    onboardingStep: 6
  })

  return {
    finalUserTypeForResponse,
    authUserType,
    updatedUser,
    updatedOnboarding
  };
};