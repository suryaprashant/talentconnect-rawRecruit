import {JobPostingTable} from "../models/jobPostingsModel.js";

/**
 * Reactivates a job by updating its dates and marking it active.
 * Works for company, college, and professional job types.
 *
 * @param {string}   jobId          - Job to reactivate
 * @param {ObjectId} profileId      - _id of the resolved profile
 * @param {string}   profileType    - role of the user
 * @param {Date}     startDate      - new start date
 * @param {Date}     endDate        - new end date
 */
export const reactivateJobService = async (
    jobId,
    profileId,
    profileType,
    startDate,
    endDate
) => {
    // Map role → the field used in JobPostingTable to store owner reference
    const ownerFieldMap = {
        professional: "candidatePosted",
        student:      "candidatePosted",
        fresher:      "candidatePosted",
        company:      "companyPosted",    // adjust to your actual field name
        college:      "collegePosted",    // adjust to your actual field name
    };

    const ownerField = ownerFieldMap[profileType];
    if (!ownerField) {
        const err = new Error("Cannot determine job ownership field");
        err.status = 400;
        throw err;
    }

    // Validate dates
    const start = new Date(startDate);
    const end   = new Date(endDate);

    if (isNaN(start) || isNaN(end)) {
        const err = new Error("Invalid date format");
        err.status = 400;
        throw err;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    if (end <= start) {
        const err = new Error("End date must be after start date");
        err.status = 400;
        throw err;
    }

    if (start < today) {
        const err = new Error("Start date cannot be in the past");
        err.status = 400;
        throw err;
    }

    // Find the job — ownership is enforced at query level
    const job = await JobPostingTable.findOne({
        _id: jobId,
        [ownerField]: profileId,
    });

    if (!job) {
        const err = new Error("Job not found or you are not authorized");
        err.status = 404;
        throw err;
    }

    if (!job.inactive) {
        const err = new Error("Job is already active");
        err.status = 400;
        throw err;
    }

    const updatedJob = await JobPostingTable.findByIdAndUpdate(
        jobId,
        {
            inactive:  false,
            startDate: start,
            endDate:   end,
        },
        { new: true }
    );

    return { success: true, msg: "Job reactivated successfully", job: updatedJob };
};