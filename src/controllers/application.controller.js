import StudentOverview from "../models/Student.js";

import { createApplicationService, fetchApplicationService, fetchAcceptedCandidatesService, getAcceptedOnCampusService } from "../services/Application.service.js";
import { fetchOpportunityService } from "../services/Job.service.js";

// apply for opportunity
export async function createApplication(req, res) {
    const { userId, jobId } = req.body;
    if (!userId || !jobId) return res.status(404).json({ msg: "UserId or JobId missing" });

    try {
        // check for the validity of user and job ids... later removed by middlewares
        const user = await StudentOverview.findById(userId);
        const job = await fetchOpportunityService({ _id: jobId });
        if (!user || !job) {
            return res.status(404).json({ msg: "Invalid userId or jobId" });
        }

        const query = {
            user: userId,
            job: jobId,
            statusHistory: [{ status: "Applied" }],
            currentStatus: "Applied"
        }

        const application = await createApplicationService(query);
        res.status(201).json(application);
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

// get application details
export async function getUserApplication(req, res) {
    const { Id } = req.body;
    if (!Id) return res.status(404).json({ error: "Invalid" });

    let userType = "User"; //handled by middleware
    const query = {};
    if (userType === 'User') query.user = Id;
    else if (userType === 'Company') query.job = Id;

    try {
        const response = await fetchApplicationService(query, userType);
        // console.log(response);

        if (response.success) res.status(200).json(response);
        else res.status(404).json(response);
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ Error: "Internal server error" });
    }
}

// action by company

// offcampus
export async function getAcceptedCandidates(req, res) {
    const jobId = req.params.id;
    try {
        const response = await fetchAcceptedCandidatesService(jobId);
        // console.log(response);
        res.status(200).json(response.data);
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ Error: "Internal server error" });
    }
}

// oncampus
export async function getAcceptedCandidatesFromCollege(req, res) {
    const { jobId } = req.params;

    // console.log(req.body, req.params, req.query);
    // console.log(req.params.jobId);

    if (!jobId) return res.status(404).json({ error: 'Job not found!' });

    try {
        const response = await getAcceptedOnCampusService(jobId);
        res.status(200).json(response.data);
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ Error: "Internal server error" });
    }
}