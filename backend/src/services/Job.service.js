import Job from "../models/Job.js";

// create by company
export async function createOpportunityService(jobData, companyId) {
    jobData.companyPosted = companyId;
    try {
        const newJob = new Job(jobData);
        await newJob.save();
        return { success: true, message: 'Job Created!' };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to create job");
    }
}

// update opportunity by company

// fetch
export async function fetchOpportunityService(query) {

    try {
        // const response = await Job.find(query).populate('Company');
        const response = await Job.find(query).populate({
            path: 'companyPosted',
            select: 'companyName companyDescription companyDetails companyLocation state country'
        }).lean();
        return { success: true, data: response };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}

export async function checkOpportunityService(jobId) {

    try {
        const response = await Job.exists({ _id: jobId });
        if (response) return true;
        return false;
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}

// export async function fetchJobByIdService(Id) {
//     try {
//         const response = await Job.findById(Id);
//         return { success: true, data: response };
//     } catch (error) {
//         console.log("Error: ", error.message);
//         throw new Error("Failed to fetch");
//     }
// }


