import { getJobPostingsByCollegeService, getJobPostingsByJobTypeService, getJobPostingsByJobTypeWithLocationBasedService, getReferralJobsService } from "../../services/jobPostingService.js";
import CompanyProfile from "../../models/companyDashboard/companyProfileModel.js";
import { JobPostingTable } from "../../models/jobPostingsModel.js";
import OnboardingModel from "../../models/studentonboardingModel.js";
import { getStudentService } from "../../services/studentService.js";
import { getCompanyService } from "../../services/companyService.js";
import Application from "../../models/applicationModel.js";
import { getCollegeService } from "../../services/collegeService.js";
import Auth from "../../models/authModel.js";



const sendResponse = (res, statusCode, data) => res.status(statusCode).json(data);
const sendError = (res, statusCode, message) => res.status(statusCode).json({ message });



export const getOffCampusPostings = async (req, res) => {
    const userId = req.user._id;
    try {
        // Step 1: Specifically fetch onboarding for the candidate logic
        const studentProfile = await OnboardingModel.findOne({ userId }).lean();

        // Step 2: Pass the profile as a 3rd argument. 
        // Other controllers that don't pass this won't trigger the filter.
        const postings = await getJobPostingsByJobTypeService("Off-campus", userId, studentProfile);
        
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

export const getOnCampusPostingsForCompany = async (req, res) => {
    const userId=req.user._id;
    try {
        //companyId -> company.data[0]._id
        const company=await getCompanyService(userId);

        // Get all on-campus postings using the existing service
        const postings = await getJobPostingsByCollegeService("On-campus");

        // Filter the results to include only those visible to "Company"
        const filteredPostings = postings.filter(
            (posting) => posting.visibleTo === "Company"
        );

        // If company profile exists, filter out postings the company already applied for
        if (company.data && company.data[0]._id) {
            try {
                const companyProfileId = company.data[0]._id;
                const jobIds = filteredPostings.map(p => p._id);
                const applications = await Application.find({ applicant: companyProfileId, job: { $in: jobIds } }).select('job').lean();
                const appliedJobIds = new Set(applications.map(a => String(a.job)));
                const finalPostings = filteredPostings.filter(p => !appliedJobIds.has(String(p._id)));
                return sendResponse(res, 200, { data: finalPostings });
            } catch (err) {
                console.error('Error filtering on-campus postings for company:', err.message);
                // fallback to unfiltered list
                return sendResponse(res, 200, { data: filteredPostings });
            }
        }

        sendResponse(res, 200, { data: filteredPostings });
    } catch (error) {
        console.error("Error in getOnCampusPostingsForCompany:", error.message);
        sendError(res, 500, "Internal server error");
    }
};
export const getOnCampusPostingForCompanybyID = async (req, res) => {
    const { id } = req.params;
    console.log("Fetching On-campus posting for Company by ID:", id);
    try {
        console.log("Fetching posting with ID:", id);
        const response = await JobPostingTable.findById(id)
            .populate({ path: 'collegePosted', select: 'collegeUniversityDetails profileImage profileAchievements' }).lean();
        res.status(200).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

export const getOnCampusPostingsForCollege = async (req, res) => {
    const userId = req.user && req.user._id;
    try {
        // collegeId -> college.data[0]._id
        const college = userId ? await getCollegeService(userId) : null;

        const postings = await getJobPostingsByJobTypeService("On-campus");
       console.log('manav')
        const filteredPostings = postings.filter(
            (posting) => posting.visibleTo === "College"
        );

        // If college profile exists, filter out postings the college already applied for
        if (college && college.data && college.data[0] && college.data[0]._id) {
            try {
                const collegeProfileId = college.data[0]._id;
                const jobIds = postings.map(p => p._id);
                const applications = await Application.find({ applicant: collegeProfileId, job: { $in: jobIds } }).select('job').lean();
                const appliedJobIds = new Set(applications.map(a => String(a.job)));
                const finalPostings = filteredPostings.filter(p => !appliedJobIds.has(String(p._id)));
                return sendResponse(res, 200, { data: finalPostings });
            } catch (err) {
                console.error('Error filtering on-campus postings for college:', err.message);
                // fallback to unfiltered list
                return sendResponse(res, 200, { data: filteredPostings });
            }
        }

        sendResponse(res, 200, { data: filteredPostings });
    } catch (error) {
        console.error("Error in getOnCampusPostingsForCollege:", error.message);
        sendError(res, 500, "Internal server error");
    }
};

export const getOnCampusPostingForCollegebyID = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await JobPostingTable.findById(id)
            .populate({
                path: 'companyPosted',
                select: 'companyDetails profileImage hiringPreferences',
            })
            .lean();

        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// export const getPoolCampusPostingsForCollege = async (req, res) => {
//     try {       
//         const postings = await getJobPostingsByJobTypeService("Pool-campus");

//         const filteredPostings = postings.filter(
//             (posting) => posting.visibleTo === "College"
//         );

//         sendResponse(res, 200, { data: filteredPostings });
//     } catch (error) {
//         console.error("Error in getPoolCampusPostingsForCollege:", error.message);  
//         sendError(res, 500, "Internal server error");
//     }
// }



// export const getPoolCampusPostings = async (req, res) => {
//     try {
//         const postings = await getJobPostingsByJobTypeService("Pool-campus");
//         sendResponse(res, 200, { data: postings });
//     } catch (error) {
//         sendError(res, 500, "Internal server error");
//     }
// };

export const getPoolCampusForCollege = async (req, res) => {
    const userId=req.user._id;
    try {
        //collegeId -> college.data[0]._id
        const college = userId ? await getCollegeService(userId) : null;

        const postings = await getJobPostingsByJobTypeService("Pool-campus");

        const filteredPostings = postings.filter(
            (posting) => posting.visibleTo === "College"
        );

        // If college profile exists, filter out postings the college already applied for
        if (college && college.data && college.data[0] && college.data[0]._id) {
            try {
                const collegeProfileId = college.data[0]._id;
                const jobIds = postings.map(p => p._id);
                const applications = await Application.find({ applicant: collegeProfileId, job: { $in: jobIds } }).select('job').lean();
                const appliedJobIds = new Set(applications.map(a => String(a.job)));
                const finalPostings = filteredPostings.filter(p => !appliedJobIds.has(String(p._id)));
                return sendResponse(res, 200, { data: finalPostings });
            } catch (err) {
                console.error('Error filtering on-campus postings for college:', err.message);
                // fallback to unfiltered list
                return sendResponse(res, 200, { data: filteredPostings });
            }
        }

        sendResponse(res, 200, { data: filteredPostings });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

export const getPoolCampusJobByIdForCollege = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await JobPostingTable.findById(id)
            .populate({
                path: 'companyPosted',
                select: 'companyDetails profileImage hiringPreferences',
            })
            .lean();
        res.status(200).json(response);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}

export const getPoolCampusForCompany = async (req, res) => {
    const userId=req.user._id;
    try {
        //companyId -> company.data[0]._id
        const company=await getCompanyService(userId);

        const response = await JobPostingTable.find({
            jobType: "Pool-campus",
            visibleTo: "Company"
        })
            .populate({ path: 'collegePosted', select: 'collegeUniversityDetails profileImage profileAchievements' })
            .lean()
            .sort({ createdAt: -1 });
        // If company profile exists, filter out postings the company already applied for
        if (company && company.data && company.data[0] && company.data[0]._id) {
            try {
                const companyProfileId = company.data[0]._id;
                const jobIds = response.map(r => r._id);
                const applications = await Application.find({ applicant: companyProfileId, job: { $in: jobIds } }).select('job').lean();
                const appliedJobIds = new Set(applications.map(a => String(a.job)));
                const filtered = response.filter(r => !appliedJobIds.has(String(r._id)));
                return res.status(200).json({ success: true, data: filtered });
            } catch (err) {
                console.error('Error filtering pool-campus postings for company:', err.message);
                // fallback to unfiltered list
            }
        }

        res.status(200).json({ success: true, data: response });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });

    }
}

export const getPoolCampusJobByIdForCompany = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await JobPostingTable.findById(id)
            .populate({ 
                path: 'collegePosted', 
                select: 'collegeUniversityDetails profileImage profileAchievements placementCoordinatorDetails userId'
            })
            .lean();
            if (response && response.collegePosted && response.collegePosted.userId) {
            const authUser = await Auth.findById(response.collegePosted.userId)
                .select('name email profileImage userType')
                .lean();
            
            if (authUser) {
                response.collegePosted.authUser = authUser;
            }
        }
        res.status(200).json(response);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// export const getJobPostings = async (req, res) => {
//     try {
//         const postings = await getJobPostingsByJobTypeService("Job-listing");
//         sendResponse(res, 200, { data: postings });
//     } catch (error) {
//         sendError(res, 500, "Internal server error");
//     }
// };

export const getJobPostings = async (req, res) => {
    try {
        const userId = req.user._id;
        let studentLocations = [];

        const studentProfile = await getStudentService(userId);

        if (studentProfile.success && studentProfile.data.length > 0 && studentProfile.data[0].locations) {
            studentLocations = studentProfile.data[0].locations;
        }
        console.log("userId:\n", userId);
        const postings = await getJobPostingsByJobTypeWithLocationBasedService("Job-listing", studentLocations, userId);

        sendResponse(res, 200, { data: postings });
    } catch (error) {
        sendError(res, 500, "Internal server error");
    }
};

// export const getInternshipPostings = async (req, res) => {
//     try {
//         const postings = await getJobPostingsByJobTypeService("Internship");
//         sendResponse(res, 200, { data: postings });
//     } catch (error) {
//         sendError(res, 500, "Internal server error");
//     }
// };
export const getInternshipPostings = async (req, res) => {
    try {
        const userId = req.user._id;
        let studentLocations = [];

        const studentProfile = await getStudentService(userId);
        if (studentProfile.success && studentProfile.data.length > 0 && studentProfile.data[0].locations) {
            studentLocations = studentProfile.data[0].locations;
        }


        const postings = await getJobPostingsByJobTypeWithLocationBasedService("Internship", studentLocations, userId);
        sendResponse(res, 200, { data: postings });
    } catch (error) {
        sendError(res, 500, "Internal server error");
    }
};

export const getIntershipById = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await JobPostingTable.findById(id)
            .populate('companyPosted')
            .lean();
        res.status(200).json(response);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}

export const getReferralJobs = async (req, res) => {
    try {
        const userId = req.user._id;
        const postId = await getStudentService(userId);

        const candidatePostedId = postId.data[0]._id;

        const response = await getReferralJobsService("Referral", candidatePostedId);
        res.status(200).json({ success: true, data: response });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });

    }
}

export const getReferralJobById = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await JobPostingTable.findById(id)
            .populate('candidatePosted')
            .lean();
        res.status(200).json(response);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}