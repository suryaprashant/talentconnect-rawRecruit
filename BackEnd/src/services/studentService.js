import OnboardingModel from '../models/studentonboardingModel.js';
import Auth from '../models/authModel.js';
import { updateAuthUserService } from '../services/authService.js';
import { streamUpload } from '../utils/streamUpload.js';
import {JobPostingTable} from '../models/jobPostingsModel.js'
import Application  from '../models/applicationModel.js';
import {
  resolveCollege,
  resolveCompany,
} from "./normalizationService.js";
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
    const entry = await OnboardingModel
      .findOne({ userId })
      .lean();

    if (!entry) return null;

    // =========================
    // Sort Experiences
    // =========================

    if (
      Array.isArray(entry.experiences) &&
      entry.experiences.length > 0
    ) {
      entry.experiences.sort((a, b) => {
        const dateA = a.startDate
          ? new Date(a.startDate)
          : new Date(0);

        const dateB = b.startDate
          ? new Date(b.startDate)
          : new Date(0);

        return dateB - dateA;
      });
    }

    // =========================
    // Sort Educations
    // =========================

    if (
      Array.isArray(entry.educations) &&
      entry.educations.length > 0
    ) {
      entry.educations.sort((a, b) => {
        const dateA = a.startDate
          ? new Date(a.startDate)
          : new Date(0);

        const dateB = b.startDate
          ? new Date(b.startDate)
          : new Date(0);

        return dateB - dateA;
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

    // already parsed from controller
    if (Array.isArray(body[field])) return body[field];

    try {
      const parsed = JSON.parse(body[field]);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const parseJsonObject = (field) => {
    if (!body[field]) return null;

    // already parsed from controller
    if (typeof body[field] === "object") return body[field];

    try {
      return JSON.parse(body[field]);
    } catch {
      return null;
    }
  };

  // =========================
  // Parse Arrays
  // =========================

  const educations = parseJsonArray("educations");
  const experiences = parseJsonArray("experiences");

  // =========================
  // Derive currentCompany
  // =========================

  let currentCompany = body.currentCompany || "";

  if (!currentCompany && Array.isArray(experiences)) {
    const currentExp = experiences.find(
      (e) => e.isCurrent === true
    );

    if (currentExp?.company) {
      currentCompany = currentExp.company;
    }
  }

  // =========================
  // Build Update Data
  // =========================

  const updateData = {
    userId,

    name: body.name,
    email: body.email,
    phone: body.phone,
    profileType: body.profileType,

    // NEW EDUCATION FIELD
    educations,

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

    experiences,

    leadership: parseJsonArray("leadership"),

    internationalExperience:
      parseJsonArray("internationalExperience"),

    awards: parseJsonArray("awards"),

    publications: parseJsonArray("publications"),

    achievements: parseJsonArray("achievements"),

    about: body.about,

    gender: body.gender,

    noticePeriod: body.noticePeriod,

    servingNoticePeriod:
      body.servingNoticePeriod === "true" ||
      body.servingNoticePeriod === true,

    totalYearsOfExperience:
      body.totalYearsOfExperience,

    currentCompany,

    companyEmail: body.companyEmail || "",

    emailVerified:
      body.emailVerified === "true" ||
      body.emailVerified === true,

    certifications: body.certifications,

    linkedin: body.linkedin,

    github: body.github,

    portfolio: body.portfolio,

    referralSource: body.referralSource,
  };

  return await handleOnboardingUpdate(updateData, files);
}

export async function updateOnboardingFormService(
  userId,
  body,
  files
) {
  // ✅ Helper - SAME as CREATE
  const parseJsonArray = (field) => {
    if (!body[field]) return;  // ✅ Don't set default for missing fields
    if (Array.isArray(body[field])) return body[field];
    try {
      const parsed = JSON.parse(body[field]);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const parseJsonObject = (field) => {
    if (!body[field]) return;  // ✅ Don't set default for missing fields
    if (typeof body[field] === "object") return body[field];
    try {
      return JSON.parse(body[field]);
    } catch {
      return null;
    }
  };

  // ✅ Start with body spread (includes only what was provided)
  const updates = { ...body };

  // ✅ Process ONLY array fields that were actually provided
  const arrayFields = [
    "jobRoles",
    "locations",
    "industry",
    "skills",
    "languagesKnown",
    "toolsAndPlatforms",
    "domainKnowledge",
    "lookingFor",
    "employmentType"
  ];

  arrayFields.forEach((field) => {
    if (updates[field] !== undefined) {  // ✅ Only if provided
      updates[field] = parseJsonArray(field);
    }
  });

  // ✅ Process ONLY JSON fields that were actually provided
  const jsonFields = [
    "educations",
    "experiences",
    "leadership",
    "internationalExperience",
    "awards",
    "publications",
    "achievements",
    "projectsHandled"
  ];

  jsonFields.forEach((field) => {
    if (updates[field] !== undefined) {  // ✅ Only if provided
      updates[field] = parseJsonObject(field);
    }
  });

  // =========================
  // Experiences Logic
  // =========================

  if (Array.isArray(updates.experiences)) {
    const currentExp = updates.experiences.find(
      (e) => e.isCurrent === true
    );

    if (currentExp?.company) {
      updates.currentCompany = currentExp.company;
    }

    updates.experiences = updates.experiences.map((exp) => {
      if (exp.isCurrent === true) {
        return { ...exp, endDate: "" };
      }
      return exp;
    });
  }

  // =========================
  // Education Logic
  // =========================

  if (Array.isArray(updates.educations)) {
    updates.educations = updates.educations.map((edu) => {
      if (edu.isCurrent === true) {
        return { ...edu, endDate: "" };
      }
      return edu;
    });
  }

  // =========================
  // Boolean conversions
  // =========================

  if (updates.servingNoticePeriod !== undefined) {
    updates.servingNoticePeriod =
      updates.servingNoticePeriod === true ||
      updates.servingNoticePeriod === "true";
  }

  if (updates.emailVerified !== undefined) {
    updates.emailVerified =
      updates.emailVerified === true ||
      updates.emailVerified === "true";
  }

  updates.userId = userId;

  // =========================
  // DB Update
  // =========================

  const result = await handleOnboardingUpdate(
    updates,
    files
  );

  // =========================
  // Update Auth userType
  // =========================

  const allowedTypes = ["professional"];

  if (
    updates.profileType &&
    allowedTypes.includes(updates.profileType)
  ) {
    await Auth.findByIdAndUpdate(userId, {
      userType: updates.profileType,
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
    const upload = await streamUpload(file.buffer, "resumes");

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
  if (Array.isArray(updateData.educations)) {
    for (const edu of updateData.educations) {

      if (!edu.college) continue;

      const result = await resolveCollege(
        edu.college
      );

      if (!result) continue;

      edu.college_master_id =
        result.masterId;

      edu.college_canonical_id =
        result.canonicalId;

      edu.college_display =
        result.displayName;
    }
  }
  if (Array.isArray(updateData.experiences)) {
    for (const exp of updateData.experiences) {

      if (!exp.company) continue;

      const result = await resolveCompany(
        exp.company
      );

      if (!result) continue;

      exp.company_master_id =
        result.masterId;

      exp.company_canonical_id =
        result.canonicalId;

      exp.company_display =
        result.displayName;
    }
  }
  if (updateData.currentCompany) {

    const result =
      await resolveCompany(
        updateData.currentCompany
      );

    if (result) {

      updateData.currentCompany_master_id =
        result.masterId;

      updateData.currentCompany_canonical_id =
        result.canonicalId;

      updateData.currentCompany_display =
        result.displayName;
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

// this service gets all the details of the specific user if passed to display in app frontend
export const getOnboardingByUserIdService = async (
  userId
) => {
  if (!userId) {
    throw new Error("UserId is required");
  }

  const onboardingData = await OnboardingModel
    .findOne({ userId })
    .lean();

  if (!onboardingData) {
    return null;
  }

  // =========================
  // Sort Experiences
  // =========================

  if (
    Array.isArray(onboardingData.experiences)
  ) {
    onboardingData.experiences.sort((a, b) => {

      // current company first
      if (a.isCurrent) return -1;
      if (b.isCurrent) return 1;

      const dateA = a.startDate
        ? new Date(a.startDate)
        : new Date(0);

      const dateB = b.startDate
        ? new Date(b.startDate)
        : new Date(0);

      return dateB - dateA;
    });
  }

  // =========================
  // Sort Educations
  // =========================

  if (
    Array.isArray(onboardingData.educations)
  ) {
    onboardingData.educations.sort((a, b) => {

      // current education first
      if (a.isCurrent) return -1;
      if (b.isCurrent) return 1;

      const dateA = a.startDate
        ? new Date(a.startDate)
        : new Date(0);

      const dateB = b.startDate
        ? new Date(b.startDate)
        : new Date(0);

      return dateB - dateA;
    });
  }

  if (onboardingData.profileType === "professional") {
    const jobs = await JobPostingTable.find(
      {
        postedByUser: userId,
        jobType: "Referral",
        approvalStatus: "Approved"
      },
      { _id: 1 }
    ).lean();

    const jobIds = jobs.map(job => job._id);

    if (jobIds.length === 0) {
      onboardingData.responseRate = 0;
    } else {
      const [
        totalApplicationsReceived,
        totalReferredToCompany,
      ] = await Promise.all([
        Application.countDocuments({
          job: { $in: jobIds },
          jobType: "Referral",
          adminApprovalStatus: "Approved",
        }),

        Application.countDocuments({
          job: { $in: jobIds },
          jobType: "Referral",
          adminApprovalStatus: "Approved",
          currentStatus: {
            $in: [
              "Referred To Company",
              "Shortlisted",
              "Interview Scheduled",
              "Offer Extended",
              "Accepted",
              "Rejected",
            ],
          },
        }),
      ]);

      onboardingData.responseRate =
        totalApplicationsReceived > 0
          ? Math.round(
              (totalReferredToCompany /
                totalApplicationsReceived) *
                10000
            ) / 100
          : 0;
    }
  }
  // =========================
  // Referral Jobs
  // =========================

  let referralJobs = [];

  try {
    referralJobs = await JobPostingTable.find({
      candidatePosted: onboardingData._id,
      jobType: "Referral",
      approvalStatus: "Approved",
      inactive: false,
    })
      .sort({ createdAt: -1 })
      .lean();
  } catch (error) {
    console.error(
      `Error fetching referral jobs for onboarding ${onboardingData._id}:`,
      error
    );
  }

  onboardingData.referralJobs = referralJobs;
  onboardingData.isHiring =
    referralJobs.length > 0;
  return onboardingData;
};