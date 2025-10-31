// import CompanyProfile from "../models/companyDashboard/companyProfileModel.js";
import { getJobPostedByCollegeService } from "../services/jobManagementService.js";

// import collegeOnboardingModel from "../models/collegeDashboard/collegeOnboardingModel.js"
import { getCollegeService } from "../services/collegeService.js";

export const getCollegePostedJobs = async (req, res) => {
    const collegeId = req.user._id;
    const { jobType,key } = req.params;
    console.log(key);
    
    if (!jobType) return res.status(404).json({ msg: "job not found!" });
    // console.log("companyid: ", companyId);   
    try {
        const collegeProfile = await getCollegeService(collegeId);
        if (!collegeProfile) {
            return res.status(404).json({ error: "College profile not found" });
        }

        const response = await getJobPostedByCollegeService(collegeProfile.data[0]._id, jobType, key);
        // console.log(response);
        res.status(200).json(response);
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ msg: "Internal server error!" });
    }
}

