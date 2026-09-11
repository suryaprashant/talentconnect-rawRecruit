import mongoose from "mongoose";
import { JobPostingTable } from "../models/jobPostingsModel.js";
import Application from "../models/applicationModel.js";

export const deleteJobWithApplications = async (req, res) => {
    const { jobId } = req.params;

    // 1. Validate jobId
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid job ID format",
        });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 2. Check if job exists
        const job = await JobPostingTable.findById(jobId).session(session);

        if (!job) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        // 3. Delete all applications linked to this job first
        const deletedApps = await Application.deleteMany(
            { job: new mongoose.Types.ObjectId(jobId) },
            { session }
        );

        // 4. Delete the job
        await JobPostingTable.findByIdAndDelete(jobId, { session });

        // 5. Commit transaction
        await session.commitTransaction();

        return res.status(200).json({
            success: true,
            message: "Job and all associated applications deleted successfully",
            data: {
                jobId,
                applicationsDeleted: deletedApps.deletedCount,
            },
        });

    } catch (error) {
        await session.abortTransaction();
        console.error("Error during job deletion:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });

    } finally {
        await session.endSession();
    }
};