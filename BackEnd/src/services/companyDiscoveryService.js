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

const saveDiscoveredJobs = async ({
  jobs,
  userId,
  preferences,
  companyATS,
  companyName,
}) => {
  if (!Array.isArray(jobs) || jobs.length === 0) {
    debugLog("NO JOBS TO SAVE");
    return [];
  }

  const companySlug = companyATS.companySlug || createCompanySlug(companyName);

  const savedJobs = await Promise.all(
    jobs.map(async (job) => {
      const payload = {
        candidateId: userId,
        onboardingId: preferences.onboardingId || null,

        companySlug,
        companyName: companyATS.companyName || companyName,
        companyNormalized:
          companyATS.companyNormalized ||
          `${createCompanySlug(companyName).toUpperCase()}_CANONICAL`,

        title: job.title || job.jobTitle || "",
        jobUrl: job.jobUrl || job.applyUrl || job.applicationUrl || job.url || "",
        applyUrl: job.applyUrl || job.jobUrl || "",
        location: job.location || "",
        workMode: job.workMode || "",
        department: job.department || "",

        jdSnippet: job.jdSnippet || "",
        description: job.description || "",

        requiredSkills: job.requiredSkills || [],
        matchedSkills: job.matchedSkills || [],
        missingSkills: job.missingSkills || [],

        experienceRequired:
          job.experienceRequired ||
          job.experienceLevel ||
          job.experience ||
          "",

        salaryRange: job.salaryRange || "",
        postedDate: job.postedDate ? new Date(job.postedDate) : null,

        jobId: String(job.jobId || job.id || job._id || ""),
        atsSource: job.atsSource || companyATS.atsType,

        matchScore: job.matchScore || 0,
        scoreBreakdown: job.scoreBreakdown || {},

        alumniCount: job.alumniCount || 0,
        totalEmployeeCount: job.totalEmployeeCount || 0,

        discoveredAt: new Date(),
        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        isActive: true,
      };

      debugLog("SAVING JOB", {
        candidateId: payload.candidateId,
        title: payload.title,
        jobId: payload.jobId,
        matchScore: payload.matchScore,
        experienceRequired: payload.experienceRequired,
      });

      return DiscoveredJob.findOneAndUpdate(
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
    })
  );

  return savedJobs.filter(Boolean);
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
    .slice(0, 5);

  debugLog("FINAL RANKED JOBS BEFORE SAVE", {
    total: rankedJobs.length,
    jobs: rankedJobs.map((job) => ({
      title: job.title,
      jobId: job.jobId,
      matchScore: job.matchScore,
      alumniCount: job.alumniCount || 0,
      experienceRequired: job.experienceRequired,
    })),
  });

  const savedJobs = await saveDiscoveredJobs({
    jobs: rankedJobs,
    userId,
    preferences,
    companyATS,
    companyName,
  });

  debugLog("SAVED JOBS", {
    totalSaved: savedJobs.length,
    jobs: savedJobs.map((job) => ({
      title: job.title,
      jobId: job.jobId,
      matchScore: job.matchScore,
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
    totalMatched: savedJobs.length,
    jobs: savedJobs,
  };
};

export const getSavedDiscoveredJobs = async ({ userId, companyName }) => {
  const query = {
    candidateId: userId,
    isActive: true,
    expiresAt: { $gt: new Date() },
  };

  if (companyName) {
    query.companySlug = createCompanySlug(companyName);
  }

  debugLog("GET SAVED DISCOVERED JOBS QUERY", query);

  const jobs = await DiscoveredJob.find(query)
    .sort({ alumniCount: -1, matchScore: -1, createdAt: -1 })
    .lean();

  debugLog("GET SAVED DISCOVERED JOBS RESULT", {
    total: jobs.length,
  });

  return jobs;
};