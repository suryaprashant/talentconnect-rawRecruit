import HiringDrive from "../models/HiringChannelOffCampusRegister.js";
import Application from '../models/Application.js';

export async function getOffCampusJobsService(companyId) {
    try {
        const response = await HiringDrive.find({ companyId: companyId }, {
            // custom fields only
        }).lean();
        return { success: true, data: response.data };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to create profile");
    }
}

export async function getOffCampusJobApplicantsService(jobId) {
    try {
        const response = await Application.find({ job: jobId }).populate('user').lean();
        return { success: true, data: response };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to create profile");
    }
}