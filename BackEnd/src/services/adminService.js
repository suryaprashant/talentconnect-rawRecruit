import { JobPostingTable } from "../models/jobPostingsModel.js";
import  Application  from "../models/applicationModel.js"
import mongoose from "mongoose";


export const getPendingReferralJobsService = async () => {
  try {
    const jobs = await JobPostingTable
      .find({
        jobType: "Referral",
        approvalStatus: "Pending"
      })
      .populate({
        path: "candidatePosted",
        select: "name email totalYearsOfExperience currentCompany linkedin profileType"
      })
      .sort({ createdAt: -1 })
      .lean();

    return jobs;
  } catch (error) {
    console.error(
      "Error in getPendingReferralJobsService:",
      error.message
    );
    throw error;
  }
};

export const getAcceptedReferralJobsService = async () => {
  try {
    const jobs = await JobPostingTable
      .find({
        jobType: "Referral",
        approvalStatus: "Approved"
      })
      .populate({
        path: "candidatePosted",
        select: "name email totalYearsOfExperience currentCompany linkedin profileType"
      })
      .sort({ createdAt: -1 })
      .lean();

    return jobs;
  } catch (error) {
    console.error(
      "Error in getPendingReferralJobsService:",
      error.message
    );
    throw error;
  }
};


export const updateReferralApprovalStatusService = async (
  jobId,
  approvalStatus
) => {
  try {
    const updatedJob = await JobPostingTable.findOneAndUpdate(
      {
        _id: jobId,
        jobType: "Referral", // 🔒 critical safety check
      },
      {
        approvalStatus,
      },
      {
        new: true,
      }
    );

    return updatedJob;
  } catch (error) {
    console.error("Service error updating referral approval:", error);
    throw error;
  }
};


export const getReferralApplicationsForAdminService = async ({
  status,
  adminStatus,
}) => {
  try {
    const query = {
      jobType: "Referral",
    };

    // Optional filters
    if (status) {
      query.currentStatus = status; // Applied / Shortlisted / Rejected
    }

    if (adminStatus) {
      query.adminApprovalStatus = adminStatus; // Pending / Approved / Rejected
    }

    const applications = await Application.find(query)
      .populate({
        path: "job",
        select: "jobTitle jobType approvalStatus",
      })
      .populate({
        path: "applicant",
        select: "fullName name email",
      })
      .sort({ createdAt: -1 })
      .lean();

    return applications;
  } catch (error) {
    console.error("❌ getReferralApplicationsForAdminService:", error);
    throw error;
  }
};

export async function fetchReferralApplicationsService({
  jobId,
  adminApprovalStatus,
  professionalProfileId, // only for professional dashboard
   isVisited, // 👈 ADD THIS PARAM
}) {
  try {
    const matchStage = {
      jobType: "Referral",
    };

    if (jobId) {
      matchStage.job = new mongoose.Types.ObjectId(jobId);
    }

    if (adminApprovalStatus) {
      matchStage.adminApprovalStatus = adminApprovalStatus;
    }

      if (typeof isVisited === "boolean") {
      matchStage.isVisited = isVisited;
    }

    const pipeline = [
      { $match: matchStage },

      // 🔗 Join Job
      {
        $lookup: {
          from: "jobpostingtables",
          localField: "job",
          foreignField: "_id",
          as: "job",
        },
      },
      { $unwind: "$job" },
    ];

    // 👤 Professional dashboard filter
    if (professionalProfileId) {
      pipeline.push({
        $match: {
          "job.candidatePosted": new mongoose.Types.ObjectId(
            professionalProfileId
          ),
          adminApprovalStatus: "Approved",
        },
      });
    }

    // 🎯 Resolve correct applicant
    pipeline.push(
      {
        $addFields: {
          effectiveApplicantId: {
            $cond: [
              {
                $and: [
                  { $eq: ["$appliedByType", "employer"] },
                  { $ne: ["$appliedForCompany", null] },
                ],
              },
              "$appliedForCompany",
              "$applicant",
            ],
          },
        },
      },

      // -------- LOOKUPS --------
      {
        $lookup: {
          from: "onboardings",
          localField: "effectiveApplicantId",
          foreignField: "_id",
          as: "studentApplicant",
        },
      },
      {
        $lookup: {
          from: "companyprofiles",
          localField: "effectiveApplicantId",
          foreignField: "_id",
          as: "companyApplicant",
        },
      },
      {
        $lookup: {
          from: "employerprofiles",
          localField: "effectiveApplicantId",
          foreignField: "_id",
          as: "employerApplicant",
        },
      },
      {
        $lookup: {
          from: "collegeonboardings",
          localField: "effectiveApplicantId",
          foreignField: "_id",
          as: "collegeApplicant",
        },
      },

      // 🎯 Final applicant selector
      {
        $addFields: {
          applicant: {
            $switch: {
              branches: [
                {
                  case: {
                    $in: [
                      "$applicantType",
                      ["student", "fresher", "professional"],
                    ],
                  },
                  then: { $arrayElemAt: ["$studentApplicant", 0] },
                },
                {
                  case: { $eq: ["$applicantType", "company"] },
                  then: { $arrayElemAt: ["$companyApplicant", 0] },
                },
                {
                  case: { $eq: ["$applicantType", "employer"] },
                  then: { $arrayElemAt: ["$employerApplicant", 0] },
                },
                {
                  case: { $eq: ["$applicantType", "college"] },
                  then: { $arrayElemAt: ["$collegeApplicant", 0] },
                },
              ],
              default: null,
            },
          },
        },
      },

      // 🧼 Clean output
      {
        $project: {
          applicant: 1,
          applicantType: 1,
          currentStatus: 1,
          adminApprovalStatus: 1,
          createdAt: 1,
          job: {
            _id: 1,
            jobTitle: 1,
          },
        },
      }
    );

    const data = await Application.aggregate(pipeline);

    return { success: true, data };
  } catch (error) {
    console.error("fetchReferralApplicationsService error:", error);
    throw error;
  }
}

export const updateReferralApplicationStatusService = async ({
  applicationId,
  action,
}) => {
  const application = await Application.findById(applicationId);

  if (!application) {
    throw new Error("Application not found");
  }

  if (application.jobType !== "Referral") {
    throw new Error("Invalid job type");
  }

  // prevent double approval / rejection
  if (["Approved", "Rejected"].includes(application.adminApprovalStatus)) {
    throw new Error(
      `Application already ${application.adminApprovalStatus}`
    );
  }

  application.adminApprovalStatus = action;

  // keep statuses meaningful
  if (action === "Approved") {
    application.currentStatus = "Application Sent";
    application.statusHistory.push({ status: "Application Sent" });
  }

  if (action === "Rejected") {
    application.currentStatus = "Rejected";
    application.statusHistory.push({ status: "Rejected" });
  }

  await application.save();

  return application;
};