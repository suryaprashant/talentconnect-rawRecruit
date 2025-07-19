import { createApplicationService, fetchApplicationService, fetchAcceptedCandidatesService, getAcceptedOnCampusService, checkExitence, createInternshipApplicationService, checkInternshipExitence, getOffCampusApplicantsService } from "../services/Application.service.js";
import { checkOpportunityService } from "../services/Job.service.js";
import { checkStudentService, getStudentService } from "../services/Student.service.js";

// apply for opportunity
export async function createApplication(req, res) {
    const { jobId } = req.body;
    const userId = req.user._id;

    if (!userId || !jobId) return res.status(404).json({ msg: "Fields missing" });

    try {
        const user = await getStudentService(userId);
        if (await checkExitence(jobId, user.data[0]._id) === false) return res.status(403).json({ msg: "Already Applied" });

        const job = await checkOpportunityService(jobId);
        if (!job || !user) {
            return res.status(404).json({ msg: "User or Job not found!" });
        }

        const application = await createApplicationService(user.data[0]._id, jobId);
        res.status(201).json(application);
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

// get offcampus application details
export async function getUserApplication(req, res) {
    const userId = req.query.Id;
    if (!userId) return res.status(404).json({ error: "Invalid" });

    try {
        const response = await fetchApplicationService(userId);
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
    if (!jobId) return res.status(404).json({ msg: "Job not found!" });

    const query = {};
    query.job = jobId;
    query.currentStatus = "Accepted";

    try {
        const response = await getOffCampusApplicantsService(query);
        // console.log(response);
        res.status(200).json(response.data);
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ Error: "Internal server error" });
    }
}

// oncampus (no use)
// export async function getAcceptedCandidatesFromCollege(req, res) {
//     const { companyId } = req.params;
//     if (!companyId) return res.status(404).json({ error: 'Job not found!' });

//     try {
//         const response = await getAcceptedOnCampusService(companyId);

//         res.status(200).json(response.data);
//     } catch (error) {
//         console.log("Error: ", error);
//         res.status(500).json({ Error: "Internal server error" });
//     }
// }

// internship
export async function createIntershipApplication(req, res) {
    const { internshipId } = req.body;
    const userId = req.user._id;

    if (!userId || !internshipId) return res.status(404).json({ msg: "Fields missing" });

    try {
        if (await checkInternshipExitence(internshipId, userId) === true) return res.status(403).json({ msg: "Already Applied" });

        // const user = await checkStudentService(userId);
        // const job = await checkOpportunityService(internshipId);
        // if (!job || !user) {
        //     return res.status(404).json({ msg: "User or Job not found!" });
        // }

        const application = await createInternshipApplicationService(userId, internshipId);
        res.status(201).json(application);
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
}