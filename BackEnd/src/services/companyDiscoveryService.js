import DiscoveredJob from "../models/DiscoveredJob.js";
import { detectATS } from "./atsDetectionService.js";
import { getCandidatePreferencesFromOnboarding } from "./candidatePreferenceService.js";
import { filterAndScoreJobs } from "./jobFilterService.js";
import { fetchGreenhouseJobs } from "./fetchers/greenhouseFetcher.js";
import { fetchLeverJobs } from "./fetchers/leverFetcher.js";
import { createCompanySlug } from "../utils/jobTextUtils.js";
import { attachAlumniCountToJobs } from "./alumniCountService.js";

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
  preferences,
  companyATS,
  companyName,
}) => {
  const savedJobs = [];

  for (const job of jobs) {
    const payload = {
      candidateId: preferences.candidateId,
      onboardingId: preferences.onboardingId,

      companySlug: companyATS.companySlug || createCompanySlug(companyName),
      companyName: companyATS.companyName || companyName,
      companyNormalized:
        companyATS.companyNormalized ||
        `${createCompanySlug(companyName).toUpperCase()}_CANONICAL`,

      title: job.title,
      jobUrl: job.jobUrl,
      applyUrl: job.applyUrl,
      location: job.location,
      workMode: job.workMode,
      department: job.department,

      jdSnippet: job.jdSnippet,
      description: job.description,

      requiredSkills: job.requiredSkills || [],
      matchedSkills: job.matchedSkills || [],
      missingSkills: job.missingSkills || [],

      experienceRequired: job.experienceRequired,
      salaryRange: job.salaryRange,
      postedDate: job.postedDate ? new Date(job.postedDate) : null,

      jobId: job.jobId,
      atsSource: job.atsSource,

      matchScore: job.matchScore,
      scoreBreakdown: job.scoreBreakdown,

      alumniCount: job.alumniCount || 0,
      totalEmployeeCount: job.totalEmployeeCount || 0,

      discoveredAt: new Date(),
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      isActive: true,
    };

    const saved = await DiscoveredJob.findOneAndUpdate(
      {
        candidateId: payload.candidateId,
        companySlug: payload.companySlug,
        jobId: payload.jobId,
        atsSource: payload.atsSource,
      },
      payload,
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    savedJobs.push(saved);
  }

  return savedJobs;
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

  const preferences = await getCandidatePreferencesFromOnboarding(userId);

  const companyATS = await detectATS(companyName);

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

  const scoredJobs = filterAndScoreJobs(fetchedJobs, preferences);

  const jobsWithAlumniCount = await attachAlumniCountToJobs(scoredJobs);

  const rankedJobs = jobsWithAlumniCount.sort((a, b) => {
    if ((b.alumniCount || 0) !== (a.alumniCount || 0)) {
      return (b.alumniCount || 0) - (a.alumniCount || 0);
    }

    return (b.matchScore || 0) - (a.matchScore || 0);
  });

  const savedJobs = await saveDiscoveredJobs({
    jobs: rankedJobs,
    preferences,
    companyATS,
    companyName,
  });

  return {
    companyName: companyATS.companyName,
    companySlug: companyATS.companySlug,
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

  return DiscoveredJob.find(query)
    .sort({ alumniCount: -1, matchScore: -1, createdAt: -1 })
    .lean();
};