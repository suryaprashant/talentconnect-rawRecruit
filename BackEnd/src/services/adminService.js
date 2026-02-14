import { JobPostingTable } from "../models/jobPostingsModel.js";


export const getPendingReferralJobsService = async () => {
  try {
    const jobs = await JobPostingTable
      .find({
        jobType: "Referral",
        approvalStatus: "Pending"
      })
      .populate("postedByUser", "name email userType")
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
