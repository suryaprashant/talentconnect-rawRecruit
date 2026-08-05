import mongoose from "mongoose";
import { JobPostingTable } from "../models/jobPostingsModel.js";
import Application from "../models/applicationModel.js";
import OnboardingModel from "../models/studentonboardingModel.js";
import { getStudentService } from "./studentService.js";
import {
  fetchWeights,
  fetchThreshold,
  scoreJob,
  logConfig,
} from "../utils/relevancyEngine.js";
import { paginatedResponse } from "../utils/paginate.js";
import { fetchMetricsForJob } from "../controllers/studentDashboard/studentDashboardController.js";
import {
  buildCollegeAlumniQuery,
  buildCompanyAlumniQuery,
} from "../services/entityQueryService.js";

import { resolveCompany } from "../services/normalizationService.js";
export const getProfessionalReferralsService = async (userId) => {
  try {
    // Step 1:
    // Get the student/onboarding profile first
    const authUserId = userId;
    const userProfile = await getStudentService(authUserId);
    const onboardingId = userProfile?.data?._id;

    if (!onboardingId) {
      console.log("No onboarding profile found for this user.");
      return [];
    }

    console.log("Searching for jobs with candidatePosted ID:", onboardingId);

    // Step 2: Query using the onboardingId found in your Compass screenshot
    return await JobPostingTable.find({
      candidatePosted: onboardingId,
      jobType: "Referral",
    })
      .sort({ createdAt: -1 })
      .lean();
  } catch (error) {
    console.error("Service Error:", error.message);
    throw error;
  }
};

// get totel job posted and it is in active state
export const getTotalJobPostedCount = async (filters = {}) => {
  try {
    //  Default filter (current implementation)
    const query = { jobStatus: "Open" };

    //  Optional filter by jobType (string field)
    if (filters.jobType) {
      query.jobType = filters.jobType;
    }

    const totalJobs = await JobPostingTable.countDocuments(query);
    return totalJobs;
  } catch (error) {
    console.error("Error in getTotalJobPostedCount:", error.message);
    throw new Error("Failed to get total job posted count");
  }
};

// get all data with application count
export const getAll = async () => {
  try {
    // Fetch job postings with populated fields
    const jobs = await JobPostingTable.find()
      .populate({
        path: "candidatePosted",
        select: "name",
      })
      .populate({
        path: "companyPosted",
        select: "name",
      })
      .populate({
        path: "collegePosted",
        select: "name",
      })
      .lean(); // Use lean() to get plain JS objects instead of Mongoose docs

    // Get all application counts grouped by job
    const applicationCounts = await Application.aggregate([
      {
        $group: {
          _id: "$job",
          totalApplications: { $sum: 1 },
        },
      },
    ]);

    // Convert counts to a lookup object for fast mapping
    const countsMap = {};
    applicationCounts.forEach((item) => {
      countsMap[item._id.toString()] = item.totalApplications;
    });

    // Add applicationCount field to each job
    const jobsWithCount = jobs.map((job) => ({
      ...job,
      applicationCount: countsMap[job._id.toString()] || 0,
    }));

    return jobsWithCount;
  } catch (error) {
    console.error("❌ Error in getAll service:", error.message);
    throw new Error("Failed to fetch job postings from the database");
  }
};

export const createPostingService = async (postingData, authUserId) => {
  try {
    const enhancedPostingData = {
      ...postingData,
      postedByUser: authUserId,
    };

    const newPosting = new JobPostingTable(enhancedPostingData);

    const savedPosting = await newPosting.save();

    return savedPosting;
  } catch (error) {
    console.error("Error in createPostingService:", error.message);
    throw error;
  }
};

export const getJobPostingsByJobTypeService = async (
  jobType,
  userId,
  studentProfile = null,
) => {
  try {
    const postings = await JobPostingTable.find({ jobType })
      .populate({
        path: "companyPosted",
        select:
          "companyDetails profileImage profileImageUrl name hiringPreferences", // companyDetails is already in companyPosted
      })
      .lean();

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    let processedPostings = postings.map((posting) => {
      let status = posting.jobStatus;
      if (posting?.startDate && posting?.endDate) {
        const startDate = new Date(posting?.startDate);
        const endDate = new Date(posting?.endDate);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);

        if (currentDate < startDate) status = "Pending";
        else if (currentDate >= startDate && currentDate <= endDate)
          status = "Open";
        else status = "Closed";
      }
      return { ...posting, jobStatus: status };
    });

    // --- STEP 2: Applied Jobs Filter ---
    if (userId) {
      let applicantId;
      if (studentProfile && studentProfile._id) {
        applicantId = studentProfile._id;
      } else {
        if (mongoose.Types.ObjectId.isValid(userId)) {
          applicantId = userId;
        } else {
          const student = await OnboardingModel.findOne({ userId })
            .select("_id")
            .lean();
          applicantId = student ? student._id : userId;
        }
      }

      const jobIds = processedPostings.map((p) => p._id);
      const applications = await Application.find({
        applicant: applicantId,
        job: { $in: jobIds },
      })
        .select("job")
        .lean();

      const appliedJobIds = new Set(applications.map((a) => String(a.job)));
      processedPostings = processedPostings.filter(
        (p) => !appliedJobIds.has(String(p._id)),
      );
    }

    // DEBUG: Log what we're getting
    // if (processedPostings.length > 0) {
    //   console.log("Sample posting company data:", {
    //     hasCompanyPosted: !!processedPostings[0].companyPosted,
    //     companyPostedKeys: processedPostings[0].companyPosted
    //       ? Object.keys(processedPostings[0].companyPosted)
    //       : "none",
    //     companyDetails: processedPostings[0].companyPosted?.companyDetails,
    //     companyName:
    //       processedPostings[0].companyPosted?.companyDetails?.companyName,
    //   });
    // }

    return processedPostings;
  } catch (error) {
    console.error("Error in getJobPostingsByJobTypeService:", error.message);
    throw error;
  }
};

// export const getReferralJobsService = async (jobType, candidatePostedId) => {
//     try {
//         const response = await JobPostingTable.find({
//             jobType: jobType,
//             approvalStatus: "Approved",
//             candidatePosted: { $ne: candidatePostedId }
//         })
//             .populate('candidatePosted')
//             .lean()
//             .sort({ createdAt: -1 });

//         // If userId provided, filter out jobs the user already applied for
//         if (candidatePostedId) {
//             try {
//                 let applicantId = candidatePostedId;

//                 if (!applicantId) {
//                     try {
//                         applicantId = new mongoose.Types.ObjectId(userId);
//                     } catch (e) {
//                         applicantId = userId;
//                     }
//                 }

//                 const jobIds = response.map(r => r._id);
//                 const applications = await Application.find({ applicant: applicantId, job: { $in: jobIds } }).select('job').lean();
//                 const appliedJobIds = new Set(applications.map(a => String(a.job)));
//                 const filtered = response.filter(r => !appliedJobIds.has(String(r._id)));
//                 return filtered;
//             } catch (err) {
//                 console.error('Error filtering referral jobs by applications:', err);
//                 return { success: true, response };
//             }
//         }

//         return response;
//     } catch (error) {
//         console.log("Error: ", error.message);
//         throw new Error("Failed to fetch");
//     }
// }

// ─── snippet: getReferralJobsService  (replace the existing function) ────────
// Full imports at the top of your jobPostingService.js already include
// fetchWeights, fetchThreshold, scoreJob, logConfig from relevancyEngine.js
// ─────────────────────────────────────────────────────────────────────────────

export const getReferralJobsService = async (
  candidatePostedId,
  userId,
  pagination,
) => {
  // ── STEP 1: Threshold (weights are fetched AFTER we know the profile type) ─
  const thresholdConfig = await fetchThreshold();
  const visibilityThreshold = thresholdConfig.value;
  const { page, limit, skip } = pagination;
  // ── STEP 2: Student profile + applied jobs ───────────────────────────────
  const student = userId
    ? await OnboardingModel.findOne({ userId }).lean()
    : null;

  const appliedJobIds = student
    ? await Application.find({ applicant: student._id }).distinct("job")
    : [];

  // ── STEP 3: Fetch weights from the correct DB collection ─────────────────
  // Now that we have the student doc we know their profileType, so we can
  // query the right RelevancyWeights model (professional vs student).
  const W = await fetchWeights(student?.profileType ?? "student");

  logConfig(W, thresholdConfig, "REFERRAL JOBS ENGINE");

  // ── STEP 4: DB query ─────────────────────────────────────────────────────
  const query = {
    jobType: "Referral",
    approvalStatus: "Approved",
    candidatePosted: { $ne: candidatePostedId },
    ...(appliedJobIds.length > 0 && { _id: { $nin: appliedJobIds } }),
  };

  const jobs = await JobPostingTable.find(query)
    .populate({
      path: "candidatePosted",
      select: "_id userId name email currentCompany",
    })
    .populate("companyPosted")
    .lean()
    .sort({ createdAt: -1 });

  // ── STEP 5: Guest — no profile, return unscored ──────────────────────────
  if (!student) {
    return jobs
      .map((job) => ({
        ...job,
        matchScore: 0,
        companyName: job.candidatePosted?.name || "Unknown",
      }))
      .filter((job) => job.matchScore >= visibilityThreshold);
  }

  // ── STEP 6: Score every job (W already resolved for this profile type) ───
  const scoredJobs = jobs.map((job, i) =>
    scoreJob(job, student, W, i, "Referral Job"),
  );

  const enrichedJobs = await Promise.all(
    scoredJobs.map(async (job) => {
      let alumniCount = 0;

      const companyName =
        job.candidatePosted?.currentCompany ||
        job.companyPosted?.companyDetails?.companyName;

      if (companyName) {
        try {
          const studentColleges = [
            ...new Set(
              (student?.educations || [])
                .map((edu) => edu.college)
                .filter(Boolean),
            ),
          ];

          const studentCompanies = [];
          if (student?.currentCompany)
            studentCompanies.push(student.currentCompany);
          student?.experiences?.forEach((exp) => {
            if (exp.company) studentCompanies.push(exp.company);
          });

          const uniqueStudentCompanies = [
            ...new Map(
              studentCompanies.map((c) => [c.toLowerCase(), c]),
            ).values(),
          ];

          const companyRegex = new RegExp(
            `^${companyName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
            "i",
          );

          const sharedCompanyConditions = uniqueStudentCompanies.flatMap(
            (company) => {
              const regex = new RegExp(
                `^${company.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
                "i",
              );
              return [
                { currentCompany: regex },
                { "experiences.company": regex },
              ];
            },
          );

          alumniCount = await OnboardingModel.countDocuments({
            userId: { $ne: userId },
            //profileType: "professional",
            $and: [
              {
                $or: [
                  {
                    educations: {
                      $elemMatch: {
                        college: {
                          $in: studentColleges.map(
                            (college) =>
                              new RegExp(
                                `^${college.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
                                "i",
                              ),
                          ),
                        },
                      },
                    },
                  },
                  ...sharedCompanyConditions,
                ],
              },
              {
                $or: [
                  { currentCompany: companyRegex },
                  { "experiences.company": companyRegex },
                ],
              },
            ],
          });
        } catch (err) {
          console.error(
            `[ALUMNI] Failed to count for ${companyName}:`,
            err.message,
          );
        }
      }
      const metrics = await fetchMetricsForJob(job._id);
      return { ...job, alumniCount, metrics };
    }),
  );

  // ── STEP 7: Threshold filter + sort ──────────────────────────────────────
  const belowThreshold = enrichedJobs.filter(
    (j) => j.matchScore < visibilityThreshold,
  ).length;

  const filteredJobs = enrichedJobs
    .filter((j) => j.matchScore >= visibilityThreshold)
    .sort((a, b) => b.matchScore - a.matchScore);

  const total = filteredJobs.length;

  const paginatedJobs = filteredJobs.slice(skip, skip + limit).map((job) => {
    const {
      _scoreBreakdown,
      _gateMultiplier,
      _skillMatchPct,
      _profileType,
      ...cleanJob
    } = job;

    return cleanJob;
  });

  return paginatedResponse(paginatedJobs, total, {
    page,
    limit,
  });
};
export const getReferralJobsCursorService = async (
  candidatePostedId,
  userId,
  { limit = 10, cursor = null },
) => {
  const thresholdConfig = await fetchThreshold();
  const visibilityThreshold = thresholdConfig.value;

  const student = userId
    ? await OnboardingModel.findOne({ userId }).lean()
    : null;

  const appliedJobIds = student
    ? await Application.find({
        applicant: student._id,
      }).distinct("job")
    : [];

  const W = await fetchWeights(student?.profileType ?? "student");

  logConfig(W, thresholdConfig, "REFERRAL JOBS CURSOR ENGINE");

  const query = {
    jobType: "Referral",
    approvalStatus: "Approved",
    inactive : false,
    isAskForReferral: { $ne: true },

    candidatePosted: {
      $ne: candidatePostedId,
    },

    ...(appliedJobIds.length > 0 && {
      _id: { $nin: appliedJobIds },
    }),
  };

  if (cursor) {
    query._id = {
      ...(query._id || {}),
      $lt: cursor,
    };
  }

  const BATCH_SIZE = 20;

  let matchedJobs = [];
  let lastScannedJob = null;
  let hasMore = true;

  while (matchedJobs.length < limit) {
    const jobs = await JobPostingTable.find(query)
      .populate({
        path: "candidatePosted",
        select: "_id userId name email currentCompany",
      })
      .populate("companyPosted")
      .sort({ _id: -1 })
      .limit(BATCH_SIZE)
      .lean();

    if (!jobs.length) {
      hasMore = false;
      break;
    }

    lastScannedJob = jobs[jobs.length - 1];

    const scoredJobs = jobs.map((job, i) =>
      scoreJob(job, student, W, i, "Referral Job"),
    );

    const passingJobs = scoredJobs.filter(
      (job) => job.matchScore >= visibilityThreshold,
    );

    matchedJobs.push(...passingJobs);

    query._id = {
      ...(query._id || {}),
      $lt: lastScannedJob._id,
    };
  }

  const jobsForResponse = matchedJobs.slice(0, limit);

  const enrichedJobs = await Promise.all(
    jobsForResponse.map(async (job) => {
      let alumniCount = 0;

      const companyName =
        job.candidatePosted?.currentCompany ||
        job.companyPosted?.companyDetails?.companyName;

      if (companyName) {
        try {
          const studentColleges = [
            ...new Set(
              (student?.educations || [])
                .map((edu) => edu.college_canonical_id)
                .filter(Boolean),
            ),
          ];

          const studentCompanies = [
            ...new Set(
              [
                student?.currentCompany_canonical_id,

                ...(student?.experiences || []).map(
                  (exp) => exp.company_canonical_id,
                ),
              ].filter(Boolean),
            ),
          ];
          const targetCompany = await resolveCompany(companyName);

          const targetCanonicalId = targetCompany?.canonicalId;
          const excludedUserIds = [userId];
          if (job.candidatePosted?.userId) {
            excludedUserIds.push(job.candidatePosted.userId);
          }
          alumniCount = await OnboardingModel.countDocuments({
            userId: {
              $nin: excludedUserIds,
            },

            $and: [
              {
                $or: [
                  {
                    "educations.college_canonical_id": {
                      $in: studentColleges,
                    },
                  },

                  {
                    currentCompany_canonical_id: {
                      $in: studentCompanies,
                    },
                  },

                  {
                    "experiences.company_canonical_id": {
                      $in: studentCompanies,
                    },
                  },
                ],
              },
              {
                currentCompany_canonical_id: targetCanonicalId,
              },
              // {
              //   $or: [
              //     {
              //       currentCompany_canonical_id: targetCanonicalId,
              //     },

              //     {
              //       "experiences.company_canonical_id": targetCanonicalId,
              //     },
              //   ],
              // },
            ],
          });
        } catch (err) {
          console.error(
            `[ALUMNI] Failed to count for ${companyName}:`,
            err.message,
          );
        }
      }

      const metrics = await fetchMetricsForJob(job._id);

      return {
        ...job,
        alumniCount,
        metrics,
      };
    }),
  );

  const cleanedJobs = enrichedJobs.map((job) => {
    const {
      _scoreBreakdown,
      _gateMultiplier,
      _skillMatchPct,
      _profileType,
      ...cleanJob
    } = job;

    return cleanJob;
  });

  return {
    data: cleanedJobs,

    meta: {
      limit,

      returned: cleanedJobs.length,

      nextCursor:
        cleanedJobs.length > 0 ? cleanedJobs[cleanedJobs.length - 1]._id : null,

      hasMore,
    },
  };
};
export const getJobPostingsByJobTypeWithLocationBasedService = async (
  jobType,
  studentLocations = [],
  userId,
) => {
  try {
    let query = { jobType };

    if (studentLocations && studentLocations.length > 0) {
      query.$or = [
        { broadcastType: "Everyone" },
        { broadcastType: "Location", location: { $in: studentLocations } },
      ];
    } else {
      query.broadcastType = "Everyone";
    }

    const postings = await JobPostingTable.find(query)
      .populate("companyPosted")
      .sort({ createdAt: -1 });

    const currentDate = new Date();
    const updatedPostings = postings.map((posting) => {
      let status = posting.jobStatus;

      if (posting.startDate && posting.endDate) {
        const startDate = new Date(posting.startDate);
        const endDate = new Date(posting.endDate);

        if (currentDate < startDate) {
          status = "Pending";
        } else if (currentDate >= startDate && currentDate <= endDate) {
          status = "Open";
        } else if (currentDate > endDate) {
          status = "Closed";
        }
      }

      return {
        ...posting.toObject(),
        jobStatus: status,
      };
    });

    // Filter out jobs the user has already applied for
    if (userId) {
      try {
        let applicantId = null;
        const onboarding = await OnboardingModel.findOne({ userId: userId })
          .select("_id")
          .lean();
        if (onboarding && onboarding._id) applicantId = onboarding._id;

        if (!applicantId) {
          try {
            applicantId = new mongoose.Types.ObjectId(userId);
          } catch (e) {
            applicantId = userId;
          }
        }

        const jobIds = postings.map((p) => p._id);
        const applications = await Application.find({
          applicant: applicantId,
          job: { $in: jobIds },
        })
          .select("job")
          .lean();

        const appliedJobIds = new Set(applications.map((a) => String(a.job)));
        const filteredPostings = updatedPostings.filter(
          (p) => !appliedJobIds.has(String(p._id)),
        );
        return filteredPostings;
      } catch (err) {
        console.error("Error checking applications for user:", err);
        return updatedPostings;
      }
    }

    return updatedPostings;
  } catch (error) {
    console.error("Error in getJobPostingsByJobTypeService:", error.message);
    throw error;
  }
};

export const getJobPostingsByCollegeService = async (jobType) => {
  try {
    const postings = await JobPostingTable.find({ jobType }).populate(
      "collegePosted",
    );

    const currentDate = new Date();

    // Mapping of normalized degree → degreeType category
    const degreeToDegreeTypeMap = {
      // Polytechnic
      engineering: "Polytechnic",
      mechanical: "Polytechnic",
      civil: "Polytechnic",
      electrical: "Polytechnic",
      electronics: "Polytechnic",

      // ITI
      fitter: "ITI",
      welding: "ITI",

      // Diploma
      dpharma: "Diploma",

      // Undergraduate
      puchumanities: "Undergraduate",
      puccommerce: "Undergraduate",
      btech: "Undergraduate",
      be: "Undergraduate",
      bsc: "Undergraduate",
      bca: "Undergraduate",
      bba: "Undergraduate",
      bbm: "Undergraduate",
      ba: "Undergraduate",
      bpharma: "Undergraduate",

      // Postgraduate
      mtech: "Postgraduate",
      me: "Postgraduate",
      mba: "Postgraduate",
      ma: "Postgraduate",
      mca: "Postgraduate",
      msc: "Postgraduate",
      mcom: "Postgraduate",
      mpharma: "Postgraduate",
    };

    const updatedPostings = postings.map((posting) => {
      let status = posting.jobStatus;

      // --- Determine job status based on start/end dates ---
      if (posting.startDate && posting.endDate) {
        const startDate = new Date(posting.startDate);
        const endDate = new Date(posting.endDate);

        if (currentDate < startDate) {
          status = "Pending";
        } else if (currentDate >= startDate && currentDate <= endDate) {
          status = "Open";
        } else if (currentDate > endDate) {
          status = "Closed";
        }
      }

      // --- Derive degreeType category from degree field ---
      const degreeValues = posting.degree || [];
      const degreeTypeSet = new Set();

      degreeValues.forEach((deg) => {
        // normalize: lowercase, remove dots, dashes, spaces, and trim
        const normalized = deg
          ?.toLowerCase()
          .replace(/[\s.\-]/g, "") // remove spaces, dots, and hyphens
          .trim();

        const mappedDegreeType = degreeToDegreeTypeMap[normalized];
        if (mappedDegreeType) degreeTypeSet.add(mappedDegreeType);
      });

      const degreeType = Array.from(degreeTypeSet);
      return {
        ...posting.toObject(),
        jobStatus: status,
        degreeType,
      };
    });

    return updatedPostings;
  } catch (error) {
    console.error("Error in getJobPostingsByCollegeService:", error.message);
    throw error;
  }
};

export const getJobPostedByCompanyService = async (
  Id,
  jobType,
  userType,
  authUserId = null,
) => {
  try {
    let response;
    if (userType === "company") {
      response = await JobPostingTable.find({
        companyPosted: Id,
        jobType: jobType,
      }).lean();
    } else if (userType === "employer") {
      const employerProfileId = Id;
      const employerId = authUserId._id;
      const activeCompanyId = authUserId.activeCompanyId;

      if (activeCompanyId) {
        // Employer working on behalf of company
        response = await JobPostingTable.find({
          companyPosted: activeCompanyId,
          postedByUser: employerId,
          jobType: jobType,
        }).lean();
      } else {
        // Employer working independently
        response = await JobPostingTable.find({
          companyPosted: employerProfileId,
          postedByUser: employerId,
          jobType: jobType,
        }).lean();
      }
    } else if (userType === "college")
      response = await JobPostingTable.find({
        collegePosted: Id,
        jobType: jobType,
      }).populate({
        path: "collegePosted",
        select: "collegeUniversityDetails.collegeName"
      }).lean();
    //  console.log(response);
    response = response.map(job => ({
      ...job,
      collegeName: job.collegePosted?.collegeUniversityDetails?.collegeName || "",
    }));
    return { success: true, response: response };
  } catch (error) {
    console.log("Error: ", error.message);
    throw new Error("Failed to fetch");
  }
};

export const deleteJobByIdService = async (jobId, companyId) => {
  try {
    // 1️⃣ Verify job belongs to company
    const job = await JobPostingTable.findOne({
      _id: jobId,
      companyPosted: companyId,
    });

    if (!job) {
      throw new Error("Job not found or unauthorized");
    }

    // 2️⃣ Soft delete — just mark as inactive
    await JobPostingTable.findByIdAndUpdate(
      jobId,
      { inactive: true },
      { new: true },
    );

    return { success: true, msg: "Job marked as inactive successfully" };
  } catch (error) {
    console.error("Delete Job Error:", error.message);
    throw error;
  }
};

export const deleteReferralJobByIdService = async (
  jobId,
  professionalProfileId,
) => {
  try {
    const job = await JobPostingTable.findOne({
      _id: jobId,
      candidatePosted: professionalProfileId,
      jobType: "Referral",
    });

    if (!job) throw { status: 404, message: "Referral job not found" };
    if (String(job.candidatePosted) !== String(professionalProfileId))
      throw { status: 403, message: "Unauthorized" };
    if (job.inactive)
      return { success: false, status: 400, msg: "Job is already inactive" };

    await JobPostingTable.findByIdAndUpdate(
      jobId,
      { inactive: true },
      { new: true },
    );

    return {
      success: true,
      msg: "Referral job marked as inactive successfully",
    };
  } catch (error) {
    console.error("Delete Referral Job Service Error:", error.message);
    throw error;
  }
};

// export const deleteJobByIdService = async (jobId, companyId) => {
//     const session = await mongoose.startSession();

//     try {
//         session.startTransaction();

//         // 1️⃣ Verify job belongs to company
//         const job = await JobPostingTable.findOne(
//             { _id: jobId, companyPosted: companyId },
//             null,
//             { session }
//         );

//         if (!job) {
//             throw new Error("Job not found or unauthorized");
//         }

//         // 2️⃣ Delete all applications for this job
//         await Application.deleteMany(
//             { job: jobId },
//             { session }
//         );

//         // 3️⃣ Delete the job itself
//         await JobPostingTable.deleteOne(
//             { _id: jobId },
//             { session }
//         );

//         await session.commitTransaction();
//         session.endSession();

//         return { success: true, msg: "Job and related applications deleted successfully" };

//     } catch (error) {
//         await session.abortTransaction();
//         session.endSession();
//         console.error("Delete Job Error:", error.message);
//         throw error;
//     }
// };
