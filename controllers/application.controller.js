import Application from "../models/Application.js";
import Job from "../models/Job.js";
import StudentOverview from "../models/Student.js";

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