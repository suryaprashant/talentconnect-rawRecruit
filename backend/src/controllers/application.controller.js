import CompanyProfile from "../models/companyDashboard/companyProfileModel.js";
import { createApplicationService, checkExitenceService, createInternshipApplicationService, checkInternshipExitence, getOffCampusApplicantsService, fetchShortlistedCandidates, createJobListingApplicationService, fetchOffcampusApplicationService, fetchJoblistingApplicationService, fetchInternshipApplicationService, checkExitenceService } from "../services/Application.service.js";
import { getCollegeService } from "../services/collegeService.js";
import { checkJobListingOpportunityService, checkOpportunityService } from "../services/Job.service.js";
import { getStudentService } from "../services/Student.service.js";
import { getCompanyProfile } from "./CompanyDashboard/companyProfileController.js";

// save opportunity
export async function saveJobByUser(req, res) {
    const { jobId } = req.body;
    const userId = req.user._id;

    try {
        const user = await getStudentService(userId);

        // if (!userId || !jobId) return res.status(404).json({ msg: "Fields missing" });
        if (!jobId || !user) return res.status(404).json({ msg: "User or Job not found!" });
        if (await checkExitenceService(user.data[0]._id, user.data[0].userType, jobId, "Off-campus") === true) return res.status(403).json({ msg: "Already Applied" });

        const application = await createApplicationService(user.data[0]._id, user.data[0].userType, jobId, "Off-campus");
        res.status(201).json(application);
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

// apply for opportunity

// offcampus
export async function createOffcampusApplication(req, res) {
    const { jobId } = req.body;
    const userId = req.user._id;

    try {
        const user = await getStudentService(userId);

        // if (!userId || !jobId) return res.status(404).json({ msg: "Fields missing" });
        if (!jobId || !user) return res.status(404).json({ msg: "User or Job not found!" });
        if (await checkExitenceService(user.data[0]._id, user.data[0].userType, jobId, "Off-campus") === true) return res.status(403).json({ msg: "Already Applied" });

        const application = await createApplicationService(user.data[0]._id, user.data[0].userType, jobId, "Off-campus");
        res.status(201).json(application);
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

// joblisting
export async function createJobListingApplication(req, res) {
    const { jobId } = req.body;
    const userId = req.user._id;

    if (!userId || !jobId) return res.status(404).json({ msg: "Fields missing" });

    try {
        const user = await getStudentService(userId);

        if (!jobId || !user) return res.status(404).json({ msg: "User or Job not found!" });
        if (await checkExitenceService(user.data[0]._id, user.data[0].userType, jobId, "Job-posting") === true) return res.status(403).json({ msg: "Already Applied" });

        const application = await createApplicationService(user.data[0]._id, user.data[0].userType, jobId, "Job-posting");
        res.status(201).json(application);
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

// internship
export async function createIntershipApplication(req, res) {
    const { internshipId } = req.body;
    const userId = req.user._id;

    try {
        // to get userId from user database
        const user = await getStudentService(userId);

        if (!user || !internshipId) return res.status(404).json({ msg: "Invalid" });
        if (await checkExitenceService(user.data[0]._id, user.data[0].userType, internshipId, "Internship") === true) return res.status(403).json({ msg: "Already Applied" });

        const application = await createApplicationService(user.data[0]._id, user.data[0].userType, internshipId, "Internship");
        res.status(201).json(application);
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

// oncampus
export async function createOncampusApplication(req, res) {
    const { driveId } = req.body;
    const userId = req.user._id;

    try {
        // to get collegeId from college database
        const user = await getCollegeService(userId);

        if (!user || !driveId) return res.status(404).json({ msg: "Invalid" });
        if (await checkExitenceService(user.data[0]._id, user.data[0].userType, driveId, "On-campus") === true) return res.status(403).json({ msg: "Already Applied" });

        const application = await createApplicationService(user.data[0]._id, user.data[0].userType, driveId, "On-campus");
        res.status(201).json(application);
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

// poolcampus
export async function createPoolcampusApplication(req, res) {
    const { driveId } = req.body;
    const userId = req.user._id;

    try {
        // to get collegeId from college database
        const user = await getCollegeService(userId);

        if (!user || !driveId) return res.status(404).json({ msg: "Invalid" });
        if (await checkExitenceService(user.data[0]._id, user.data[0].userType, driveId, "Pool-campus") === true) return res.status(403).json({ msg: "Already Applied" });

        const application = await createApplicationService(user.data[0]._id, user.data[0].userType, driveId, "Pool-campus");
        res.status(201).json(application);
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

// get application details by candidate
export async function getOffcampusUserApplication(req, res) {
    const userId = req.user._id;
    const user = await getStudentService(userId);
    if (!user) return res.status(404).json({ error: "Invalid user" });

    try {
        const response = await fetchOffcampusApplicationService(user.data[0]._id);
        // console.log(response);

        if (response.success) res.status(200).json(response);
        else res.status(404).json(response);
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ Error: "Internal server error" });
    }
}

export async function getJobListingUserApplication(req, res) {
    const userId = req.user._id;

    try {
        const user = await getStudentService(userId);
        if (!user) return res.status(404).json({ error: "Invalid user" });

        const response = await fetchJoblistingApplicationService(user.data[0]._id);

        if (response.success) res.status(200).json(response);
        else res.status(404).json(response);
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ Error: "Internal server error" });
    }
}

export async function getInternshipUserApplication(req, res) {
    const userId = req.user._id;

    try {
        const user = await getStudentService(userId);
        if (!user) return res.status(404).json({ error: "Invalid user" });

        const response = await fetchInternshipApplicationService(user.data[0]._id);
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
export async function getAcceptedCandidatesByJob(req, res) {
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

// getAllshortlistedcandidates
export async function getShortlistedCandidatesByCompany(req, res) {
    const companyId = req.user._id;

    try {
        const company = await CompanyProfile.find({ userId: companyId }).lean();
        if (!company) return res.status(404).json({ msg: "company not found!" });
        const response = await fetchShortlistedCandidates(company[0]._id, "Shortlisted");
        // console.log(response);
        res.status(200).json(response);
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ Error: "Internal server error" });
    }
}

// getAllAcceptedcandidates
export async function getAcceptedCandidatesByCompany(req, res) {
    const companyId = req.user._id;

    try {
        const company = await CompanyProfile.find({ userId: companyId }).lean();
        if (!company) return res.status(404).json({ msg: "company not found!" });
        const response = await fetchShortlistedCandidates(companyId, "Accepted");
        // console.log(response);
        res.status(200).json(response);
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