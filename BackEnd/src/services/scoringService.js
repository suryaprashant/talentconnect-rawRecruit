import { normalize } from "../utils/jobTextUtils.js";
import { getMatchedSkills } from "./skillExtractionService.js";
import { parseTotalExperienceYears } from "./candidatePreferenceService.js";

const EXPERIENCE_LEVELS = ["0-1", "1-3", "3-5", "5-10", "10+"];

const roleSynonyms = {
  "backend developer": [
    "backend",
    "back end",
    "server side",
    "api",
    "node",
    "node.js",
    "java",
    "spring boot",
    "software engineer",
    "software developer",
    "sde",
  ],
  "software engineer": [
    "software engineer",
    "software developer",
    "developer",
    "sde",
    "application developer",
    "engineer",
  ],
  "software developer": [
    "software developer",
    "software engineer",
    "developer",
    "sde",
    "application developer",
    "engineer",
  ],
  "frontend developer": [
    "frontend",
    "front end",
    "react",
    "next.js",
    "javascript",
    "ui engineer",
  ],
  "full stack developer": [
    "full stack",
    "mern",
    "mean",
    "frontend",
    "backend",
    "react",
    "node",
  ],
  "ai engineer": [
    "ai engineer",
    "machine learning",
    "ml engineer",
    "rag",
    "llm",
    "python",
    "data scientist",
  ],
};

export const parseExperienceLevel = (value = "") => {
  const text = normalize(value);

  if (!text) return "";

  if (
    text.includes("fresher") ||
    text.includes("student") ||
    text.includes("graduate") ||
    text.includes("entry") ||
    text.includes("0-1") ||
    text.includes("0 to 1")
  ) {
    return "0-1";
  }

  if (text.includes("10+")) return "10+";

  const number = text.match(/\d+(\.\d+)?/)?.[0];

  if (!number) return "";

  const years = Number(number);

  if (years <= 1) return "0-1";
  if (years <= 3) return "1-3";
  if (years <= 5) return "3-5";
  if (years <= 10) return "5-10";

  return "10+";
};

const calculateSkillScore = (job = {}, preferences = {}) => {
  const requiredSkills = job.requiredSkills || [];
  const candidateSkills = preferences.skills || [];

  if (!requiredSkills.length) {
    return {
      score: 10,
      matchedSkills: [],
    };
  }

  const matchedSkills = getMatchedSkills(requiredSkills, candidateSkills);

  const score = Math.round((matchedSkills.length / requiredSkills.length) * 40);

  return {
    score: Math.min(score, 40),
    matchedSkills,
  };
};

const calculateRoleScore = (job = {}, preferences = {}) => {
  const preferredRoles = preferences.preferredRoles || preferences.jobRoles || [];

  if (!preferredRoles.length) return 10;

  const titleText = normalize(`${job.title || ""} ${job.department || ""}`);

  const matched = preferredRoles.some((role) => {
    const normalizedRole = normalize(role);

    if (!normalizedRole) return false;

    if (titleText.includes(normalizedRole)) return true;

    const synonyms = roleSynonyms[normalizedRole] || [];

    return synonyms.some((synonym) => titleText.includes(normalize(synonym)));
  });

  return matched ? 15 : 0;
};

const calculateExperienceScore = (job = {}, preferences = {}) => {
  const candidateLevel =
    preferences.experienceLevel ||
    parseExperienceLevel(preferences.totalYearsOfExperience);

  const jobLevel = parseExperienceLevel(job.experienceRequired);

  if (!jobLevel || !candidateLevel) return 15;

  const candidateIndex = EXPERIENCE_LEVELS.indexOf(candidateLevel);
  const jobIndex = EXPERIENCE_LEVELS.indexOf(jobLevel);

  if (candidateIndex === -1 || jobIndex === -1) return 15;

  if (candidateIndex === jobIndex) return 25;

  if (Math.abs(candidateIndex - jobIndex) === 1) return 12;

  if (candidateIndex > jobIndex) return 20;

  return 0;
};

const calculateLocationScore = (job = {}, preferences = {}) => {
  const locations = preferences.locations || [];

  if (!locations.length) return 10;

  const jobLocation = normalize(job.location);

  if (jobLocation.includes("remote")) return 15;

  const matched = locations.some((location) => {
    const preferredLocation = normalize(location);

    return (
      jobLocation.includes(preferredLocation) ||
      preferredLocation.includes(jobLocation)
    );
  });

  return matched ? 20 : 0;
};

const calculateWorkModeScore = (job = {}, preferences = {}) => {
  const preferredModes = preferences.workMode || [];

  if (!preferredModes.length) return 5;

  const jobMode = normalize(job.workMode);

  const matched = preferredModes.some((mode) => {
    const preferredMode = normalize(mode);

    return jobMode.includes(preferredMode) || preferredMode.includes(jobMode);
  });

  return matched ? 10 : 0;
};

const calculateCandidateTypeScore = (job = {}, preferences = {}) => {
  const profileType = normalize(preferences.profileType);
  const text = normalize(
    `${job.title || ""} ${job.department || ""} ${job.jdSnippet || ""} ${
      job.description || ""
    }`
  );

  if (profileType === "student") {
    if (
      text.includes("intern") ||
      text.includes("internship") ||
      text.includes("graduate") ||
      text.includes("fresher") ||
      text.includes("entry level") ||
      text.includes("trainee") ||
      text.includes("campus") ||
      text.includes("0-1") ||
      text.includes("0 to 1")
    ) {
      return 10;
    }

    return -20;
  }

  if (profileType === "fresher") {
    if (
      text.includes("fresher") ||
      text.includes("entry level") ||
      text.includes("graduate") ||
      text.includes("0-1") ||
      text.includes("0 to 1") ||
      text.includes("trainee")
    ) {
      return 10;
    }

    const candidateYears = parseTotalExperienceYears(
      preferences.totalYearsOfExperience
    );

    return candidateYears <= 1 ? 5 : 0;
  }

  if (profileType === "professional") {
    if (text.includes("internship") || text.includes("intern only")) {
      return -20;
    }

    return 5;
  }

  return 0;
};

export const computeMatchScore = (job = {}, preferences = {}) => {
  const skillResult = calculateSkillScore(job, preferences);

  const scoreBreakdown = {
    skills: skillResult.score,
    role: calculateRoleScore(job, preferences),
    experience: calculateExperienceScore(job, preferences),
    location: calculateLocationScore(job, preferences),
    workMode: calculateWorkModeScore(job, preferences),
    candidateType: calculateCandidateTypeScore(job, preferences),
  };

  const total =
    scoreBreakdown.skills +
    scoreBreakdown.role +
    scoreBreakdown.experience +
    scoreBreakdown.location +
    scoreBreakdown.workMode +
    scoreBreakdown.candidateType;

  return {
    matchScore: Math.max(0, Math.min(100, total)),
    scoreBreakdown,
    matchedSkills: skillResult.matchedSkills,
  };
};