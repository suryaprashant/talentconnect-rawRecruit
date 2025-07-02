import mongoose from 'mongoose';

import Application from "../models/Application.js";
// import '../models/Student.js';
import Job from '../models/Job.js';

export async function fetchApplicationService(query, userType) {
    try {
        let applicationData;
        if (userType === 'User') {
            // applicationData = await Application.find(query)
            //     .populate({
            //         path: 'job',
            //         select: '-allowedColleges'
            //     })
            //     .lean();

            applicationData = await Application.aggregate([
                {
                    $match: {
                        user: new mongoose.Types.ObjectId(query.user)
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
                    $lookup:{
                        from:'companyoverviews',
                        localField:'jobDetails.companyPosted',
                        foreignField:'_id',
                        as:'companyDetails'
                    }
                },
                {
                    $project:{
                        job:1,
                        statusHistory:1,
                        currentStatus:1,
                        createdAt:1,
                        "jobDetails.title":1,
                        "jobDetails._id":1,
                        "jobDetails.description":1,
                        "jobDetails.location":1,
                        "jobDetails.workMode":1,
                        "jobDetails.yearsOfExperience":1,
                        "jobDetails.yearsOfExperience":1,
                        "companyDetails.companyName":1,
                    }
                }
                // {
                //     $unwind: '$jobDetails'
                // }
            ]);
        } else if (userType === 'Company') {
            applicationData = await Application.find(query)
                .populate('user')
                .lean();
        }
        else {
            return { success: false, error: "Invalid User" }
        }

        return applicationData.length > 0 ? { success: true, data: applicationData } : { success: false, message: "No application" };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}

export async function createApplicationService(userId, jobId) {

    try {
        const newApplication = new Application({
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
        const response = await Application.find({ job: jobId, currentStatus: 'Offer Extended' })
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