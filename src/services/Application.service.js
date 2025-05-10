import Application from "../models/Application.js";
import Job from "../models/Job.js";

export async function fetchApplicationService(query, userType) {

    try {
        let applicationData;
        if (userType === 'User') {
            applicationData = await Application.find(query).populate({
                path: 'job',
                select: '-allowedColleges'
            });
        } else if (userType === 'Company') {
            applicationData = await Application.find(query).populate('user');
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

export async function createApplicationService(applicationData) {

    try {
        const newApplication = new Application(applicationData);
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
            .populate('user')
            .lean();
        return { success: true, data: response };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}

export async function getAcceptedOnCampusService(jobId) {
    try {
        const response = await Job.findById(jobId)
            .populate('allowedColleges')
            .lean();

        return { success: true, data: response };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}