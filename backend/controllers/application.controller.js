import Application from "../models/Application.js";
import {JobModel} from "../models/createJob.model.js";
import StudentOverview from "../models/Student.js";
const Job = JobModel;
// apply for opportunity(user)
export async function createApplication(req, res) {
    const { userId, jobId } = req.body;
    if (!userId || !jobId) return res.status(404).json({ msg: "UserId or JobId missing" });

    try {

        // check for the validity of user and job ids... later may be removed by middlewares
        const user = await StudentOverview.findById(userId);
        const job = await Job.findById(jobId);
        if (!user || !job) {
            return res.status(404).json({ msg: "Invalid userId or jobId" });
        }

        const application = await Application.create({
            user: userId,
            job: jobId,
            statusHistory: [{ status: "Applied" }],
            currentStatus: "Applied"
        });

        res.status(201).json(application);
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ error: "Internal Server Error!" });
    }
}

// get application details(user)
export async function getUserApplication(req, res) {
    const {userId} = req.body;

    try {
        const response = await Application.find({ user: userId }).populate('job');
        console.log(response);

        res.status(200).json({ Applications: response });
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ Error: "Internal Server" });
    }
}

// get all users who applied for a specific job (admin or employer)
export async function getApplicationsForJob(req, res) {
    const { jobId } = req.params;

    if (!jobId) {
        return res.status(400).json({ msg: "JobId is required" });
    }

    try {
        const applications = await Application.find({ job: jobId })
            .populate('user')  // populate student/user details
           // .populate('job');  // optional: also include job details

        res.status(200).json({ applications });
    } catch (error) {
        console.log("Error fetching applications for job: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
