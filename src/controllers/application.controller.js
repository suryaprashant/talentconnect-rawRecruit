import StudentOverview from "../models/Student.js";
import { createApplicationService, fetchApplicationService } from "../services/Application.service.js";
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