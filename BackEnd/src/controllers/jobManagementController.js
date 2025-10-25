import { countApplicationsService } from "../services/applicationService.js";
import { getCompanyService, getEmployerService } from "../services/companyService.js";
import { deleteJobByIdService, getJobPostedByCompanyService } from "../services/jobPostingService.js";

// all jobs posted by company
export const getPostedJobs = async (req, res) => {
    const companyId = req.user._id;
    const { jobType } = req.params;
    if (!jobType) return res.status(404).json({ msg: "job not found!" });

    try {
        const companyProfile = await getCompanyService(companyId);
        if (!companyProfile) {
            return res.status(404).json({ error: "Company profile not found" });
        }

        const jobs = await getJobPostedByCompanyService(companyProfile.data[0]._id, jobType);
 
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

// ============= Employer =====================

export const getEmployerJobs = async(req,res) => {
    const{jobType} = req.params ;
    console.log("aaa gya hero", jobType) ;
    if(!jobType){
        return res.status(404).json({msg:"Job type not specified"}) ;
    }

    try {
        let profileId ;
        const employerProfile = await getEmployerService(req.user);
       if (!employerProfile || !employerProfile.success ||   employerProfile.data.length === 0 ) {
           return res.status(404).json({ error: employerProfile.msg || "Employer profile not found" });
        }
        profileId = employerProfile.data[0]._id ;
        const jobs = await getJobPostedByCompanyService(profileId, jobType);

        if (!jobs || !jobs.success) {
            return res.status(404).json({ msg: "Could not find jobs for this profile." });
        }
 
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