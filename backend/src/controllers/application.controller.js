import { createApplicationService, fetchApplicationService, fetchAcceptedCandidatesService, getAcceptedOnCampusService } from "../services/Application.service.js";
import { checkOpportunityService } from "../services/Job.service.js";
import { checkStudentService } from "../services/Student.service.js";

// apply for opportunity
export async function createApplication(req, res) {
    const { userId, jobId } = req.body;
    if (!userId || !jobId) return res.status(404).json({ msg: "UserId or JobId missing" });

    try {
        // check for the validity of user and job ids... will remove with middlewares authentication
        const user = await checkStudentService(userId);
        const job = await checkOpportunityService(jobId);
        if (!user || !job) {
            return res.status(404).json({ msg: "User or Job not found" });
        }

        const application = await createApplicationService(userId, jobId);
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
    if (!jobId) return res.status(404).json({ error: 'Job not found!' });

    try {
        const response = await getAcceptedOnCampusService(jobId);
        console.log(response);
        res.status(200).json(response.data);
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ Error: "Internal server error" });
    }
}