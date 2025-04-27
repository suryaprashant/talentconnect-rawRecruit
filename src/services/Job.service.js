import Job from "../models/Job.js";

// create by company
export async function createOpportunityService(jobData) {
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
        const response = await Job.find(query);
        return { success: true, data: response };
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


