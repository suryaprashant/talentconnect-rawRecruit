// import HiringDrive from "../models/hiringChannelOffCampusRegisterModel.js";

import { JobPostingTable } from "../models/jobPostingsModel.js";
import { fetchWeights, scoreJob } from "../utils/relevancyEngine.js"; // adjust path as needed
import { fetchMetricsForJob } from "../controllers/studentDashboard/studentDashboardController.js";
// fetch jobs
export async function fetchOpportunityService(query) {
    try {
        const response = await JobPostingTable.find(query)
            .populate({
                path: 'companyPosted',
                select: 'companyDetails profileImageUrl' // FIXED: Added profileImageUrl
            })
            .lean();

        // Calculate status
        const now = Date.now();
        const newResponse = response.map(item => {
            const start = new Date(item.hiringStartDate).getTime();
            const end = new Date(item.hiringEndDate).getTime();

            return {
                ...item,
                status: now >= start && now <= end ? 'Open' : 'Closed'
            };
        });

        // Debug log
        console.log('🔍 Off Campus Service Response:', {
            count: newResponse.length,
            firstItem: newResponse[0] ? {
                hasCompanyPosted: !!newResponse[0].companyPosted,
                profileImageUrl: newResponse[0].companyPosted?.profileImageUrl,
                companyName: newResponse[0].companyPosted?.companyDetails?.companyName
            } : 'No items'
        });

        return { success: true, data: newResponse };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}





export async function fetchReferalOpportunityService(query, student = null) {
  try {
    const job = await JobPostingTable.findOne(query)
      .populate({
        path: 'candidatePosted',
select: 'userId name jobRoles experiences currentCompany college profileImage'
      })
      .lean();

    if (!job) throw new Error("Job not found");

    const now = Date.now();
    const start = new Date(job.hiringStartDate).getTime();
    const end   = new Date(job.hiringEndDate).getTime();
    const enriched = {
      ...job,
      status: now >= start && now <= end ? 'Open' : 'Closed',
    };

    let matchScore = 0;
    if (student) {
      const W = await fetchWeights();
      const scored = scoreJob(enriched, student, W, 0, "Referral Job Detail");
      matchScore = scored.matchScore;
    }
    const metrics = await fetchMetricsForJob(job._id);
    return { success: true, data: { ...enriched, matchScore, metrics } };
  } catch (error) {
    console.error("Error:", error.message);
    throw new Error("Failed to fetch");
  }
}

export async function checkOpportunityService(jobId) {

    try {
        const response = await JobPostingTable.exists({ _id: jobId });
        if (response) return true;
        return false;
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}

export async function checkJobListingOpportunityService(jobId) {

    try {
        const response = await JobPostingTable.exists({ _id: jobId });
        if (response) return true;
        return false;
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}

export async function fetchInternshipByIdService(Id) {
    try {
        const response = await JobPostingTable.findById(Id)
            .populate({
                path: 'companyPosted',
                select: 'companyDetails'
            })
            .lean();
        return { success: true, data: response };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}

export async function fetchInternshipService(yearsOfExperience) {
    try {
        const response = await JobPostingTable.find({
            openingFor: 'Offcampus',
            yearsOfExperience: yearsOfExperience,
            jobType: 'Internship' // keep this if you store internships separately
        })
        .populate({
            path: 'companyPosted',
            select: 'companyDetails'
        })
        .sort({ createdAt: -1 })
        .lean();

        return {
            success: true,
            data: response
        };
    } catch (error) {
        console.log("Error fetching internships:", error.message);
        throw new Error("Failed to fetch internships");
    }
}
