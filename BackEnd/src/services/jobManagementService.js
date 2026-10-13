import HiringDrive from "../models/hiringChannelOffCampusRegisterModel.js";
import { JobPostingTable } from "../models/jobPostingsModel.js"
import mongoose from "mongoose";
import Application from "../models/applicationModel.js";
import AuthSchema from "../models/authModel.js";


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


// export const getJobPostedByCollegeService = async (collegeId, jobType, key, isVisited) => {
//     let target = "";

//     switch (key) {
//         case "campus-placement":
//             target = "Applied";
//             break;
//         case "on-campus-opportunities":
//             target = "Shortlisted";
//             break;
//         case "poolCampus-placement":
//             target = "Applied";
//             break;
//         case "pool-campus-opportunities":
//             target = "Shortlisted";
//             break;    
//         case "poolcampus":
//             target = "Shortlisted";
//             break;
//         default:
//             target = "";
//             break;
//     }

//     try {
//         const response = await JobPostingTable.aggregate([
//             {
//                 $match: {
//                     collegePosted: new mongoose.Types.ObjectId(collegeId),
//                     jobType: jobType
//                 }
//             },
//             {
//                 $lookup: {
//                     from: "applications",
//                     localField: "_id",
//                     foreignField: "job",
//                     as: "jobApplications"
//                 }
//             },
//             {
//                 $addFields: {
//                     applicationCount: {
//                         $size: {
//                             $filter: {
//                                 input: "$jobApplications",
//                                 as: "application",
//                                 cond: { 
//                                     $and: [
//                                         { $eq: ["$$application.currentStatus", target] },
//                                         { $eq: ["$$application.jobType", jobType] },
//                                         { $eq: ["$$application.isVisited", false] },
//                                     ]
//                                 }
//                             }
//                         }
//                     }
//                 }
//             },
//             {
//                 $project: {
//                     jobApplications: 0
//                 }
//             }
//         ]);

//         return { success: true, response };
//     } catch (error) {
//         throw new Error("Failed to fetch jobs with applied application counts");
//     }
// };
export const getJobPostedByCollegeService = async (
    collegeId,
    jobType,
    key,
    isVisited,
    active
) => {
    const targetMap = {
        "campus-placement": "Applied",
        "poolCampus-placement": "Applied",
        "on-campus-opportunities": "Shortlisted",
        "pool-campus-opportunities": "Shortlisted",
        "poolcampus": "Shortlisted"
    };

    const target = targetMap[key] || "";

    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let response = await JobPostingTable.aggregate([
            {
                $match: {
                    collegePosted: new mongoose.Types.ObjectId(collegeId),
                    jobType: jobType,

                    ...(active === 'false'
                        ? {
                            endDate: { $lt: today }
                        }
                        : {
                            inactive: { $ne: true }
                        })
                }
            },

            // Lookup College Details
            {
                $lookup: {
                    from: "collegeonboardings",
                    localField: "collegePosted",
                    foreignField: "_id",
                    as: "collegeInfo"
                }
            },

            {
                $unwind: {
                    path: "$collegeInfo",
                    preserveNullAndEmptyArrays: true
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
                    collegeName:
                        "$collegeInfo.collegeUniversityDetails.collegeName",

                    collegeAddress: {
                        location:
                            "$collegeInfo.collegeUniversityDetails.collegeLocation",
                        city:
                            "$collegeInfo.collegeUniversityDetails.city",
                        state:
                            "$collegeInfo.collegeUniversityDetails.state",
                        pincode:
                            "$collegeInfo.collegeUniversityDetails.pincode"
                    },

                    applicationCount: {
                        $size: {
                            $filter: {
                                input: "$jobApplications",
                                as: "application",
                                cond: {
                                    $and: [
                                        {
                                            $eq: [
                                                "$$application.currentStatus",
                                                target
                                            ]
                                        },
                                        {
                                            $eq: [
                                                "$$application.isVisited",
                                                isVisited === 'true' ||
                                                    isVisited === true
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    }
                }
            },

            {
                $project: {
                    jobApplications: 0,
                    collegeInfo: 0
                }
            }
        ]);

        return {
            success: true,
            response
        };
    } catch (error) {
        console.error("Aggregation Error:", error);
        throw new Error("Failed to fetch jobs with college address");
    }
};

// export const getJobPostedByCollegeService = async (collegeId, jobType, key, isVisited, active) => {
//     const targetMap = {
//         "campus-placement": "Applied",
//         "poolCampus-placement": "Applied",
//         "on-campus-opportunities": "Shortlisted",
//         "pool-campus-opportunities": "Shortlisted",
//         "poolcampus": "Shortlisted"
//     };

//     const target = targetMap[key] || "";

//     try {
//         let response = await JobPostingTable.aggregate([
//             {
//                 $match: {
//                     collegePosted: new mongoose.Types.ObjectId(collegeId),
//                     jobType: jobType,
//                     // ✅ active=false → inactive jobs, everything else → active jobs
//                     ...(active === 'false'
//                         ? { inactive: true }
//                         : { inactive: { $ne: true } })
//                 }
//             },
//             // --- NEW: Lookup College Details ---
//             {
//                 $lookup: {
//                     from: "collegeonboardings", // Ensure this matches your MongoDB collection name
//                     localField: "collegePosted",
//                     foreignField: "_id",
//                     as: "collegeInfo"
//                 }
//             },
//             { $unwind: { path: "$collegeInfo", preserveNullAndEmptyArrays: true } },
//             // ----------------------------------
//             {
//                 $lookup: {
//                     from: "applications",
//                     localField: "_id",
//                     foreignField: "job",
//                     as: "jobApplications"
//                 }
//             },
//             {
//                 $addFields: {
//                     collegeName: "$collegeInfo.collegeUniversityDetails.collegeName",
//                     // Extracting the specific address fields you requested
//                     // FIXED
//                     collegeAddress: {
//                         location: "$collegeInfo.collegeUniversityDetails.collegeLocation",
//                         city: "$collegeInfo.collegeUniversityDetails.city",
//                         state: "$collegeInfo.collegeUniversityDetails.state",
//                         pincode: "$collegeInfo.collegeUniversityDetails.pincode"
//                     },
//                     applicationCount: {
//                         $size: {
//                             $filter: {
//                                 input: "$jobApplications",
//                                 as: "application",
//                                 cond: {
//                                     $and: [
//                                         { $eq: ["$$application.currentStatus", target] },
//                                         { $eq: ["$$application.isVisited", isVisited === 'true' || isVisited === true] },
//                                     ]
//                                 }
//                             }
//                         }
//                     }
//                 }
//             },
//             {
//                 $project: {
//                     jobApplications: 0,
//                     collegeInfo: 0
//                 }
//             }
//         ]);

//         return { success: true, response };
//     } catch (error) {
//         console.error("Aggregation Error:", error);
//         throw new Error("Failed to fetch jobs with college address");
//     }
// };

export const getJobPostedWithCountsService = async (
    Id,
    jobType,
    userType,
    user,
    authUserId = null
) => {
    try {
        let match = {};

        if (userType === "company" || userType === "employer") {
            match = {
                companyPosted: Id,
                jobType: jobType
            };

        } else if (userType === "college") {
            match = {
                collegePosted: Id,
                jobType: jobType
            };
        }
        else
        {
            match = {
                candidatePosted: Id,
                jobType: jobType
            };
        }

        const response = await JobPostingTable.aggregate([
            {
                $match: match
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
                    appliedCount: {
                        $size: {
                            $filter: {
                                input: "$jobApplications",
                                as: "application",
                                cond: {
                                    $eq: [
                                        "$$application.currentStatus",
                                        "Applied"
                                    ]
                                }
                            }
                        }
                    },

                    shortlistedCount: {
                        $size: {
                            $filter: {
                                input: "$jobApplications",
                                as: "application",
                                cond: {
                                    $eq: [
                                        "$$application.currentStatus",
                                        "Shortlisted"
                                    ]
                                }
                            }
                        }
                    },

                    acceptedCount: {
                        $size: {
                            $filter: {
                                input: "$jobApplications",
                                as: "application",
                                cond: {
                                    $eq: [
                                        "$$application.currentStatus",
                                        "Accepted"
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
            },
            {
                $group: {
                    _id: null,

                    jobs: {
                        $push: "$$ROOT"
                    },

                    totalApplied: {
                        $sum: "$appliedCount"
                    },

                    totalShortlisted: {
                        $sum: "$shortlistedCount"
                    },

                    totalAccepted: {
                        $sum: "$acceptedCount"
                    }
                }
            }
        ]);

        const result = response[0] || {
            jobs: [],
            totalApplied: 0,
            totalShortlisted: 0,
            totalAccepted: 0
        };

        return {
            success: true,
                jobs: result.jobs,
                totals: {
                    applied: result.totalApplied,
                    shortlisted: result.totalShortlisted,
                    accepted: result.totalAccepted
                }
        };

    } catch (error) {
        console.log("Error:", error.message);
        throw new Error("Failed to fetch jobs with application counts");
    }
};

// export const deleteJobPostingService = async (jobId, collegeId) => {
//     try {

//         if (!mongoose.Types.ObjectId.isValid(jobId)) {
//             throw new Error("Invalid job ID");
//         }

//         if (!mongoose.Types.ObjectId.isValid(collegeId)) {
//             throw new Error("Invalid college ID");
//         }

//         const job = await JobPostingTable.findOne({
//             _id: new mongoose.Types.ObjectId(jobId),
//             collegePosted: new mongoose.Types.ObjectId(collegeId)
//         });

//         if (!job) {
//             throw new Error("Job not found or you don't have permission to delete it");
//         }

//         const session = await mongoose.startSession();
//         session.startTransaction();

//         try {

//             const deleteApplicationsResult = await Application.deleteMany(
//                 { job: new mongoose.Types.ObjectId(jobId) },
//                 { session }
//             );


//             const deleteJobResult = await JobPostingTable.deleteOne(
//                 { _id: new mongoose.Types.ObjectId(jobId) },
//                 { session }
//             );

//             await session.commitTransaction();
//             session.endSession();

//             return {
//                 success: true,
//                 message: "Job and associated applications deleted successfully",
//                 data: {
//                     jobDeleted: deleteJobResult.deletedCount,
//                     applicationsDeleted: deleteApplicationsResult.deletedCount
//                 }
//             };

//         } catch (transactionError) {

//             await session.abortTransaction();
//             session.endSession();
//             throw transactionError;
//         }

//     } catch (error) {
//         console.error("Error in deleteJobPostingService:", error);
//         throw new Error(error.message || "Failed to delete job posting");
//     }
// };


export const deleteJobPostingService = async (jobId, collegeId) => {
    try {
        // Atomic update: finds the job belonging to THIS college and marks inactive
        const job = await JobPostingTable.findOneAndUpdate(
            {
                _id: jobId,
                collegePosted: collegeId, // Ensure ownership
                inactive: { $ne: true }   // Only update if not already inactive
            },
            { $set: { inactive: true } },
            { new: true }
        );

        if (!job) {
            throw new Error("Job not found or unauthorized to delete");
        }

        return {
            success: true,
            msg: "Job marked as inactive successfully",
            data: job
        };

    } catch (error) {
        console.error("Service Error - deleteJobPosting:", error.message);
        throw error;
    }
};

export const getAppliedApplicationsService = async (userId) => {
  const applications = await Application.find({
    applicant: userId,
    currentStatus: { $ne: "Saved" }
  })
    .populate("job")
    .sort({ updatedAt: -1 })
    .lean();

  return applications;
};
export const getSavedApplicationsService = async (userId) => {
  const applications = await Application.find({
    applicant: userId,
    currentStatus: "Saved"
  })
    .populate("job")
    .sort({ updatedAt: -1 })
    .lean();

  return applications;
};