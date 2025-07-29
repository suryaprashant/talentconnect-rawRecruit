import mongoose from 'mongoose';

// import Application from "../models/Application.js";
import OffCampusApplication from '../models/offCampusApplicationModel.js';
// import '../models/Student.js';
import Job from '../models/Job.js';
import InternshipApplication from '../models/internshipApplicationModel.js';
import PoolCampusApplication from '../models/poolcampusApplicationModel.js';
import OnCampusApplication from '../models/oncampusApplicationModel.js';
import PoolCampusHiring from '../models/HiringChannelPoolCampusModel.js';
import JobListingApplication from '../models/jobListingApplicationModel.js';

export async function checkExitence(jobId, userId, jobType) {
    try {
        let response;
        if (jobType == 'offcampus') response = await OffCampusApplication.find({ user: userId, job: jobId });
        else if (jobType == 'joblisting') response = await JobListingApplication.find({ user: userId, job: jobId });
        // console.log("res: ", response);
        if (response?.length > 0) return false;
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
    return true;
}

// candidate
export async function fetchOffcampusApplicationService(userId) {
    try {

        const applicationData = await OffCampusApplication.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: 'hiringdrives',
                    localField: 'job',
                    foreignField: '_id',
                    as: 'jobDetails'
                }
            },
            {
                $lookup: {
                    from: 'companyprofiles',
                    localField: 'jobDetails.companyId',
                    foreignField: '_id',
                    as: 'companyDetails'
                }
            },
            {
                $project: {
                    job: 1,
                    statusHistory: 1,
                    currentStatus: 1,
                    createdAt: 1,
                    "jobDetails.jobRoles": 1,
                    "jobDetails._id": 1,
                    "jobDetails.description": 1,
                    "jobDetails.workLocations": 1,
                    "jobDetails.workModes": 1,
                    "jobDetails.yearsOfExperience": 1,
                    "companyDetails.companyDetails": 1,
                }
            }
            // {
            //     $unwind: '$jobDetails'
            // }
        ]);

        // const applicationData = await OffCampusApplication.find({ user: userId })
        //     .populate('job')
        //     .populate('$job.companyId')
        //     .lean();

        return { success: true, data: applicationData };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}
export async function fetchJoblistingApplicationService(userId) {
    try {

        const applicationData = await JobListingApplication.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: 'jobpostings',
                    localField: 'job',
                    foreignField: '_id',
                    as: 'jobDetails'
                }
            },
            {
                $lookup: {
                    from: 'companyprofiles',
                    localField: 'jobDetails.companyId',
                    foreignField: '_id',
                    as: 'companyDetails'
                }
            },
            {
                $project: {
                    job: 1,
                    statusHistory: 1,
                    currentStatus: 1,
                    createdAt: 1,
                    "jobDetails.jobTitle": 1,
                    "jobDetails._id": 1,
                    "jobDetails.jobDescription": 1,
                    "jobDetails.preferredHiringLocation": 1,
                    // "jobDetails.workModes": 1,
                    "jobDetails.yearsOfExperience": 1,
                    "companyDetails.companyDetails": 1,
                }
            }
            // {
            //     $unwind: '$jobDetails'
            // }
        ]);

        return { success: true, data: applicationData };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}
export async function fetchInternshipApplicationService(userId) {
    try {

        const applicationData = await InternshipApplication.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: 'intern',
                    localField: 'job',
                    foreignField: '_id',
                    as: 'jobDetails'
                }
            },
            {
                $lookup: {
                    from: 'companyprofiles',
                    localField: 'jobDetails.companyId',
                    foreignField: '_id',
                    as: 'companyDetails'
                }
            },
            // {
            //     $project: {
            //         job: 1,
            //         statusHistory: 1,
            //         currentStatus: 1,
            //         createdAt: 1,
            //         "jobDetails.jobTitle": 1,
            //         "jobDetails._id": 1,
            //         "jobDetails.jobDescription": 1,
            //         "jobDetails.preferredHiringLocation": 1,
            //         // "jobDetails.workModes": 1,
            //         "jobDetails.yearsOfExperience": 1,
            //         "companyDetails.companyDetails": 1,
            //     }
            // }
            // {
            //     $unwind: '$jobDetails'
            // }
        ]);

        return { success: true, data: applicationData };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}

export async function createApplicationService(userId, jobId) {
    try {
        const newApplication = new OffCampusApplication({
            user: userId,
            job: jobId,
            statusHistory: [{ status: "Applied" }],
            currentStatus: "Applied"
        });
        await newApplication.save();
        return { success: true, message: 'Application submited!' };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to Save");
    }
}

export async function createJobListingApplicationService(userId, jobId) {
    try {
        const newApplication = new JobListingApplication({
            user: userId,
            job: jobId,
            statusHistory: [{ status: "Applied" }],
            currentStatus: "Applied"
        });
        await newApplication.save();
        return { success: true, message: 'Application submited!' };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to Save");
    }
}

export async function fetchShortlistedCandidatesService(jobId) { //offcampus jobs
    try {
        const response = await OffCampusApplication.find({ job: jobId, currentStatus: 'Shortlisted' })
            .populate({
                path: 'user',
                // select: "name collegeName cgpa resumeUrl"
            })
            .populate({
                path: 'job',
                // select: "title"
            })
            .lean();
        return { success: true, data: response };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}

// offcampus shorlisted candidate for all jobs
export async function fetchShortlistedCandidates(companyId, targetStatus) {
    try {
        // filter the candidates
        const candidates = await OffCampusApplication.aggregate([
            {
                $lookup: {
                    from: 'hiringdrives',
                    localField: 'job',
                    foreignField: '_id',
                    as: 'jobDetails'
                }
            },
            // { $unwind: '$jobDetails' },
            {
                $match: {
                    'jobDetails.companyId': new mongoose.Types.ObjectId(companyId)
                }
            },
            {
                $match: {
                    currentStatus: targetStatus
                }
            },
            {
                $lookup: {
                    from: 'onboardings',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $unwind: {
                    path: '$userDetails',
                    preserveNullAndEmptyArrays: true
                }
            },
            // custom project fields
            {
                $project: {
                    currentStatus: 1,
                    statusHistory: 1,
                    jobTitle: '$jobDetails.jobRoles',
                    user: { cgpa: '$userDetails.cgpa', college: '$userDetails.college', name: '$userDetails.name' }
                }
            }
        ]);

        return { success: true, response: candidates };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}

// export async function getAcceptedOnCampusService(companyId) {
//     try {

//         const response = await Job.find({ companyPosted: companyId, openingFor: "Oncampus" }, { _id: 1 }).lean();

//         let acceptedCandidates = [];
//         for (let i = 0; i < response.length; i++) {
//             const candidateData = await fetchAcceptedCandidatesService(response[i]._id);
//             if (candidateData.data.length > 0) acceptedCandidates.push(candidateData);
//         }

//         // const result = await Application.aggregate([
//         //     {
//         //         $match: {
//         //             job: mongoose.Types.ObjectId(jobId),
//         //             currentStatus: "Offer Extended"
//         //         }
//         //     },
//         // {
//         //     $lookup: {
//         //         from: "jobs",
//         //         localField: "job",
//         //         foreignField: "_id",
//         //         as: "jobDetails"
//         //     }
//         // },
//         // {
//         //     $unwind: "$jobDetails"
//         // },
//         // {
//         //     $match: {
//         //         "jobDetails.jobType": "Oncampus"
//         //     }
//         // },
//         // {
//         //     $lookup: {
//         //         from: "StudentOverview",
//         //         localField: "user",
//         //         foreignField: "_id",
//         //         as: "userDetails"
//         //     }
//         // },
//         // {
//         //     $unwind: "$userDetails"
//         // }
//         // ]);

//         return { success: true, data: acceptedCandidates };
//     } catch (error) {
//         console.log("Error: ", error.message);
//         throw new Error("Failed to fetch");
//     }
// }

// by company - same for getall, shortlisted, accepted candidates
export async function getOffCampusApplicantsService(query) {
    try {
        const response = await OffCampusApplication.find(query)
            .populate('user')
            .lean();
        return { success: true, data: response };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}

// internship
export async function checkInternshipExitence(jobId, userId) {
    try {
        const response = await InternshipApplication.find({ user: userId, job: jobId });
        // console.log("res: ", response);
        if (response?.length > 0) return true;
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
    return false;
}

// by company - same for getall, shortlisted, accepted candidates
export async function getInternshipApplicantsService(query) {
    try {
        const response = await InternshipApplication.find(query)
            .populate()
            .lean();
        return { success: true, data: response };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to Save");
    }
}

export async function createInternshipApplicationService(userId, jobId) {

    try {
        const newApplication = new InternshipApplication({
            user: userId,
            job: jobId,
            statusHistory: [{ status: "Applied" }],
            currentStatus: "Applied"
        });
        await newApplication.save();
        return { success: true, message: 'Application submited!' };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to Save");
    }
}

export async function checkPoolCampusApplicationExitence(collegeId, jobId) {
    try {
        const response = await PoolCampusApplication.find({ college: collegeId, drive: jobId });
        // console.log("res: ", response);
        console.log(response.length);
        if (response?.length > 0) return true;
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
    return false;
}

export async function poolcampusApplicationService(collegeId, jobId) {
    try {
        const newApplication = new PoolCampusApplication({
            college: collegeId,
            drive: jobId,
            statusHistory: [{ status: "Applied" }],
            currentStatus: "Applied"
        });
        await newApplication.save();
        return { success: true, message: 'Application submited!' };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to Save");
    }
}

export async function checkOnCampusApplicationExitence(collegeId, jobId) {
    try {
        const response = await OnCampusApplication.find({ college: collegeId, drive: jobId });
        // console.log("res: ", response);
        console.log(response.length);
        if (response?.length > 0) return true;
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
    return false;
}

export async function oncampusApplicationService(collegeId, jobId) {
    try {
        const newApplication = new OnCampusApplication({
            college: collegeId,
            drive: jobId,
            statusHistory: [{ status: "Applied" }],
            currentStatus: "Applied"
        });
        await newApplication.save();
        return { success: true, message: 'Application submited!' };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to Save");
    }
}

export async function getOncampusApplicantsService(query) {
    try {
        const response = await OnCampusApplication.find(query)
            .populate('drive')
            .lean();
        return { success: true, data: response };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to Save");
    }
}