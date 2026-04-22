import express from "express";
import mongoose from "mongoose";
import { JobPostingTable } from "../models/JobPosting.js";
import Application from "../models/Application.js";

const router = express.Router();

/**
 * DELETE /api/jobs/:jobId
 * Deletes a job and all its associated applications
 */
router.delete("/:jobId", async (req, res) => {
    const { jobId } = req.params;

    // Validate jobId format
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid job ID format",
        });
    }

    // Use a session for atomicity — if one step fails, both roll back
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 1. Check if job exists
        const job = await JobPostingTable.findById(jobId).session(session);
        if (!job) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        // 2. Delete all applications linked to this job
        const deletedApplications = await Application.deleteMany(
            { job: jobId },
            { session }
        );

        // 3. Delete the job itself
        await JobPostingTable.findByIdAndDelete(jobId, { session });

        // 4. Commit the transaction
        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            success: true,
            message: "Job and all associated applications deleted successfully",
            data: {
                jobId,
                applicationsDeleted: deletedApplications.deletedCount,
            },
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error("Error deleting job:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while deleting job",
            error: error.message,
        });
    }
});

export default router;