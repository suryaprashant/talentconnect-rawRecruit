import { normalize } from "../utils/jobTextUtils.js";
import { computeMatchScore } from "./scoringService.js";
import { getMissingSkills } from "./skillExtractionService.js";

const blockedDepartments = [
  "sales",
  "finance",
  "account",
  "accounts",
  "marketing",
  "hr",
  "human resource",
  "legal",
  "admin",
  "customer support",
  "business development",
];

const isWrongDepartment = (job = {}, preferences = {}) => {
  const text = normalize(`${job.title || ""} ${job.department || ""}`);

  const preferredRoles = preferences.preferredRoles || [];

  const candidateWantsBlockedRole = preferredRoles.some((role) => {
    return blockedDepartments.some((blocked) =>
      normalize(role).includes(blocked),
    );
  });

  if (candidateWantsBlockedRole) return false;

  return blockedDepartments.some((blocked) => text.includes(blocked));
};

const hasValidJobUrl = (job = {}) => {
  return Boolean(job.title && job.jobUrl && job.jobId);
};

const parseExperienceRange = (value = "") => {
  const text = normalize(value);

  if (!text) {
    return null;
  }

  if (
    text.includes("fresher") ||
    text.includes("student") ||
    text.includes("entry") ||
    text.includes("graduate") ||
    text.includes("intern") ||
    text.includes("0-1") ||
    text.includes("0 to 1")
  ) {
    return {
      min: 0,
      max: 1,
    };
  }

  if (text.includes("10+")) {
    return {
      min: 10,
      max: Infinity,
    };
  }

  const numbers = text.match(/\d+(\.\d+)?/g)?.map(Number) || [];

  if (numbers.length === 1) {
    return {
      min: numbers[0],
      max: numbers[0],
    };
  }

  if (numbers.length >= 2) {
    return {
      min: numbers[0],
      max: numbers[1],
    };
  }

  return null;
};

const isExperienceMatched = (job = {}, preferences = {}) => {
  const candidateExperience =
    preferences.totalYearsOfExperience ||
    preferences.totalYearsNumber ||
    preferences.experienceLevel ||
    "";

  const jobExperience =
    job.experienceRequired || job.experienceLevel || job.experience || "";

  const candidateRange = parseExperienceRange(candidateExperience);
  const jobRange = parseExperienceRange(jobExperience);

  // If job does not mention experience, do not reject it.
  if (!jobRange) {
    return true;
  }

  // If candidate experience missing, do not reject it.
  if (!candidateRange) {
    return true;
  }

  return (
    candidateRange.min <= jobRange.max && candidateRange.max >= jobRange.min
  );
};

export const filterAndScoreJobs = (jobs = [], preferences = {}) => {
  return jobs
    .filter(hasValidJobUrl)
    .filter((job) => !isWrongDepartment(job, preferences))
    .map((job) => {
      const { matchScore, scoreBreakdown, matchedSkills } = computeMatchScore(
        job,
        preferences,
      );

      const missingSkills = getMissingSkills(
        job.requiredSkills || [],
        matchedSkills,
      );

      return {
        ...job,
        matchScore,
        scoreBreakdown,
        matchedSkills,
        missingSkills,
      };
    })
    .filter((job) => {
      return isExperienceMatched(job, preferences);
    })
    .filter((job) => {
      return job.matchScore > 20;
    })
    .sort((a, b) => {
      if ((b.alumniCount || 0) !== (a.alumniCount || 0)) {
        return (b.alumniCount || 0) - (a.alumniCount || 0);
      }

      return (b.matchScore || 0) - (a.matchScore || 0);
    })
    .slice(0, 5);
};
