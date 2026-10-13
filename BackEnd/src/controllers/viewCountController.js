import { viewCountService } from "../services/viewCountService.js";

export async function ViewController(req, res) {
    try {
        const { jobId } = req.params;
        const userId = req.user._id;
        const viewerId = userId;

        if (!viewerId || !jobId) {
            return res.status(400).json({ message: "Invalid!" });
        }

        const incremented = await viewCountService(jobId, viewerId);
        // return res.status(200);

        //commented becuase no need to send response to user
        if (incremented) {
            return res.status(200).json({ message: "Unique view counted and job details sent" });
        } else {
            return res.status(200).json({ message: "Viewed already - no increment" });
        }
    } catch (error) {
        console.error("Error in handleJobView:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
