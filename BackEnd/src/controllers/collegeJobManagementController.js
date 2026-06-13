import { getJobPostedByCollegeService ,deleteJobPostingService } from "../services/jobManagementService.js";
import { getCollegeService } from "../services/collegeService.js";

export const getCollegePostedJobs = async (req, res) => {
    const collegeId = req.user._id;
    const { jobType,key } = req.params;//
    const { active } = req.query; 
   // const { active } = req.query;
console.log("active param:", active, "| type:", typeof active);
    
    if (!jobType) return res.status(404).json({ msg: "job not found!" });
    // console.log("companyid: ", companyId);   
    try {
        const collegeProfile = await getCollegeService(collegeId);
        if (!collegeProfile) {
            return res.status(404).json({ error: "College profile not found" });
        }

      //  let response = await getJobPostedByCollegeService(collegeProfile.data[0]._id, jobType, key);
      let response = await getJobPostedByCollegeService(
            collegeProfile.data[0]._id, 
            jobType, 
            key,
            undefined, // isVisited
            active     // ✅
        );
        // console.log(response);
        res.status(200).json(response);
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ msg: "Internal server error!" });
    }
}


export const inActiveCollegeJob = async (req, res) => {
    const { jobId } = req.params;
    const collegeUserId = req.user._id;

    try {
        // 1. Get the profile to find the actual College Document ID
        const collegeProfile = await getCollegeService(collegeUserId);
        const profileId = collegeProfile?.data?.[0]?._id;

        if (!profileId) {
            return res.status(404).json({ 
                success: false, 
                msg: "College profile not found" 
            });
        }

        // 2. Call the service (matching previous logic)
        const response = await deleteJobPostingService(jobId, profileId);
        
        return res.status(200).json({
            success: true,
            msg: response.msg
        });

    } catch (error) {
        console.error("Delete College Job Controller Error:", error);

        // Determine status code based on error message
        let statusCode = 500;
        if (error.message.includes("not found") || error.message.includes("unauthorized")) {
            statusCode = 404; // Or 403
        } else if (error.message.includes("Invalid")) {
            statusCode = 400;
        }

        return res.status(statusCode).json({ 
            success: false, 
            msg: error.message || "Internal server error" 
        });
    }
};
// export const deleteCollegeJob = async (req, res) => {
//     try {
//         console.log(0)
//         const collegeUserId = req.user._id;
//         const { jobId } = req.params;

//         if (!jobId) {
//             return res.status(400).json({ 
//                 success: false, 
//                 msg: "Job ID is required" 
//             });
//         }

//         // 1️⃣ Get College Profile to extract the actual Profile ID
//         const collegeProfile = await getCollegeService(collegeUserId);
//         const profileId = collegeProfile?.data?.[0]?._id;

//         if (!profileId) {
//             return res.status(404).json({ 
//                 success: false, 
//                 msg: "College profile not found" 
//             });
//         }

//         // 2️⃣ Verify ownership and Soft Delete (Mark as inactive)
//         // This combines the "Find" and "Update" into one step for safety
//         const updatedJob = await JobPostingTable.findOneAndUpdate(
//             { 
//                 _id: jobId, 
//                 collegePosted: profileId, // Ensures the college owns this job
//                 inactive: { $ne: true }    // Only update if not already inactive
//             },
//             { $set: { inactive: true } },
//             { new: true }
//         );

//         // 3️⃣ If no job was found/updated, it means ID is wrong or unauthorized
//         if (!updatedJob) {
//             return res.status(404).json({
//                 success: false,
//                 msg: "Job not found or unauthorized to delete"
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             msg: "Job marked as inactive successfully",
//             data: updatedJob
//         });

//     } catch (error) {
//         console.error("Error deleting college job:", error);
//         return res.status(500).json({ 
//             success: false, 
//             msg: "Internal server error",
//             error: error.message 
//         });
//     }
// };