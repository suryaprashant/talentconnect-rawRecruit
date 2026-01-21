// import HiringDrive from "../models/hiringChannelOffCampusRegisterModel.js";

import { JobPostingTable } from "../models/jobPostingsModel.js";

// fetch jobs
export async function fetchOpportunityService(query) {
    try {
        const response = await JobPostingTable.find(query)
            .populate({
                path: 'companyPosted',
                select: 'companyDetails'
            })
            .lean();

        // cal status
        const now = Date.now();
        const newResponse = response.map(item => {
            const start = new Date(item.hiringStartDate).getTime();
            const end = new Date(item.hiringEndDate).getTime();

            return {
                ...item,
                status: now >= start && now <= end ? 'Open' : 'Closed'
            };
        });

        return { success: true, data: newResponse };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}
export async function fetchReferalOpportunityService(query) {
    try {
        const response = await JobPostingTable.find(query)
            .populate({
                path: 'candidatePosted',
                select: 'name jobRoles experiences'
            })
            .lean();

        // cal status
        const now = Date.now();
        const newResponse = response.map(item => {
            const start = new Date(item.hiringStartDate).getTime();
            const end = new Date(item.hiringEndDate).getTime();

            return {
                ...item,
                status: now >= start && now <= end ? 'Open' : 'Closed'
            };
        });

        return { success: true, data: newResponse };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}

export async function checkOpportunityService(jobId) {

    try {
        const response = await JobPostingTable.exists({ _id: jobId });
        if (response) return true;
        return false;
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}

export async function checkJobListingOpportunityService(jobId) {

    try {
        const response = await JobPostingTable.exists({ _id: jobId });
        if (response) return true;
        return false;
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}

export async function fetchInternshipByIdService(Id) {
    try {
        const response = await JobPostingTable.findById(Id)
            .populate({
                path: 'companyPosted',
                select: 'companyDetails'
            })
            .lean();
        return { success: true, data: response };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}

export async function fetchInternshipService(yearsOfExperience) {
    try {
        const response = await JobPostingTable.find({
            openingFor: 'Offcampus',
            yearsOfExperience: yearsOfExperience,
            jobType: 'Internship' // keep this if you store internships separately
        })
        .populate({
            path: 'companyPosted',
            select: 'companyDetails'
        })
        .sort({ createdAt: -1 })
        .lean();

        return {
            success: true,
            data: response
        };
    } catch (error) {
        console.log("Error fetching internships:", error.message);
        throw new Error("Failed to fetch internships");
    }
}
