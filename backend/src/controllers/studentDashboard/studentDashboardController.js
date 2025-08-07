import { getJobPostingsByJobTypeService } from "../../services/jobPostingService.js";
import CompanyProfile from "../../models/companyDashboard/companyProfileModel.js";


const sendResponse = (res, statusCode, data) => res.status(statusCode).json(data);
const sendError = (res, statusCode, message) => res.status(statusCode).json({ message });


export const getOffCampusPostings = async (req, res) => {
    try {
        const postings = await getJobPostingsByJobTypeService("Off-campus");
        sendResponse(res, 200, { data: postings });
    } catch (error) {
        sendError(res, 500, "Internal server error");
    }
};

export const getOnCampusPostings = async (req, res) => {
    try {
        const postings = await getJobPostingsByJobTypeService("On-campus");
        sendResponse(res, 200, { data: postings });
    } catch (error) {
        sendError(res, 500, "Internal server error");
    }
};

export const getPoolCampusPostings = async (req, res) => {
    try {
        const postings = await getJobPostingsByJobTypeService("Pool-campus");
        sendResponse(res, 200, { data: postings });
    } catch (error) {
        sendError(res, 500, "Internal server error");
    }
};

export const getJobPostings = async (req, res) => {
    try {
        const postings = await getJobPostingsByJobTypeService("Job-posting");
        sendResponse(res, 200, { data: postings });
    } catch (error) {
        sendError(res, 500, "Internal server error");
    }
};

export const getInternshipPostings = async (req, res) => {
    try {
        const postings = await getJobPostingsByJobTypeService("Internship");
        sendResponse(res, 200, { data: postings });
    } catch (error) {
        sendError(res, 500, "Internal server error");
    }
};