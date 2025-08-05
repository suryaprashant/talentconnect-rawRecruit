import { createPostingService } from "../services/jobPostingService.js"
import CompanyProfile from "../models/companyDashboard/companyProfileModel.js";

const sendResponse = (res, statusCode, data) => res.status(statusCode).json(data);
const sendError = (res, statusCode, message) => res.status(statusCode).json({ message });


export const createOffCampusJobPosting = async (req, res) => {
   
    try{
       const userId = req.user._id;
   
       const companyPostedId = await CompanyProfile.findOne({ userId });
   
       if (!companyPostedId) {
         return res.status(404).json({ error: "Company profile not found" });
       }
   
       const postingData ={
           ...req.body,
           companyPosted: companyPostedId._id,
           jobType: "Off-campus",
       }
       
       const newPosting = await createPostingService(postingData);
       if (!newPosting) {
         return sendError(res, 500, "Failed to create job posting");
       }
       sendResponse(res, 201, { message: "Off-campus posting created successfully!", data: newPosting });
    }
    catch (error) {
        console.error("Error in createOffCampusJobPosting:", error.message);
        sendError(res, 500, "Internal server error");
    }
};

export const createOnCampusPosting = async (req, res) => {
    try {
        const userId = req.user._id;

        const companyPostedId = await CompanyProfile.findOne({ userId });            
        if (!companyPostedId) {
            return res.status(404).json({ error: "Company profile not found" });
        }

        const postingData = {
            ...req.body,
            companyPosted: companyPostedId._id,
            jobType: "On-campus",
        };

        const newPosting = await createPostingService(postingData);
        if (!newPosting) {
            return sendError(res, 500, "Failed to create job posting");
        }
        sendResponse(res, 201, { message: "On-campus posting created successfully!", data: newPosting });
    }
    catch (error) {
        console.error("Error in createOnCampusPosting:", error.message);
        sendError(res, 500, "Internal server error");
    }
}


export const createPoolCampusPosting = async (req, res) => {
    try {
        const userId = req.user._id;

        const companyPostedId = await CompanyProfile.findOne({ userId });            
        if (!companyPostedId) {
            return res.status(404).json({ error: "Company profile not found" });
        }
        const postingData = {
            ...req.body,
            companyPosted: companyPostedId._id,
            jobType: "Pool-campus",
        };
        const newPosting = await createPostingService(postingData);
        if (!newPosting) {
            return sendError(res, 500, "Failed to create job posting");
        }
        sendResponse(res, 201, { message: "Pool-campus posting created successfully!", data: newPosting });
    }
    catch (error) {
        console.error("Error in createPoolCampusPosting:", error.message);
        sendError(res, 500, "Internal server error");
    }
}


export const createJobPosting = async (req, res) => {
    try {
        const userId = req.user._id;
        console.log("User ID:", userId);
        const companyPostedId = await CompanyProfile.findOne({ userId });
        if (!companyPostedId) {
            return res.status(404).json({ error: "Company profile not found" });
        }       
        const postingData = {
            ...req.body,
            companyPosted: companyPostedId._id,
            jobType: "Job-posting",
        };
        const newPosting = await createPostingService(postingData);
        if (!newPosting) {
            return sendError(res, 500, "Failed to create job posting");
        }
        sendResponse(res, 201, { message: "Job posting created successfully!", data: newPosting });
    }       
    catch (error) {
        console.error("Error in createJobPosting:", error.message);
        sendError(res, 500, "Internal server error");
    }
}


export const createInternshipPosting = async (req, res) => {
    try {
        const userId = req.user._id;

        const companyPostedId = await CompanyProfile.findOne({ userId });
        if (!companyPostedId) {
            return res.status(404).json({ error: "Company profile not found" });
        }
        const postingData = {
            ...req.body,
            companyPosted: companyPostedId._id,
            jobType: "Internship",
        };
        const newPosting = await createPostingService(postingData);
        if (!newPosting) {
            return sendError(res, 500, "Failed to create internship posting");
        }

        sendResponse(res, 201, { message: "Internship posting created successfully!", data: newPosting });
    } catch (error) {
        console.error("Error in createInternshipPosting:", error.message);
        sendError(res, 500, "Internal server error");
    }
}


