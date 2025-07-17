import mongoose from 'mongoose';

// import Application from "../models/Application.js";
import OffCampusApplication from '../models/offcampusApplicationModel.js'
// import '../models/Student.js';
import Job from '../models/Job.js';
import InternshipApplication from '../models/internshipApplicationModel.js';
import PoolCampusApplication from '../models/poolcampusApplicationModel.js';
import PoolCampusHiring from '../models/HiringChannelPoolCampusModel.js';


export async function checkExitence(jobId, userId) {
    try {
        const response = await OffCampusApplication.find({ user: userId, job: jobId });
        // console.log("res: ", response);
        if (response?.length > 0) return false;
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
    return true;
}

export async function fetchApplicationService(userId) {
    try {
        // let applicationData;
        // applicationData = await Application.find(query)
        //     .populate({
        //         path: 'job',
        //         select: '-allowedColleges'
        //     })
        //     .lean();

        const applicationData = await OffCampusApplication.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: 'jobs',
                    localField: 'job',
                    foreignField: '_id',
                    as: 'jobDetails'
                }
            },
            {
                $lookup: {
                    from: 'companyoverviews',
                    localField: 'jobDetails.companyPosted',
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
                    "jobDetails.title": 1,
                    "jobDetails._id": 1,
                    "jobDetails.description": 1,
                    "jobDetails.location": 1,
                    "jobDetails.workMode": 1,
                    "jobDetails.yearsOfExperience": 1,
                    "jobDetails.yearsOfExperience": 1,
                    "companyDetails.companyName": 1,
                }
            }
            // {
            //     $unwind: '$jobDetails'
            // }
        ]);

        return applicationData.length > 0 ? { success: true, data: applicationData } : { success: false, message: "No application" };
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

export async function fetchAcceptedCandidatesService(jobId) {
    try {
        const response = await OffCampusApplication.find({ job: jobId, currentStatus: 'Offer Extended' })
            .populate({
                path: 'user',
                select: "name collegeName cgpa resumeUrl"
            })
            .populate({
                path: 'job',
                select: "title"
            })
            .lean();
        return { success: true, data: response };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}

export async function getAcceptedOnCampusService(companyId) {
    try {

        const response = await Job.find({ companyPosted: companyId, openingFor: "Oncampus" }, { _id: 1 }).lean();

        let acceptedCandidates = [];
        for (let i = 0; i < response.length; i++) {
            const candidateData = await fetchAcceptedCandidatesService(response[i]._id);
            if (candidateData.data.length > 0) acceptedCandidates.push(candidateData);
        }

        // const result = await Application.aggregate([
        //     {
        //         $match: {
        //             job: mongoose.Types.ObjectId(jobId),
        //             currentStatus: "Offer Extended"
        //         }
        //     },
        // {
        //     $lookup: {
        //         from: "jobs",
        //         localField: "job",
        //         foreignField: "_id",
        //         as: "jobDetails"
        //     }
        // },
        // {
        //     $unwind: "$jobDetails"
        // },
        // {
        //     $match: {
        //         "jobDetails.jobType": "Oncampus"
        //     }
        // },
        // {
        //     $lookup: {
        //         from: "StudentOverview",
        //         localField: "user",
        //         foreignField: "_id",
        //         as: "userDetails"
        //     }
        // },
        // {
        //     $unwind: "$userDetails"
        // }
        // ]);

        return { success: true, data: acceptedCandidates };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}

export async function getOffCampusApplicantsService(jobId) {
    try {
        const response = await OffCampusApplication.find({ job: jobId })
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

