import OnboardingModel from '../models/studentonboardingModel.js';
import Auth from '../models/authModel.js';
import { updateAuthUserService } from '../services/authService.js';
import { streamUpload } from '../utils/streamUpload.js';

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

    if (entry && entry.experiences && entry.experiences.length > 0) {
      entry.experiences.sort((a, b) => {
        // Handle "Present" or empty strings for current roles
        const dateA = a.startDate ? new Date(a.startDate) : new Date(0);
        const dateB = b.startDate ? new Date(b.startDate) : new Date(0);
        
        return dateB - dateA; // Sort descending: newer dates first
      });
    }

    return entry;
  } catch (error) {
    throw error;
  }
}


// export async function submitOnboardingFormService(userId, body, files) {

//   const parseJsonArray = (field) => {
//     if (!body[field]) return [];
//     try {
//       const parsed = JSON.parse(body[field]);
//       return Array.isArray(parsed) ? parsed : [];
//     } catch {
//       return [];
//     }
//   };

//   const parseJsonObject = (field) => {
//     if (!body[field]) return null;
//     try {
//       return JSON.parse(body[field]);
//     } catch {
//       return null;
//     }
//   };
//   const updateData = {
//     userId,
//     name: body.name,
//     email: body.email,
//     phone: body.phone,
//     profileType: body.profileType,
  
//     college: body.college,
//     degree: body.degree,
//     semester: body.semester,
//     specialization: body.specialization,
//     cgpa: body.cgpa,
//     yearOfGraduation: body.yearOfGraduation,
  
//     expectedSalaryCurrency: body.expectedSalaryCurrency,
//     expectedSalaryAmount: body.expectedSalaryAmount,
//     currentSalaryCurrency: body.currentSalaryCurrency,
//     currentSalaryAmount: body.currentSalaryAmount,
  
//     lookingFor: parseJsonArray("lookingFor"),
//     employmentType: parseJsonArray("employmentType"),
//     industry: parseJsonArray("industry"),
//     jobRoles: parseJsonArray("jobRoles"),
//     locations: parseJsonArray("locations"),
//     skills: parseJsonArray("skills"),
//     languagesKnown: parseJsonArray("languagesKnown"),
//     toolsAndPlatforms: parseJsonArray("toolsAndPlatforms"),
//     domainKnowledge: parseJsonArray("domainKnowledge"),
//     openToShift: Array.isArray(body.openToShift)
//       ? body.openToShift.join(",")
//       : body.openToShift || "",
  
//     // complex arrays
//     education: parseJsonArray("education"),
//     experiences: body.experiences ? JSON.parse(body.experiences) : [],
  
//     leadership: body.leadership ? JSON.parse(body.leadership) : [],
//     internationalExperience: body.internationalExperience ? JSON.parse(body.internationalExperience) : [],
//     awards: body.awards ? JSON.parse(body.awards) : [],
//     publications: body.publications ? JSON.parse(body.publications) : [],
//     achievements: body.achievements ? JSON.parse(body.achievements) : [],
  
//     about: body.about,
//     gender: body.gender,
//     noticePeriod: body.noticePeriod,
//     servingNoticePeriod: body.servingNoticePeriod === "true",
//     totalYearsOfExperience: body.totalYearsOfExperience,
//     currentCompany,
//     companyEmail: body.companyEmail || "",
    
//   emailVerified: body.emailVerified === "true" || body.emailVerified === true,
  
//     certifications: body.certifications,
//     linkedin: body.linkedin,
//     github: body.github,
//     portfolio: body.portfolio,
//     referralSource: body.referralSource,
//   };
//   let currentCompany = body.currentCompany || "";
// if (!currentCompany && Array.isArray(updateData.experiences)) {
//   const currentExp = updateData.experiences.find(e => e.isCurrent === true);
//   if (currentExp?.company) currentCompany = currentExp.company;
// }

//   return await handleOnboardingUpdate(updateData, files);
// }


// export async function updateOnboardingFormService(userId, body, files) {
//   const updates = { ...body };
//   console.log(updates)
//   const fieldsToParse = ['jobRoles', 'locations', 'industry', 'skills', 'languagesKnown', 'toolsAndPlatforms', 'domainKnowledge'];
//   fieldsToParse.forEach(field => {
//     if (updates[field] && typeof updates[field] === 'string') {
//       updates[field] = updates[field].split(',');
//     }
//   });
//   const jsonFields = ['experiences', 'leadership', 'internationalExperience', 'awards', 'publications', 'achievements', 'projectsHandled'];
//   jsonFields.forEach(field => {
//     if (updates[field] && typeof updates[field] === 'string') {
//       updates[field] = JSON.parse(updates[field]);
//     }
//   });
//   updates.userId = userId;
//   const result = await handleOnboardingUpdate(updates, files);
//   return result.updatedOnboarding;
// }
export async function submitOnboardingFormService(userId, body, files) {

  const parseJsonArray = (field) => {
    if (!body[field]) return [];
    try {
      const parsed = JSON.parse(body[field]);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const parseJsonObject = (field) => {
    if (!body[field]) return null;
    try {
      return JSON.parse(body[field]);
    } catch {
      return null;
    }
  };

  // ✅ STEP 1: Parse experiences first
  const experiences = body.experiences ? JSON.parse(body.experiences) : [];

  // ✅ STEP 2: Derive currentCompany from experiences if not provided
  let currentCompany = body.currentCompany || "";
  if (!currentCompany && Array.isArray(experiences)) {
    const currentExp = experiences.find(e => e.isCurrent === true);
    if (currentExp?.company) currentCompany = currentExp.company;
  }

  // ✅ STEP 3: Build updateData using the already-resolved values
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

    lookingFor: parseJsonArray("lookingFor"),
    employmentType: parseJsonArray("employmentType"),
    industry: parseJsonArray("industry"),
    jobRoles: parseJsonArray("jobRoles"),
    locations: parseJsonArray("locations"),
    skills: parseJsonArray("skills"),
    languagesKnown: parseJsonArray("languagesKnown"),
    toolsAndPlatforms: parseJsonArray("toolsAndPlatforms"),
    domainKnowledge: parseJsonArray("domainKnowledge"),
    openToShift: Array.isArray(body.openToShift)
      ? body.openToShift.join(",")
      : body.openToShift || "",

    education: parseJsonArray("education"),
    experiences,   // ✅ use pre-parsed value

    leadership: body.leadership ? JSON.parse(body.leadership) : [],
    internationalExperience: body.internationalExperience ? JSON.parse(body.internationalExperience) : [],
    awards: body.awards ? JSON.parse(body.awards) : [],
    publications: body.publications ? JSON.parse(body.publications) : [],
    achievements: body.achievements ? JSON.parse(body.achievements) : [],

    about: body.about,
    gender: body.gender,
    noticePeriod: body.noticePeriod,
    servingNoticePeriod: body.servingNoticePeriod === "true",
    totalYearsOfExperience: body.totalYearsOfExperience,
    currentCompany,   // ✅ use pre-resolved value
    companyEmail: body.companyEmail || "",

    emailVerified: body.emailVerified === "true" || body.emailVerified === true,

    certifications: body.certifications,
    linkedin: body.linkedin,
    github: body.github,
    portfolio: body.portfolio,
    referralSource: body.referralSource,
  };

  return await handleOnboardingUpdate(updateData, files);
}

export async function updateOnboardingFormService(userId, body, files) {
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

  if (Array.isArray(updates.experiences)) {
    // Derive currentCompany from isCurrent experience
    const currentExp = updates.experiences.find(e => e.isCurrent === true);
    if (currentExp?.company) {
      updates.currentCompany = currentExp.company;
    }

    // Strip endDate if isCurrent is true
    updates.experiences = updates.experiences.map(exp => {
      if (exp.isCurrent === true) {
        return { ...exp, endDate: '' };
      }
      return exp;
    });
  } // ← this was missing

  updates.userId = userId;
  const result = await handleOnboardingUpdate(updates, files);

  const allowedTypes = ['professional'];

  if (updates.profileType && allowedTypes.includes(updates.profileType)) {
    await Auth.findByIdAndUpdate(userId, {
      userType: updates.profileType
    });
  }
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
// export const handleOnboardingUpdate = async (updateData, files) => {
//   const getCorrectUrl = (uploadResult) => {
//     if (!uploadResult || !uploadResult.resource_type || !uploadResult.secure_url) {
//       console.error("Invalid upload result passed to getCorrectUrl");
//       return '';
//     }
//     if (uploadResult.resource_type === 'raw') {
//       return uploadResult.secure_url.replace('/image/upload/', '/raw/upload/');
//     }
//     return uploadResult.secure_url;
//   };

//   if (files?.resume?.[0]) {
//     console.log("Uploading resume:", files.resume[0].originalname);
//     const upload = await streamUpload(files.resume[0].buffer, "resumes", files.resume[0].originalname);
//     updateData.resume = getCorrectUrl(upload);
//   }
//   if (files?.degreeCertificate?.[0]) {
//     console.log("Uploading degree cert:", files.degreeCertificate[0].originalname);
//     const upload = await streamUpload(files.degreeCertificate[0].buffer, "degreeCertificates", files.degreeCertificate[0].originalname);
//     updateData.degreeCertificate = getCorrectUrl(upload);
//   }
//   if (files?.project?.[0]) {
//     console.log("Uploading project file:", files.project[0].originalname);
//     const upload = await streamUpload(files.project[0].buffer, "projects", files.project[0].originalname);
//     updateData.project = getCorrectUrl(upload);
//   }
//   if (files?.backgroundImage?.[0]) {
//     const upload = await streamUpload(files.backgroundImage[0].buffer, "userBackgroundImages", files.backgroundImage[0].originalname);
//     updateData.backgroundImage = upload.secure_url;
//   }
//   if (files?.profileImage?.[0]) {
//     const upload = await streamUpload(files.profileImage[0].buffer, "userProfileImages", files.profileImage[0].originalname);
//     updateData.profileImage = upload.secure_url;
//   }

//   if (files?.experienceCertificate && updateData.experiences) {
//     const experienceCerts = files.experienceCertificate;
//     for (let i = 0; i < updateData.experiences.length && i < experienceCerts.length; i++) {
//       const file = experienceCerts[i];
//       if (file) {
//         console.log("Uploading experience cert:", file.originalname);
//         const uploadedCert = await streamUpload(file.buffer, "experienceCertificates", file.originalname);
//         updateData.experiences[i].experienceCertificate = getCorrectUrl(uploadedCert);
//       }
//     }
//   }
//   if (files?.leadershipCertificate && updateData.leadership) {
//     const leadershipCerts = files.leadershipCertificate;
//     for (let i = 0; i < updateData.leadership.length && i < leadershipCerts.length; i++) {
//       const file = leadershipCerts[i];
//       if (file) {
//         console.log("Uploading leadership cert:", file.originalname);
//         const uploadedCert = await streamUpload(file.buffer, "leadershipCertificates", file.originalname);
//         updateData.leadership[i].certificate = getCorrectUrl(uploadedCert);
//       }
//     }
//   }
//   if (files?.internationalExperienceCertificate && updateData.internationalExperience) {
//     const internationalCerts = files.internationalExperienceCertificate;
//     for (let i = 0; i < updateData.internationalExperience.length && i < internationalCerts.length; i++) {
//       const file = internationalCerts[i];
//       if (file) {
//         console.log("Uploading international cert:", file.originalname);
//         const uploadedCert = await streamUpload(file.buffer, "internationalExperienceCertificates", file.originalname);
//         updateData.internationalExperience[i].certificate = getCorrectUrl(uploadedCert);
//       }
//     }
//   }
//   if (files?.awardCertificate && updateData.awards) {
//     const awardCerts = files.awardCertificate;
//     for (let i = 0; i < updateData.awards.length && i < awardCerts.length; i++) {
//       const file = awardCerts[i];
//       if (file) {
//         console.log("Uploading award cert:", file.originalname);
//         const uploadedCert = await streamUpload(file.buffer, "awardCertificates", file.originalname);
//         updateData.awards[i].certificate = getCorrectUrl(uploadedCert);
//       }
//     }
//   }

//   console.log("Data being saved to DB:", updateData);
//   const updatedOnboarding = await OnboardingModel.findOneAndUpdate(
//     { userId: updateData.userId },
//     { $set: updateData },
//     { upsert: true, new: true, runValidators: true }
//   );

//   let finalUserTypeForResponse = "candidate";
//   let authUserType = "candidate";
//   if (updateData.profileType) {
//     authUserType = updateData.profileType.toLowerCase();
//     if (!["student", "fresher", "professional"].includes(authUserType)) {
//       authUserType = "candidate";
//     }
//     finalUserTypeForResponse = authUserType;
//   }

//   const updatedUser = await updateAuthUserService(updateData.userId, {
//     userType: authUserType,
//     onboardingCompleted: true,
//     onboardingStep: 6
//   });

//   return {
//     finalUserTypeForResponse,
//     authUserType,
//     updatedUser,
//     updatedOnboarding
//   };
// };


export const handleOnboardingUpdate = async (updateData, files) => {


  

  if (files?.resume?.[0]) {
    const file = files.resume[0];
    const upload = await streamUpload(file.buffer, "resumes", file.mimetype);

    // existing field (keep it for backward compatibility)
    updateData.resume = upload.secure_url;

    // ✅ ADD THIS LINE (DO NOT REMOVE resume)
    updateData.resumeUrl = upload.secure_url;
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
  {/*let finalUserTypeForResponse = "candidate";
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
  })*/}

  const updatedUser = await updateAuthUserService(updateData.userId, {
  onboardingCompleted: true,
  onboardingStep: 6
});


  return {
   
    updatedUser,
    updatedOnboarding
  };
};

export const getCategorizedSkillsService = async (userId) => {
  try {
    const onboarding = await OnboardingModel.findOne(
      { userId },
      { categorizedSkills: 1, _id: 0 }
    );

    if (!onboarding) {
      return null;
    }

    return onboarding.categorizedSkills || {
      highInDemand: [],
      growing: [],
      saturated: [],
      obsolete: []
    };

  } catch (error) {
    console.error("Service error (getCategorizedSkills):", error);
    throw error;
  }
};