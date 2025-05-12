import { createOpportunityService, fetchOpportunityService } from "../services/Job.service.js";

export async function createJob(req, res) {
    // link path: only allowed to company (middleware implemetation)

    try {
        const response = await createOpportunityService(req.body);
        res.status(201).json(response);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function fetchOnCampusOpportunities(req, res) {
    // link path: only allowed to college (middleware implemetation)

    const query = {};
    query.openingFor = "Oncampus";

    try {
        const response = await fetchOpportunityService(query);
        if (response.success) res.status(200).json({ data: response.data });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function fetchInternshipOpportunities(req, res) {
    // const yearsOfExperience=0; //to be updated by middleware
    const query = {};
    query.jobType = "Internship";
    // query.yearsOfExperience=yearsOfExperience;

    try {
        const response = await fetchOpportunityService(query);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

// export async function fetchOffCampusOpportunities(req, res) {
//     // link path: only allowed to college (middleware implemetation)

//     try {
//         const response = await fetchOpportunityService("Offcampus");
//         if (response.success) res.status(200).json({ data: response.data });
//     } catch (error) {
//         res.status(500).json({ error: "Internal server error" });
//     }
// }