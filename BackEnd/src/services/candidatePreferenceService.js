import Onboarding from "../models/studentonboardingModel.js";
import { uniqueStrings } from "../utils/jobTextUtils.js";

export const parseTotalExperienceYears = (value = "") => {
  const text = String(value || "").toLowerCase().trim();

  if (!text) return 0;

  if (
    text.includes("fresher") ||
    text.includes("student") ||
    text.includes("0-1") ||
    text.includes("0 to 1") ||
    text.includes("entry")
  ) {
    return 0;
  }

  const number = text.match(/\d+(\.\d+)?/)?.[0];

  return number ? Number(number) : 0;
};

export const mapYearsToExperienceLevel = (years = 0, profileType = "") => {
  if (profileType === "student") return "0-1";
  if (profileType === "fresher") return "0-1";

  if (years <= 1) return "0-1";
  if (years <= 3) return "1-3";
  if (years <= 5) return "3-5";
  if (years <= 10) return "5-10";

  return "10+";
};

const normalizeWorkModeFromOnboarding = (onboarding = {}) => {
  const values = [];

  if (Array.isArray(onboarding.employmentType)) {
    values.push(...onboarding.employmentType);
  }

  if (onboarding.clientLocation) {
    values.push(onboarding.clientLocation);
  }

  if (onboarding.openToShift) {
    values.push(onboarding.openToShift);
  }

  return uniqueStrings(
    values.map((item) => {
      const value = String(item || "").toLowerCase();

      if (value.includes("remote")) return "Remote";
      if (value.includes("hybrid")) return "Hybrid";
      if (
        value.includes("office") ||
        value.includes("onsite") ||
        value.includes("full time")
      ) {
        return "In-Office";
      }

      return item;
    })
  );
};

export const getCandidatePreferencesFromOnboarding = async (userId) => {
  const onboarding = await Onboarding.findOne({ userId }).lean();

  if (!onboarding) {
    throw new Error("Onboarding profile not found for this user");
  }

  const profileType = onboarding.profileType || "";
  const totalYearsNumber = parseTotalExperienceYears(
    onboarding.totalYearsOfExperience
  );

  const experienceLevel = mapYearsToExperienceLevel(
    totalYearsNumber,
    profileType
  );

  return {
    onboardingId: onboarding._id,
    candidateId: onboarding.userId,

    profileType,

    name: onboarding.name || "",
    email: onboarding.email || "",
    phone: onboarding.phone || "",

    preferredRoles: uniqueStrings(onboarding.jobRoles || []),

    jobRoles: uniqueStrings(onboarding.jobRoles || []),

    skills: uniqueStrings([
      ...(onboarding.skills || []),
      ...(onboarding.toolsAndPlatforms || []),
      ...(onboarding.domainKnowledge || []),
    ]),

    locations: uniqueStrings(onboarding.locations || []),

    industries: uniqueStrings(onboarding.industry || []),

    lookingFor: uniqueStrings(onboarding.lookingFor || []),

    employmentType: uniqueStrings(onboarding.employmentType || []),

    workMode: normalizeWorkModeFromOnboarding(onboarding),

    totalYearsOfExperience: onboarding.totalYearsOfExperience || "0",

    totalYearsNumber,

    experienceLevel,

    expectedSalaryCurrency: onboarding.expectedSalaryCurrency || "",
    expectedSalaryAmount: onboarding.expectedSalaryAmount || "",

    currentSalaryCurrency: onboarding.currentSalaryCurrency || "",
    currentSalaryAmount: onboarding.currentSalaryAmount || "",

    currentCompany: onboarding.currentCompany || "",

    education: onboarding.educations || [],
    experiences: onboarding.experiences || [],
  };
};