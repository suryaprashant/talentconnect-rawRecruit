import { getOffCampusJobsService } from "../services/jobManagementService.js";
import { getOffCampusApplicantsService } from "../services/Application.service.js";
import CompanyProfile from "../models/companyDashboard/companyProfileModel.js";

export const getOffcampusJobs = async (req, res) => {
    const companyId = req.user._id;
    // console.log("companyid: ", companyId);   
    try {
        const companyProfile = await CompanyProfile.findOne({ userId: companyId });
        // console.log("companyid: ", companyProfile._id);
        if (!companyProfile) {
            return res.status(404).json({ error: "Company profile not found" });
        }

        // if (!companyId) return res.status(404).json({ msg: "Company not found!" });
        const response = await getOffCampusJobsService(companyProfile._id);
        res.status(200).json(response);
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ msg: "Internal server error!" });
    }
}

export const getOffcampusJobApplicants = async (req, res) => {
    const { jobId } = req.params;
    if (!jobId) return res.status(404).json({ msg: "Job not found!" });

    const query = {};
    query.job = jobId;

    try {
        const response = await getOffCampusApplicantsService(query);
        res.status(200).json(response);
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ msg: "Internal server error!" });
    }
}

export const getShortlistedOffcampusJobApplicants = async (req, res) => {
    const { jobId } = req.params;
    if (!jobId) return res.status(404).json({ msg: "Job not found!" });

    const query = {};
    query.job = jobId;
    query.currentStatus = "Shortlisted";

    try {
        const response = await getOffCampusApplicantsService(query);
        res.status(200).json(response);
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ msg: "Internal server error!" });
    }
}