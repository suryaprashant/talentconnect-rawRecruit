// services/ticker.service.js

import Application from "../models/applicationModel.js";
import { JobPostingTable } from "../models/jobPostingsModel.js";
import CompanyProfile from "../models/companyDashboard/companyProfileModel.js";
import Onboarding from "../models/studentonboardingModel.js";


// 🔥 helper for "time ago"
const getTimeAgo = (date) => {
  const now = new Date();
  const seconds = Math.floor((now - new Date(date)) / 1000);

  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} mins ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hrs ago`;

  const days = Math.floor(hours / 24);
  return `${days} days ago`;
};

export const getTickerDataService = async () => {
  try {
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [
      applicationsLast24Hours,
      latestJobs,
      latestApplications,
      latestCompany
    ] = await Promise.all([

      // ✅ Applications count
      Application.countDocuments({
        createdAt: { $gte: last24Hours }
      }),

      // ✅ Jobs
      JobPostingTable.find()
        .sort({ createdAt: -1 })
        .limit(2)
        .select("jobTitle jobRoles jobType companyPosted candidatePosted collegePosted createdAt")
        .lean(),

      // ✅ Applications
      Application.find()
        .sort({ createdAt: -1 })
        .limit(2)
        .populate({
          path: "job",
          select: "jobTitle companyPosted candidatePosted collegePosted"
        })
        .select("job applicant createdAt")
        .lean(),

      // ✅ Company onboarding
      CompanyProfile.findOne()
        .sort({ createdAt: -1 })
        .select("companyDetails.companyName createdAt")
        .lean()
    ]);

    // 🔥 Collect IDs for batch fetching
    const companyIds = [];
    const candidateIds = [];

    latestJobs.forEach(job => {
      if (job.companyPosted) companyIds.push(job.companyPosted);
      if (job.candidatePosted) candidateIds.push(job.candidatePosted);
    });

    latestApplications.forEach(app => {
      if (app.job?.companyPosted) companyIds.push(app.job.companyPosted);
      if (app.job?.candidatePosted) candidateIds.push(app.job.candidatePosted);
    });

    // 🔥 Batch fetch
    const [companies, candidates] = await Promise.all([
      CompanyProfile.find({ _id: { $in: companyIds } })
        .select("companyDetails.companyName")
        .lean(),

      Onboarding.find({ _id: { $in: candidateIds } })
        .select("name")
        .lean()
    ]);

    // 🔥 Create lookup maps
    const companyMap = {};
    companies.forEach(c => {
      companyMap[c._id.toString()] = c.companyDetails?.companyName;
    });

    const candidateMap = {};
    candidates.forEach(c => {
      candidateMap[c._id.toString()] = c.name;
    });

    // 🔥 helper to resolve company
    const resolveCompanyName = (job) => {
      if (!job) return "our platform";

      if (job.companyPosted) {
        return companyMap[job.companyPosted.toString()] || "a company";
      }

      if (job.candidatePosted) {
        return candidateMap[job.candidatePosted.toString()] || "a recruiter";
      }

      if (job.collegePosted) {
        return "a college";
      }

      return "our platform";
    };

    const tickerItems = [];

    // 📊 Applications count
    tickerItems.push(
      `📊 ${applicationsLast24Hours} new applications in the last 24 hours`
    );

    // ⚡ Applications
    const formattedApplications = await Promise.all(
      latestApplications.map(async (app) => {
        let name = "Someone";

        try {
          if (app.applicant) {
            const user = await Onboarding.findById(app.applicant)
              .select("name")
              .lean();

            if (user?.name) name = user.name;
          }
        } catch (err) {}

        const jobTitle = app.job?.jobTitle || "a job";
        const company = resolveCompanyName(app.job);
        const timeAgo = getTimeAgo(app.createdAt);

        return `⚡ ${name} applied for ${jobTitle} at ${company} — ${timeAgo}`;
      })
    );

    tickerItems.push(...formattedApplications);

    // 🏢 Jobs
    latestJobs.forEach((job) => {
      const company = resolveCompanyName(job);
      const timeAgo = getTimeAgo(job.createdAt);
      const title = job.jobTitle || job.jobRoles?.[0] || "a job";
      tickerItems.push(
        `🏢 ${company} posted ${title} role for ${job.jobType || "Off-campus"} — ${timeAgo}`
      );
    });

    // 🎉 Company onboarding
    if (latestCompany) {
      const timeAgo = getTimeAgo(latestCompany.createdAt);

      tickerItems.push(
        `🎉 ${latestCompany.companyDetails?.companyName} joined the platform — ${timeAgo}`
      );
    }

    return tickerItems;

  } catch (error) {
    console.error("Ticker Service Error:", error);
    throw error;
  }
};