import { JobPostingTable } from "../models/jobPostingsModel.js";

export async function getRegistrationsService(jobType, visibleTo) {
    try {
        const response = await JobPostingTable.find({ jobType: jobType, visibleTo: visibleTo })
            .populate({
                path: "companyPosted",
                select: "companyDetails profileImage",
            })
            .lean()
            .sort({ createdAt: -1 });
        return response;
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed");
    }
}

export async function getJobDetailByIdService(Id) {
    try {
        const response = await JobPostingTable.findById(Id)
            .populate({
                path: 'companyPosted',
                select: 'companyDetails profileImage hiringPreferences',
            })
            .lean();
        return response;
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed");
    }
}