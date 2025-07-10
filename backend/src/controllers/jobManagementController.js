import { getOffCampusJobsService } from "../services/jobManagementService.js";
import { getOffCampusApplicantsService } from "../services/Application.service.js";

export const getOffcampusJobs = async (req, res) => {
    const companyId = req.user._id;
    try {
        if (!companyId) return res.status(404).json({ msg: "Company not found!" });
        const response = await getOffCampusJobsService(companyId);
        res.status(200).json(response);
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ msg: "Internal server error!" });
    }
}

export const getOffcampusJobApplicants = async (req, res) => {
    const { jobId } = req.params;
    if (!jobId) return res.status(404).json({ msg: "Job not found!" });

    try {
        const response = await getOffCampusApplicantsService(jobId);
        res.status(200).json(response);
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ msg: "Internal server error!" });
    }
}