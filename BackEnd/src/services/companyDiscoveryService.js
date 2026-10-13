
import { detectATS } from "./atsDetectionService.js";
import { getCandidatePreferencesFromOnboarding } from "./candidatePreferenceService.js";
import { filterAndScoreJobs } from "./jobFilterService.js";
import { fetchGreenhouseJobs } from "./fetchers/greenhouseFetcher.js";
import { fetchLeverJobs } from "./fetchers/leverFetcher.js";
import { createCompanySlug } from "../utils/jobTextUtils.js";
import { attachAlumniCountToJobs } from "./alumniCountService.js";



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

