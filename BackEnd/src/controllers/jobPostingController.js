import { createPostingService } from "../services/jobPostingService.js";

import collegeOnboardingModel from "../models/collegeDashboard/collegeOnboardingModel.js";
import OnboardingModel from "../models/studentonboardingModel.js";
import { getCompanyService } from "../services/companyService.js";
import { getCollegeService } from "../services/collegeService.js";
import { getStudentService } from "../services/studentService.js";


const sendResponse = (res, statusCode, data) => res.status(statusCode).json(data);
const sendError = (res, statusCode, message) => res.status(statusCode).json({ message });


export const createOffCampusJobPosting = async (req, res) => {

    try {
        const userId = req.user._id;

        const companyPostedId = await getCompanyService(userId);

        if (!companyPostedId) {
            return res.status(404).json({ error: "Company profile not found" });
        }

        const postingData = {
            ...req.body,
            companyPosted: companyPostedId.data[0]._id,
            jobType: "Off-campus",
            expireAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
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

        const companyPostedId = await getCompanyService(userId);
        if (!companyPostedId) {
            return res.status(404).json({ error: "Company profile not found" });
        }

        const postingData = {
            ...req.body,
            companyPosted: companyPostedId.data[0]._id,
            jobType: "On-campus",
            visibleTo: "College", // Default visibility, can be changed based on requirements
            // conditional - if paid user then don't put expiresAt
            expireAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
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

// college Request 
export const createOnCampusCollegeRequest = async (req, res) => {

    try {
        const userId = req.user._id;
        // console.log("User ID milega bhai :", userId);
        const collegeProfile = await getCollegeService(userId);
        if (!collegeProfile) {
            return res.status(404).json({ error: "College profile not found" });
        }
        const postingData = {
            ...req.body,
            collegePosted: collegeProfile.data[0]._id,
            jobType: "On-campus",
            visibleTo: "Company", // Default visibility for college requests
            // conditional - if paid user then don't put expiresAt
            expireAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
        };
        const newPosting = await createPostingService(postingData);
        if (!newPosting) {
            return sendError(res, 500, "Failed to create job posting");
        }
        sendResponse(res, 201, { message: "On-campus college request created successfully!", data: newPosting });

    } catch (error) {
        console.error("Error in createOnCampusCollegeRequest:", error.message);
        sendError(res, 500, "Internal server error");
    }

}
// colege Request for Pool Campus
export const createPoolCampusCollegeRequest = async (req, res) => {
    try {
        const userId = req.user._id;
        const collegePostedId = await getCollegeService(userId);
        if (!collegePostedId) {
            return res.status(404).json({ error: "College profile not found" });
        }
        const postingData = {
            ...req.body,
            collegePosted: collegePostedId.data[0]._id,
            jobType: "Pool-campus",
            visibleTo: "Company", // Default visibility for college requests
            // conditional - if paid user then don't put expiresAt
            expireAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
        };
        const newPosting = await createPostingService(postingData);
        if (!newPosting) {
            return sendError(res, 500, "Failed to create job posting");
        }
        sendResponse(res, 201, { message: "Pool-campus college request created successfully!", data: newPosting });
    } catch (error) {
        console.error("Error in createPoolCampusCollegeRequest:", error.message);
        sendError(res, 500, "Internal server error");
    }
}

export const createPoolCampusPosting = async (req, res) => {
    try {
        const userId = req.user._id;

        const companyPostedId = await getCompanyService(userId);
        if (!companyPostedId) {
            return res.status(404).json({ error: "Company profile not found" });
        }
        const postingData = {
            ...req.body,
            companyPosted: companyPostedId.data[0]._id,
            jobType: "Pool-campus",
            visibleTo: "College",
            // conditional - if paid user then don't put expiresAt
            expireAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)

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
        // console.log("User ID:", userId);
        const companyPostedId = await getCompanyService(userId);
        if (!companyPostedId) {
            return res.status(404).json({ error: "Company profile not found" });
        }
        const postingData = {
            ...req.body,
            companyPosted: companyPostedId.data[0]._id,
            jobType: "Job-listing",
            // conditional - if paid user then don't put expiresAt
            expireAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
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

        const companyPostedId = await getCompanyService(userId);
        if (!companyPostedId) {
            return res.status(404).json({ error: "Company profile not found" });
        }
        const postingData = {
            ...req.body,
            companyPosted: companyPostedId.data[0]._id,
            jobType: "Internship",
            // conditional - if paid user then don't put expiresAt
            expireAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
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

export const createRefferralPosting = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await getStudentService(userId);
        if (!user) {
            return res.status(404).json({ error: "User profile not found" });
        }
        const postingData = {
            ...req.body,
            candidatePosted: user.data[0]._id,
            jobType: "Referral",
            // conditional - if paid user then don't put expiresAt
            expireAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
        };
        const newPosting = await createPostingService(postingData);
        if (!newPosting) {
            return sendError(res, 500, "Failed to create referral posting");
        }
        sendResponse(res, 201, { message: "Referral posting created successfully!", data: newPosting });

    }
    catch (error) {
        console.error("Error in createRefferralPosting:", error.message);
        sendError(res, 500, "Internal server error");
    }

}

