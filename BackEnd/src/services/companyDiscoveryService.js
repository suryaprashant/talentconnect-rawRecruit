import DiscoveredJob from "../models/DiscoveredJob.js";
import { detectATS } from "./atsDetectionService.js";
import { getCandidatePreferencesFromOnboarding } from "./candidatePreferenceService.js";
import { filterAndScoreJobs } from "./jobFilterService.js";
import { fetchGreenhouseJobs } from "./fetchers/greenhouseFetcher.js";
import { fetchLeverJobs } from "./fetchers/leverFetcher.js";
import { createCompanySlug } from "../utils/jobTextUtils.js";
import { attachAlumniCountToJobs } from "./alumniCountService.js";

const DEBUG_DISCOVERY = true;

const debugLog = (message, data = {}) => {
  if (DEBUG_DISCOVERY) {
    console.log(`[DISCOVERY_DEBUG] ${message}`, data);
  }
};

const fetchJobsByATS = async (companyATS) => {
  if (companyATS.atsType === "greenhouse") {
    return fetchGreenhouseJobs(
      companyATS.greenhouseSlug || companyATS.companySlug,
      companyATS.companyName
    );
  }

  if (companyATS.atsType === "lever") {
    return fetchLeverJobs(
      companyATS.leverSlug || companyATS.companySlug,
      companyATS.companyName
    );
  }

  return [];
};

const normalizeAtsSource = (atsSource = "") => {
  const value = String(atsSource || "").toLowerCase();

  if (value === "greenhouse") return "Greenhouse";
  if (value === "lever") return "Lever";
  if (value === "workday") return "Workday";

  return "Custom";
};

const normalizeDateOrNull = (value) => {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
};

const prepareJobForFrontend = ({
  job,
  companyATS,
  companyName,
  preferences,
}) => {
  const companySlug = companyATS.companySlug || createCompanySlug(companyName);

  return {
    companySlug,
    companyName: companyATS.companyName || companyName,
    companyNormalized:
      companyATS.companyNormalized ||
      `${createCompanySlug(companyName).toUpperCase()}_CANONICAL`,

    title: job.title || job.jobTitle || "",
    jobUrl: job.jobUrl || job.applyUrl || job.applicationUrl || job.url || "",
    applyUrl: job.applyUrl || job.jobUrl || job.applicationUrl || job.url || "",

    location: job.location || "",
    workMode: job.workMode || "",
    department: job.department || "",

    jdSnippet: job.jdSnippet || "",
    description: job.description || "",

    requiredSkills: Array.isArray(job.requiredSkills) ? job.requiredSkills : [],
    matchedSkills: Array.isArray(job.matchedSkills) ? job.matchedSkills : [],
    missingSkills: Array.isArray(job.missingSkills) ? job.missingSkills : [],

    experienceRequired:
      job.experienceRequired ||
      job.experienceLevel ||
      job.experience ||
      "",

    salaryRange: job.salaryRange || "",
    postedDate: job.postedDate || null,

    jobId: String(job.jobId || job.id || job._id || ""),
    atsSource: normalizeAtsSource(job.atsSource || companyATS.atsType),

    matchScore: job.matchScore || 0,
    scoreBreakdown: job.scoreBreakdown || {},

    alumniCount: job.alumniCount || 0,
    totalEmployeeCount: job.totalEmployeeCount || 0,

    onboardingId: preferences?.onboardingId || null,

    referralRequested: false,
  };
};

export const discoverCompanyJobsForCandidate = async ({
  userId,
  companyName,
}) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!companyName) {
    throw new Error("Company name is required");
  }

  debugLog("DISCOVERY STARTED", {
    userId,
    companyName,
  });

  const preferences = await getCandidatePreferencesFromOnboarding(userId);

  debugLog("PREFERENCES FOUND", {
    onboardingId: preferences?.onboardingId,
    profileType: preferences?.profileType,
    totalYearsOfExperience: preferences?.totalYearsOfExperience,
    experienceLevel: preferences?.experienceLevel,
    skillsCount: preferences?.skills?.length || 0,
  });

  const companyATS = await detectATS(companyName);

  debugLog("ATS DETECTED", companyATS);

  if (!companyATS || companyATS.atsType === "unknown") {
    return {
      companyName,
      atsType: "unknown",
      totalFetched: 0,
      totalMatched: 0,
      jobs: [],
      message: "Could not detect supported ATS for this company",
    };
  }

  const fetchedJobs = await fetchJobsByATS(companyATS);

  debugLog("JOBS FETCHED", {
    totalFetched: fetchedJobs.length,
  });

  const scoredJobs = filterAndScoreJobs(fetchedJobs, preferences);

  debugLog("JOBS AFTER FILTER SCORE EXPERIENCE", {
    totalScored: scoredJobs.length,
    jobs: scoredJobs.map((job) => ({
      title: job.title,
      jobId: job.jobId,
      matchScore: job.matchScore,
      experienceRequired: job.experienceRequired,
    })),
  });

  const jobsWithAlumniCount = await attachAlumniCountToJobs(scoredJobs);

  debugLog("JOBS AFTER ALUMNI COUNT", {
    total: jobsWithAlumniCount.length,
  });

  const rankedJobs = jobsWithAlumniCount
    .sort((a, b) => {
      if ((b.alumniCount || 0) !== (a.alumniCount || 0)) {
        return (b.alumniCount || 0) - (a.alumniCount || 0);
      }

      return (b.matchScore || 0) - (a.matchScore || 0);
    })
    .slice(0, 5)
    .map((job) =>
      prepareJobForFrontend({
        job,
        companyATS,
        companyName,
        preferences,
      })
    );

  debugLog("FINAL RANKED JOBS RETURNED TO FRONTEND WITHOUT SAVE", {
    total: rankedJobs.length,
    jobs: rankedJobs.map((job) => ({
      title: job.title,
      jobId: job.jobId,
      matchScore: job.matchScore,
      alumniCount: job.alumniCount || 0,
      experienceRequired: job.experienceRequired,
    })),
  });

  return {
    companyName: companyATS.companyName || companyName,
    companySlug: companyATS.companySlug || createCompanySlug(companyName),
    atsType: companyATS.atsType,
    candidateProfileType: preferences.profileType,
    candidateExperience: preferences.totalYearsOfExperience,
    candidateExperienceLevel: preferences.experienceLevel,
    totalFetched: fetchedJobs.length,
    totalMatched: rankedJobs.length,
    jobs: rankedJobs,
  };
};

export const saveSelectedDiscoveredJob = async ({ userId, job }) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!job) {
    throw new Error("Job data is required");
  }

  const title = String(job.title || job.jobTitle || "").trim();

  const jobUrl = String(
    job.jobUrl || job.applyUrl || job.applicationUrl || job.url || ""
  ).trim();

  const jobId = String(job.jobId || job.id || job._id || "").trim();

  const companyName = String(job.companyName || "").trim();

  const companySlug = String(
    job.companySlug || createCompanySlug(companyName)
  ).trim();

  const atsSource = normalizeAtsSource(job.atsSource);

  if (!title) {
    throw new Error("Job title is required");
  }

  if (!jobUrl) {
    throw new Error("Job URL is required");
  }

  if (!jobId) {
    throw new Error("Job ID is required");
  }

  if (!companyName) {
    throw new Error("Company name is required");
  }

  if (!companySlug) {
    throw new Error("Company slug is required");
  }

  const preferences = await getCandidatePreferencesFromOnboarding(userId);

  const payload = {
    candidateId: userId,
    onboardingId: preferences?.onboardingId || job.onboardingId || null,

    companySlug,
    companyName,
    companyNormalized:
      job.companyNormalized ||
      `${createCompanySlug(companyName).toUpperCase()}_CANONICAL`,

    title,
    jobUrl,
    applyUrl: job.applyUrl || jobUrl,

    location: job.location || "",
    workMode: job.workMode || "",
    department: job.department || "",

    jdSnippet: job.jdSnippet || "",
    description: job.description || "",

    requiredSkills: Array.isArray(job.requiredSkills) ? job.requiredSkills : [],
    matchedSkills: Array.isArray(job.matchedSkills) ? job.matchedSkills : [],
    missingSkills: Array.isArray(job.missingSkills) ? job.missingSkills : [],

    experienceRequired: job.experienceRequired || "",
    salaryRange: job.salaryRange || "",
    postedDate: normalizeDateOrNull(job.postedDate),

    jobId,
    atsSource,

    matchScore: Number(job.matchScore || 0),
    scoreBreakdown: job.scoreBreakdown || {},

    alumniCount: Number(job.alumniCount || 0),
    totalEmployeeCount: Number(job.totalEmployeeCount || 0),

    discoveredAt: new Date(),
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),

    isActive: true,
    referralRequested: Boolean(job.referralRequested || false),
    referralRequestId: job.referralRequestId || undefined,
  };

  debugLog("SAVING SELECTED DISCOVERED JOB", {
    candidateId: payload.candidateId,
    companySlug: payload.companySlug,
    jobId: payload.jobId,
    atsSource: payload.atsSource,
    title: payload.title,
  });

  const savedJob = await DiscoveredJob.findOneAndUpdate(
    {
      candidateId: payload.candidateId,
      companySlug: payload.companySlug,
      jobId: payload.jobId,
      atsSource: payload.atsSource,
    },
    {
      $set: payload,
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
      runValidators: true,
    }
  ).lean();

  return savedJob;
};