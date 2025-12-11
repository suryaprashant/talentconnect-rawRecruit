 import HiringDrive from "../models/hiringChannelOffCampusRegisterModel.js";
import {JobPostingTable} from "../models/jobPostingsModel.js"
import mongoose from "mongoose";
import Application from "../models/applicationModel.js";

export async function getOffCampusJobsService(companyId) {
    try {
        const response = await HiringDrive.find({ companyId: companyId }, {
            // custom fields
        }).lean();
        return { success: true, data: response };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to create profile");
    }
}


export const getJobPostedByCollegeService = async (collegeId, jobType, key) => {
    let target = "";

    switch (key) {
        case "campus-placement":
            target = "Applied";
            break;
        case "on-campus-opportunities":
            target = "Shortlisted";
            break;
        case "poolCampus-placement":
            target = "Applied";
            break;
        case "pool-campus-opportunities":
            target = "Shortlisted";
            break;    
        case "poolcampus":
            target = "Shortlisted";
            break;
        default:
            target = "";
            break;
    }
    
    try {
        const response = await JobPostingTable.aggregate([
            {
                $match: {
                    collegePosted: new mongoose.Types.ObjectId(collegeId),
                    jobType: jobType
                }
            },
            {
                $lookup: {
                    from: "applications",
                    localField: "_id",
                    foreignField: "job",
                    as: "jobApplications"
                }
            },
            {
                $addFields: {
                    applicationCount: {
                        $size: {
                            $filter: {
                                input: "$jobApplications",
                                as: "application",
                                cond: { 
                                    $and: [
                                        { $eq: ["$$application.currentStatus", target] },
                                        { $eq: ["$$application.jobType", jobType] }
                                    ]
                                }
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    jobApplications: 0
                }
            }
        ]);

        return { success: true, response };
    } catch (error) {
        throw new Error("Failed to fetch jobs with applied application counts");
    }
};

export const deleteJobPostingService = async (jobId, collegeId) => {
    try {
        
        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            throw new Error("Invalid job ID");
        }

        if (!mongoose.Types.ObjectId.isValid(collegeId)) {
            throw new Error("Invalid college ID");
        }

        const job = await JobPostingTable.findOne({
            _id: new mongoose.Types.ObjectId(jobId),
            collegePosted: new mongoose.Types.ObjectId(collegeId)
        });

        if (!job) {
            throw new Error("Job not found or you don't have permission to delete it");
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            
            const deleteApplicationsResult = await Application.deleteMany(
                { job: new mongoose.Types.ObjectId(jobId) },
                { session }
            );

            
            const deleteJobResult = await JobPostingTable.deleteOne(
                { _id: new mongoose.Types.ObjectId(jobId) },
                { session }
            );

            await session.commitTransaction();
            session.endSession();

            return {
                success: true,
                message: "Job and associated applications deleted successfully",
                data: {
                    jobDeleted: deleteJobResult.deletedCount,
                    applicationsDeleted: deleteApplicationsResult.deletedCount
                }
            };

        } catch (transactionError) {
         
            await session.abortTransaction();
            session.endSession();
            throw transactionError;
        }

    } catch (error) {
        console.error("Error in deleteJobPostingService:", error);
        throw new Error(error.message || "Failed to delete job posting");
    }
};
