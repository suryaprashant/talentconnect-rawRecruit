import { fetchReferralApplicationsService } from "../services/adminService.js";
import { countApplicationsService } from "../services/applicationService.js";
import { getCollegeService } from "../services/collegeService.js";
import { getCompanyService, getEmployerService } from "../services/companyService.js";
import { deleteJobByIdService, getJobPostedByCompanyService, deleteReferralJobByIdService} from "../services/jobPostingService.js";
import { getStudentService } from "../services/studentService.js";
import Onboarding from "../models/studentonboardingModel.js"; // adjust path as per your project structure

export const getPostedJobs = async (req, res) => {
    const Id = req.user._id;
    const userType = req.user.userType;
    //const { jobType, status } = req.query;
    const { jobType, status, active } = req.query; 

    if (!jobType || !status) return res.status(404).json({ msg: "parameters missing!" });

   

    try {

        let companyProfile;
        if (userType === 'college') {
            companyProfile = await getCollegeService(Id);
            // console.log("college profile: ", companyProfile);
        }
        else if (userType === 'company') {
            companyProfile = await getCompanyService(Id);
        }else if(userType === 'professional'){
            companyProfile = await getStudentService(Id);
        }
        else if(userType === 'employer'){
            companyProfile = await getEmployerService(req.user);
            // console.log("Employer profile: ", companyProfile);
        }

     
        if (!companyProfile || companyProfile.success === false || !companyProfile.data || companyProfile.data.length === 0) {
            return res.status(404).json({ error: "Company profile not found" });
        }

        const jobs = await getJobPostedByCompanyService(companyProfile.data[0]._id, jobType, userType, req.user);
     
      

        if (!jobs || !jobs.success || !jobs.response) {
            return res.status(404).json({ msg: "Could not find jobs for this profile." });
        }

        // const jobsWithApplicationCount = await Promise.all(
        //     jobs?.response?.map(async (job) => {
        //         const count = await countApplicationsService(job._id, jobType, status);
               
        //         const applicationCount = count?.count;
        //         return {
        //             ...job,
        //             applicationCount,
        //         };
        //     })
        // );

        // console.log("Jobs with application count: ", jobsWithApplicationCount); 
   
let filteredJobs = jobs.response;

if (active === 'false') {
   
    filteredJobs = jobs.response.filter(job => job.inactive === true);
} else {
    
    filteredJobs = jobs.response.filter(job => job.inactive !== true);
}

        const jobsWithApplicationCount = await Promise.all(
            filteredJobs.map(async (job) => {
                const count = await countApplicationsService(job._id, jobType, status);
                const applicationCount = count?.count;
                return { ...job, applicationCount };
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
  
    try {
        const companyProfile = await getCompanyService(companyId);
        if (!companyProfile) return res.status(404).json({ error: "Company profile not found" });

        const response = await deleteJobByIdService(jobId, companyProfile.data[0]._id);
        if (response.success === true) return res.status(200).json(response.msg);

        res.status(400).json("Bad request!")
    } catch (error) {
        console.error("Delete Job Controller Error:", error);
        res.status(500).json({ msg: error.message || "Internal server error" });
    }
}

export const deleteReferralJob = async (req, res) => {
    const { jobId } = req.params;
    const userId = req.user._id;

    try {
        // Fetch professional profile using userId from Auth
        const professionalProfile = await Onboarding.findOne({ 
            userId,
            profileType: "professional"
        });

        if (!professionalProfile) 
            return res.status(404).json({ error: "Professional profile not found" });

        const response = await deleteReferralJobByIdService(jobId, professionalProfile._id);

        if (!response.success) 
            return res.status(response.status || 400).json({ msg: response.msg });

        return res.status(200).json({ msg: response.msg });

    } catch (error) {
        console.error("Delete Referral Job Controller Error:", error);

        if (error.status === 404) return res.status(404).json({ msg: error.message });
        if (error.status === 403) return res.status(403).json({ msg: error.message });

        res.status(500).json({ msg: error.message || "Internal server error" });
    }
};

// ============= Employer =====================

export const getEmployerJobs = async (req, res) => {
    const { jobType , status} = req.params;
    const userType = req.user.userType;
    if (!jobType) {
        return res.status(404).json({ msg: "Job type not specified" });
    }
    try {
        let profileId;
        const employerProfile = await getEmployerService(req.user);
        if (!employerProfile || !employerProfile.success || employerProfile.data.length === 0) {
            return res.status(404).json({ error: employerProfile.msg || "Employer profile not found" });
        }
        profileId = employerProfile.data[0]._id;
        const jobs = await getJobPostedByCompanyService(profileId, jobType, userType);

        if (!jobs || !jobs.success) {
            return res.status(404).json({ msg: "Could not find jobs for this profile." });
        }

        const jobsWithApplicationCount = await Promise.all(
            jobs?.response?.map(async (job) => {
                const count = await countApplicationsService(job._id, jobType, status);
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

export const getReferralApplicationsForProfessional = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1️⃣ Get professional profile
    const professional = await getStudentService(userId);

    if (!professional || !professional.data?.length) {
      return res.status(404).json({
        success: false,
        message: "Professional profile not found",
      });
    }

    const professionalProfileId = professional.data[0]._id;

    // 2️⃣ Fetch ONLY admin-approved applications for this professional’s jobs
    const response = await fetchReferralApplicationsService({
      professionalProfileId,
      adminApprovalStatus: "Approved",
    });

    return res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("❌ getReferralApplicationsForProfessional:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
    });
  }
};