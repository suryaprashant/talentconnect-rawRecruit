import { countApplicationsService } from "../services/applicationService.js";
import { getCollegeService } from "../services/collegeService.js";
import { getCompanyService } from "../services/companyService.js";
import { deleteJobByIdService, getJobPostedByCompanyService } from "../services/jobPostingService.js";

// all jobs posted by company
export const getPostedJobs = async (req, res) => {
    const Id = req.user._id;
    const userType = req.user.userType;
    const { jobType } = req.params;
    if (!jobType) return res.status(404).json({ msg: "job not found!" });

    try {

        let companyProfile;
        if (userType === 'college') {
            companyProfile = await getCollegeService(Id);
        }
        else if (userType === 'company') {
            companyProfile = await getCompanyService(Id);
        }

        // console.log("company: ", companyProfile)
        if (!companyProfile.data) {
            return res.status(404).json({ error: "Company profile not found" });
        }

        const jobs = await getJobPostedByCompanyService(companyProfile.data[0]._id, jobType,userType);
        //  console.log("res: ",jobs);
        // application count service 
        const jobsWithApplicationCount = await Promise.all(
            jobs?.response?.map(async (job) => {
                const count = await countApplicationsService(job._id, jobType);
                const applicationCount = count?.count;
                return {
                    ...job,
                    applicationCount,
                };
            })
        );

        res.status(200).json(jobsWithApplicationCount);
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ msg: "Internal server error!" });
    }
}

export const deleteJob = async (req, res) => {
    const { jobId } = req.params;
    const companyId = req.user._id;
    // if (!jobType) return res.status(404).json({ msg: "job not found!" });
    // console.log("companyid: ", companyId);   
    try {
        const companyProfile = await getCompanyService(companyId);
        if (!companyProfile) return res.status(404).json({ error: "Company profile not found" });

        const response = await deleteJobByIdService(jobId, companyProfile.data[0]._id);
        if (response.success === true) return res.status(200).json(response.msg);

        // after this from application table clear all application for this job

        res.status(400).json("Bad request!")
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ msg: "Internal server error!" });
    }
}