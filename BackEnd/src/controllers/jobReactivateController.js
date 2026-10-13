import { resolveProfile }     from "../utils/resolveProfile.js";
import { reactivateJobService } from "../services/jobReactivateService.js";

export const reactivateJob = async (req, res) => {
    const { jobId }              = req.params;
    const { startDate, endDate } = req.body;
    const userId                 = req.user._id;
  const role                   = req.user.userType; 
    if (!startDate || !endDate)
        return res.status(400).json({ msg: "startDate and endDate are required" });

    try {
        // Step 1: Resolve correct profile for this user
        const { profile, profileType } = await resolveProfile(userId, role);

        // Step 2: Reactivate the job
        const response = await reactivateJobService(
            jobId,
            profile._id,
            profileType,
            startDate,
            endDate
        );

        return res.status(200).json({ msg: response.msg, job: response.job });

    } catch (error) {
        console.error("Reactivate Job Controller Error:", error);
        const status = error.status || 500;
        return res.status(status).json({ msg: error.message || "Internal server error" });
    }
};