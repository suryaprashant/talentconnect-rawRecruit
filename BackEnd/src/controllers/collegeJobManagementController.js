import { getJobPostedByCollegeService ,deleteJobPostingService } from "../services/jobManagementService.js";
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

export const deleteCollegeJob = async (req, res) => {
    try {
        const collegeId = req.user._id;
        const { jobId } = req.params;

        if (!jobId) {
            return res.status(400).json({ 
                success: false, 
                msg: "Job ID is required" 
            });
        }

 
        const collegeProfile = await getCollegeService(collegeId);
        if (!collegeProfile || !collegeProfile.data || collegeProfile.data.length === 0) {
            return res.status(404).json({ 
                success: false, 
                msg: "College profile not found" 
            });
        }

        // Delete the job using service
        const result = await deleteJobPostingService(
            jobId, 
            collegeProfile.data[0]._id
        );

        return res.status(200).json({
            success: true,
            message: result.message,
            data: result.data
        });

    } catch (error) {
        console.error("Error deleting job:", error);

       
        if (error.message.includes("not found") || error.message.includes("permission")) {
            return res.status(404).json({ 
                success: false, 
                msg: error.message 
            });
        }

        if (error.message.includes("Invalid")) {
            return res.status(400).json({ 
                success: false, 
                msg: error.message 
            });
        }

        return res.status(500).json({ 
            success: false, 
            msg: "Internal server error" 
        });
    }
};

