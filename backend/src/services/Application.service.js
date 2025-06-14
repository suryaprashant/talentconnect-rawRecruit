import mongoose from 'mongoose';

import Application from "../models/Application.js";

export async function fetchApplicationService(query, userType) {

    try {
        let applicationData;
        if (userType === 'User') {
            applicationData = await Application.find(query)
                .populate({
                    path: 'job',
                    select: '-allowedColleges'
                })
                .lean();
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

export async function getAcceptedOnCampusService(jobId) {
    try {
        // const response = await Job.findById(jobId)
        //     .populate('allowedColleges')
        //     .lean();

        // return { success: true, data: response };
        const result = await Application.aggregate([
            {
                $match: {
                    job: mongoose.Types.ObjectId(jobId),
                    currentStatus: "Offer Extended"
                }
            },
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
        ]);

        return { success: true, data: result };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}