import { redisConnection } from "../common/redis.js";
import { JobPostingTable } from "../models/jobPostingsModel.js";

export async function viewCountService(jobId, viewerId) {
    console.log("called");

    if (!viewerId) {
        throw new Error("No viewerId provided");
    }

    console.log(jobId, viewerId);

    const redisKey = `viewed:${jobId}:${viewerId}`;

    const alreadyViewed = await redisConnection.exists(redisKey);

    if (alreadyViewed) {
        return false;
    }

    // mark viewed - 7 days expiry
    await redisConnection.set(redisKey, "1", "EX", 604800);

    await JobPostingTable.findByIdAndUpdate(jobId, {
        $inc: { views: 1 },
    });

    return true;
}