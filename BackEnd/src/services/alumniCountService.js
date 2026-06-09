import Onboarding from "../models/studentonboardingModel.js";
import { normalizeCompanyName } from "../utils/jobTextUtils.js";

const isCompanyMatched = (currentCompany = "", jobCompanyName = "") => {
  const normalizedCurrentCompany = normalizeCompanyName(currentCompany);
  const normalizedJobCompany = normalizeCompanyName(jobCompanyName);

  if (!normalizedCurrentCompany || !normalizedJobCompany) {
    return false;
  }

  // Strict match only.
  // Airbnb === Airbnb
  // Airbnb Private Limited === Airbnb
  // Airbnb India === Airbnb only if normalizeCompanyName removes "india"
  return normalizedCurrentCompany === normalizedJobCompany;
};

export const getAlumniCountForCompany = async (companyName = "") => {
  if (!companyName) return 0;

  const onboardings = await Onboarding.find({
    currentCompany: {
      $exists: true,
      $nin: ["", null],
    },
  })
    .select("currentCompany")
    .lean();

  let alumniCount = 0;

  for (const onboarding of onboardings) {
    if (isCompanyMatched(onboarding.currentCompany, companyName)) {
      alumniCount += 1;
    }
  }

  return alumniCount;
};

export const attachAlumniCountToJobs = async (jobs = []) => {
  if (!Array.isArray(jobs) || jobs.length === 0) {
    return [];
  }

  const onboardings = await Onboarding.find({
    currentCompany: {
      $exists: true,
      $nin: ["", null],
    },
  })
    .select("currentCompany")
    .lean();

  return jobs.map((job) => {
    const jobCompanyName = job.companyName || "";

    let alumniCount = 0;

    for (const onboarding of onboardings) {
      if (isCompanyMatched(onboarding.currentCompany, jobCompanyName)) {
        alumniCount += 1;
      }
    }

    return {
      ...job,
      alumniCount,
    };
  });
};