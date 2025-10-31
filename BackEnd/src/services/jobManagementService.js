 import HiringDrive from "../models/hiringChannelOffCampusRegisterModel.js";
import {JobPostingTable} from "../models/jobPostingsModel.js"
import mongoose from "mongoose";

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

// export const getJobPostedByCollegeService = async (collegeId, jobType) => {
//     try {
//         const response = await JobPostingTable.find({ collegePosted: collegeId, jobType: jobType }).lean();
//         // console.log(response);
//         return { success: true, response: response };
//     } catch (error) {
//         console.log("Error: ", error.message);
//         throw new Error("Failed to fetch");
//     }
// }
//#region code by muhammad
// export const getJobPostedByCollegeService = async (collegeId, jobType) => {
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
//                     applicationCount: { $size: "$jobApplications" }
//                 }
//             },
//             {
//                 $project: {
//                     jobApplications: 0
//                 }
//             }
//         ]);

//         return { success: true, response: response };
//     } catch (error) {
//         console.log("Error in getJobPostedByCollegeService: ", error.message);
//         throw new Error("Failed to fetch jobs with application counts");
//     }
// }
export const getJobPostedByCollegeService = async (collegeId, jobType,key) => {
    let target ="";
    switch (key) {
        case "campus-placement":
            target="Applied";
            break;
        case "on-campus-opportunities":
            target="Shortlisted";
            break;
        case "poolCampus-placement":
            target="Applied";
            break;
        case "poolcampus":
            target="Shortlisted";
            break;
        default:
            target="";
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
                // Add a field that counts only applications where currentStatus = "Applied"
                $addFields: {
                    applicationCount: {
                        $size: {
                            $filter: {
                                input: "$jobApplications",
                                as: "application",
                                cond: { $eq: ["$$application.currentStatus", target] }
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    jobApplications: 0 // Exclude full applications array
                }
            }
        ]);

        return { success: true, response };
    } catch (error) {
        console.log("Error in getJobPostedByCollegeService: ", error.message);
        throw new Error("Failed to fetch jobs with applied application counts");
    }
};
//#endregion code by muhammad