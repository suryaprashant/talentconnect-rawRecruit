import { getJobPostingsByCollegeService, getJobPostingsByJobTypeService, getJobPostingsByJobTypeWithLocationBasedService, getReferralJobsService } from "../../services/jobPostingService.js";
import CompanyProfile from "../../models/companyDashboard/companyProfileModel.js";
import { JobPostingTable } from "../../models/jobPostingsModel.js";
import OnboardingModel from "../../models/studentonboardingModel.js";
import { getStudentService } from "../../services/studentService.js";
import { getCompanyService } from "../../services/companyService.js";
import Application from "../../models/applicationModel.js";
import { getCollegeService } from "../../services/collegeService.js";
import Auth from "../../models/authModel.js";
import mongoose from 'mongoose';



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

// export const getOnCampusPostingsForCompany = async (req, res) => {
//     const userId=req.user._id;
//     try {
//         //companyId -> company.data[0]._id
//         const company=await getCompanyService(userId);

//         // Get all on-campus postings using the existing service
//         const postings = await getJobPostingsByCollegeService("On-campus");

//         // Filter the results to include only those visible to "Company"
//         const filteredPostings = postings.filter(
//             (posting) => posting.visibleTo === "Company"
//         );

//         // If company profile exists, filter out postings the company already applied for
//         if (company.data && company.data[0]._id) {
//             try {
//                 const companyProfileId = company.data[0]._id;
//                 const jobIds = filteredPostings.map(p => p._id);
//                 const applications = await Application.find({ applicant: companyProfileId, job: { $in: jobIds } }).select('job').lean();
//                 const appliedJobIds = new Set(applications.map(a => String(a.job)));
//                 const finalPostings = filteredPostings.filter(p => !appliedJobIds.has(String(p._id)));
//                 return sendResponse(res, 200, { data: finalPostings });
//             } catch (err) {
//                 console.error('Error filtering on-campus postings for company:', err.message);
//                 // fallback to unfiltered list
//                 return sendResponse(res, 200, { data: filteredPostings });
//             }
//         }

//         sendResponse(res, 200, { data: filteredPostings });
//     } catch (error) {
//         console.error("Error in getOnCampusPostingsForCompany:", error.message);
//         sendError(res, 500, "Internal server error");
//     }
// };

export const getOnCampusPostingsForCompany = async (req, res) => {
    // 1. Safely handle guest users
    const userId = req.user ? req.user._id : null; 
    
    try {
        let company = { data: [] };
        
        // 2. Only look up company profile if user is logged in
        if (userId) {
            company = await getCompanyService(userId);
        }

        // Get all on-campus postings
        const postings = await getJobPostingsByCollegeService("On-campus", userId);

        // Filter results visible to "Company"
        const filteredPostings = postings.filter(
            (posting) => posting.visibleTo === "Company"
        );

        // 3. Handle guest response immediately if no profile is found
        if (!company.data || !company.data[0]?._id) {
            return sendResponse(res, 200, { 
                data: filteredPostings,
                message: "Guest view: Showing all available postings."
            });
        }

        // 4. Apply application filtering for logged-in companies
        try {
            const companyProfileId = company.data[0]._id;
            const jobIds = filteredPostings.map(p => p._id);
            const applications = await Application.find({ 
                applicant: companyProfileId, 
                job: { $in: jobIds } 
            }).select('job').lean();
            
            const appliedJobIds = new Set(applications.map(a => String(a.job)));
            const finalPostings = filteredPostings.filter(p => !appliedJobIds.has(String(p._id)));
            
            return sendResponse(res, 200, { data: finalPostings });
        } catch (err) {
            console.error('Error filtering postings:', err.message);
            return sendResponse(res, 200, { data: filteredPostings });
        }
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
        console.log("=== getOnCampusPostingsForCollege called ===");
        console.log("User ID:", userId);
        console.log("User object:", req.user);

        // Get college profile
        let collegeProfileId = null;
        if (userId) {
            try {
                const college = await getCollegeService(userId);
                console.log("College service response:", college);
                
                if (college && college.success && college.data && college.data.length > 0) {
                    collegeProfileId = college.data[0]._id;
                    console.log("College Profile ID found:", collegeProfileId);
                } else {
                    console.log("No college profile found for user");
                }
            } catch (collegeError) {
                console.error("Error fetching college profile:", collegeError.message);
            }
        }

        // Get all on-campus postings
        let postings;
        try {
            postings = await getJobPostingsByJobTypeService("On-campus", userId);
            console.log(`Found ${postings.length} on-campus postings`);
        } catch (postingsError) {
            console.error("Error fetching postings:", postingsError.message);
            return sendError(res, 500, "Failed to fetch job postings");
        }

        // Filter by visibility to "College"
        const filteredPostings = postings.filter(
            (posting) => posting.visibleTo === "College"
        );
        console.log(`After visibility filter: ${filteredPostings.length} postings`);

        // If no college profile, return all filtered postings
        if (!collegeProfileId) {
            console.log("Returning postings without application filter (no college profile)");
            return sendResponse(res, 200, { 
                data: filteredPostings,
                message: "No college profile found. Showing all available postings."
            });
        }

        // Filter out already applied postings
        try {
            const jobIds = filteredPostings.map(p => p._id);
            console.log(`Checking applications for ${jobIds.length} jobs`);
            
            const applications = await Application.find({ 
                applicant: collegeProfileId, 
                job: { $in: jobIds } 
            }).select('job').lean();
            
            console.log(`Found ${applications.length} existing applications`);
            
            const appliedJobIds = new Set(applications.map(a => String(a.job)));
            const finalPostings = filteredPostings.filter(p => !appliedJobIds.has(String(p._id)));
            
            console.log(`Final postings after filter: ${finalPostings.length}`);
            return sendResponse(res, 200, { 
                data: finalPostings,
                filteredFrom: filteredPostings.length,
                appliedJobs: applications.length
            });
        } catch (filterError) {
            console.error('Error filtering applications:', filterError.message);
            // Return unfiltered postings as fallback
            return sendResponse(res, 200, { 
                data: filteredPostings,
                message: "Unable to filter applications. Showing all available postings.",
                error: filterError.message
            });
        }
    } catch (error) {
        console.error("Unexpected error in getOnCampusPostingsForCollege:", error.message);
        console.error("Stack trace:", error.stack);
        sendError(res, 500, "Internal server error: " + error.message);
    }
};

// export const getOnCampusPostingForCollegebyID = async (req, res) => {
//     const { id } = req.params;
//     try {
//         const response = await JobPostingTable.findById(id)
//             .populate({
//                 path: 'companyPosted',
//                 select: 'companyDetails profileImage hiringPreferences',
//             })
//             .lean();

//         res.status(200).json(response);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// }
export const getOnCampusPostingForCollegebyID = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await JobPostingTable.findById(id)
            .populate({
                path: 'companyPosted',
                select: 'companyDetails profileImageUrl hiringPreferences', // Changed from profileImage to profileImageUrl
            })
            .lean();

        // Debug log
        console.log('🔍 Backend Response:', {
            jobId: id,
            hasCompanyPosted: !!response?.companyPosted,
            profileImageUrl: response?.companyPosted?.profileImageUrl,
            companyName: response?.companyPosted?.companyDetails?.companyName
        });

        res.status(200).json(response);
    } catch (err) {
        console.error('❌ Error in getOnCampusPostingForCollegebyID:', err);
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

// export const getPoolCampusForCollege = async (req, res) => {
//     const userId = req.user._id;
    
//     try {
//         console.log("=== getPoolCampusForCollege called ===");
        
//         // Get college profile
//         let collegeProfile = null;
//         if (userId) {
//             try {
//                 const college = await getCollegeService(userId);
//                 if (college?.success && college?.data?.length > 0) {
//                     collegeProfile = college.data[0];
//                     console.log("College Profile ID:", collegeProfile._id);
//                 }
//             } catch (collegeError) {
//                 console.error("Error fetching college:", collegeError.message);
//             }
//         }

//         // Get pool-campus postings with proper population
//         const postings = await getJobPostingsByJobTypeService("Pool-campus", userId);
//         console.log(`Found ${postings.length} pool-campus postings`);

//         // Filter by visibility to "College"
//         const filteredPostings = postings.filter(
//             (posting) => posting.visibleTo === "College"
//         );
//         console.log(`After visibility filter: ${filteredPostings.length} postings`);

//         // If college profile exists, filter out already applied postings
//         if (collegeProfile && collegeProfile._id) {
//             try {
//                 // FIX: Use filteredPostings, not postings
//                 const jobIds = filteredPostings.map(p => p._id);
//                 console.log(`Checking applications for ${jobIds.length} jobs`);
                
//                 const applications = await Application.find({ 
//                     applicant: collegeProfile._id, 
//                     job: { $in: jobIds } 
//                 }).select('job').lean();
                
//                 console.log(`Found ${applications.length} existing applications`);
                
//                 const appliedJobIds = new Set(applications.map(a => String(a.job)));
//                 const finalPostings = filteredPostings.filter(p => !appliedJobIds.has(String(p._id)));
                
//                 console.log(`Final postings after filter: ${finalPostings.length}`);
//                 return sendResponse(res, 200, { 
//                     data: finalPostings,
//                     message: "Successfully fetched pool campus postings"
//                 });
//             } catch (err) {
//                 console.error('Error filtering applications:', err.message);
//                 // Fallback to unfiltered visible postings
//                 return sendResponse(res, 200, { 
//                     data: filteredPostings,
//                     message: "Unable to filter applications"
//                 });
//             }
//         }

//         // No college profile, return all visible postings
//         sendResponse(res, 200, { 
//             data: filteredPostings,
//             message: "No college profile found. Showing all available postings."
//         });
        
//     } catch (error) {
//         console.error("Error in getPoolCampusForCollege:", error.message);
//         sendError(res, 500, "Internal server error");
//     }
// };

import jwt from 'jsonwebtoken'; // Make sure to import this at the top

export const getPoolCampusForCollege = async (req, res) => {
    // 1. Manually extract the token from headers
    {/*const authHeader = req.headers.authorization;
    let userId = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded._id || decoded.id; // Get the user ID if token is valid
        } catch (err) {
            console.log("Request by Guest/Invalid Token - proceeding as non-login");
            // We don't throw an error, we just keep userId as null
        }
    }*/}

    try {
        console.log("=== getPoolCampusForCollege called ===");
        console.log("req.user:", req.user);

        // ✅ ADD THIS (single source of truth)
        const userId = req.user?._id;
        
        // 2. Fetch the postings (visible to everyone)
        const postings = await getJobPostingsByJobTypeService("Pool-campus", userId);
        const filteredPostings = postings.filter(p => p.visibleTo === "College");

        // 3. Logic for LOGGED IN users only
        if (userId) {
            // Your existing logic for filtering applications
            // Use 'userId' instead of 'req.user._id'
            let collegeProfile = null;
            const college = await getCollegeService(userId);
            
            if (college?.success && college?.data?.length > 0) {
                collegeProfile = college.data[0];
                
                const jobIds = filteredPostings.map(p => p._id);
                const applications = await Application.find({ 
                    applicant: collegeProfile._id, 
                    job: { $in: jobIds } 
                }).select('job').lean();
                
                const appliedJobIds = new Set(applications.map(a => String(a.job)));
                const finalPostings = filteredPostings.filter(p => !appliedJobIds.has(String(p._id)));
                
                return sendResponse(res, 200, { data: finalPostings });
            }
        }

        // 4. Fallback for non-logged in users (Guests)
        // If no userId or no collegeProfile, just send all visible postings
        return sendResponse(res, 200, { 
            data: filteredPostings,
            message: "Successfully fetched postings (Guest View)"
        });

    } catch (error) {
        console.error("Error in getPoolCampusForCollege:", error.message);
        sendError(res, 500, "Internal server error");
    }
};

export const getPoolCampusJobByIdForCollege = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await JobPostingTable.findById(id)
            .populate({
                path: 'companyPosted',
                select: 'companyDetails profileImageUrl hiringPreferences', // Changed from profileImage to profileImageUrl
            })
            .lean();
        
        // Add debug logging
        console.log('🔍 Pool Campus Backend Response:', {
            jobId: id,
            hasCompanyPosted: !!response?.companyPosted,
            profileImageUrl: response?.companyPosted?.profileImageUrl,
            companyName: response?.companyPosted?.companyDetails?.companyName
        });
        
        res.status(200).json(response);
    }
    catch (err) {
        console.error('❌ Error in getPoolCampusJobByIdForCollege:', err);
        res.status(500).json({ error: err.message });
    }
}

{/*export const getPoolCampusForCompany = async (req, res) => {
 // Safely handle guest users
const userId = req.user ? req.user._id : null;
    console.log('j')
    try {
        // Disable caching
        res.set({
            'Cache-Control': 'no-store, no-cache, must-revalidate, private',
            'Pragma': 'no-cache',
            'Expires': '0'
        });
        
        console.log('=== GET POOL CAMPUS FOR COMPANY - CONSISTENT DATA ===');
        
        // Get all pool campus jobs
        const response = await JobPostingTable.find({
            jobType: "Pool-campus",
            visibleTo: "Company"
        })
        .populate({
            path: 'collegePosted',
            select: 'name profileImage collegeUniversityDetails',
            populate: {
                path: 'collegeUniversityDetails',
                select: 'collegeName city state institutionName'
            }
        })
        .lean()
        .sort({ createdAt: -1 });

        console.log('Total jobs found:', response.length);
        
        // Analyze data consistency
        let withCollegePosted = 0;
        let withoutCollegePosted = 0;
        
        response.forEach(item => {
            if (item.collegePosted) withCollegePosted++;
            else withoutCollegePosted++;
        });
        
        console.log(`With collegePosted: ${withCollegePosted}`);
        console.log(`Without collegePosted: ${withoutCollegePosted}`);
        
        // Transform data to ensure consistent college names
        const normalizedData = response.map((item) => {
            let collegeName = 'College';
            let logo = '';
            
            // CASE 1: Has collegePosted (populated)
            if (item.collegePosted && item.collegePosted._id) {
                console.log(`Item ${item._id}: Has collegePosted`);
                
                // Try to get name from collegeUniversityDetails
                if (item.collegePosted.collegeUniversityDetails) {
                    const details = item.collegePosted.collegeUniversityDetails;
                    collegeName = details.collegeName || 
                                 details.institutionName || 
                                 details.name || 
                                 item.collegePosted.name || 
                                 'College';
                } else {
                    collegeName = item.collegePosted.name || 'College';
                }
                logo = item.collegePosted.profileImage || '';
            }
            // CASE 2: No collegePosted, check root fields
            else {
                console.log(`Item ${item._id}: No collegePosted, checking root fields`);
                
                // Check all possible field names
                const possibleNames = [
                    item.collegeName,
                    item.name,
                    item.institutionName,
                    item.universityName
                ];
                
                for (const name of possibleNames) {
                    if (name && name !== 'College') {
                        collegeName = name;
                        break;
                    }
                }
                
                logo = item.profileImage || item.logo || '';
            }
            
            // Also check for contact person name as fallback
            if (collegeName === 'College' && item.contactPerson?.name) {
                collegeName = `${item.contactPerson.name}'s College`;
            }
            
            return {
                ...item,
                // Standardized fields (always present)
                displayCollegeName: collegeName,
                displayLogo: logo,
                // For debugging
                _debug: {
                    hasCollegePosted: !!item.collegePosted,
                    originalCollegeName: item.collegeName,
                    originalName: item.name
                }
            };
        });

        console.log('\n=== FINAL DATA CONSISTENCY CHECK ===');
        normalizedData.forEach((item, index) => {
            if (index < 5) { // Log first 5 items
                console.log(`Item ${index + 1}:`, {
                    id: item._id,
                    displayCollegeName: item.displayCollegeName,
                    hasCollegePosted: item._debug.hasCollegePosted,
                    originalCollegeName: item._debug.originalCollegeName
                });
            }
        });

        res.status(200).json({ 
            success: true, 
            data: normalizedData,
            stats: {
                total: response.length,
                withCollegePosted,
                withoutCollegePosted
            }
        });
    }
    catch (err) {
        console.error('Error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
}*/}

export const getPoolCampusForCompany = async (req, res) => {
    // 1. Safely handle guest users
    const userId = req.user ? req.user._id : null; 
    
    try {
        let company = { data: [] };
        
        // 2. Only look up company profile if user is logged in
        if (userId) {
            company = await getCompanyService(userId);
        }

        // Get all on-campus postings
        const postings = await getJobPostingsByCollegeService("Pool-campus", userId);

        // Filter results visible to "Company"
        const filteredPostings = postings.filter(
            (posting) => posting.visibleTo === "Company"
        );

        // 3. Handle guest response immediately if no profile is found
        if (!company.data || !company.data[0]?._id) {
            return sendResponse(res, 200, { 
                data: filteredPostings,
                message: "Guest view: Showing all available postings."
            });
        }

        // 4. Apply application filtering for logged-in companies
        try {
            const companyProfileId = company.data[0]._id;
            const jobIds = filteredPostings.map(p => p._id);
            const applications = await Application.find({ 
                applicant: companyProfileId, 
                job: { $in: jobIds } 
            }).select('job').lean();
            
            const appliedJobIds = new Set(applications.map(a => String(a.job)));
            const finalPostings = filteredPostings.filter(p => !appliedJobIds.has(String(p._id)));
            
            return sendResponse(res, 200, { data: finalPostings });
        } catch (err) {
            console.error('Error filtering postings:', err.message);
            return sendResponse(res, 200, { data: filteredPostings });
        }
    } catch (error) {
        console.error("Error in getOnCampusPostingsForCompany:", error.message);
        sendError(res, 500, "Internal server error");
    }
};

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

//Backup controller for internship get
{/*export const getInternshipPostings = async (req, res) => {
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
};*/}

export const getInternshipPostings = async (req, res) => {
    try {
        const userId = req.user?._id;
        let studentLocations = [];
        let appliedJobIds = [];

        const studentProfile = await getStudentService(userId);

        if (
            studentProfile.success &&
            studentProfile.data.length > 0
        ) {
            const student = studentProfile.data[0];
            studentLocations = student.locations || [];

            if (userId) {
                appliedJobIds = await Application
                    .find({ applicant: student._id })
                    .distinct("job");
            }
        }

        const postings =
            await getJobPostingsByJobTypeWithLocationBasedService(
                "Internship",
                studentLocations,
                userId
            );

        const filteredPostings =
            userId && appliedJobIds.length > 0
                ? postings.filter(p =>
                      !appliedJobIds.some(id => id.equals(p._id))
                  )
                : postings;

        sendResponse(res, 200, { data: filteredPostings });
    } catch (error) {
        console.error("Internship error:", error);
        sendError(res, 500, "Internal server error");
    }
};

export const getIntershipById = async (req, res) => {
    const { id } = req.params;
    
    console.log('🔍 in internship section - fetching job ID:', id);
    
    try {
        // Check if ID is valid (if using MongoDB)
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            console.log('❌ Invalid ID format:', id);
            return res.status(400).json({ 
                error: 'Invalid internship ID format',
                id: id 
            });
        }
        
        const response = await JobPostingTable.findById(id)
            .populate({
                path: 'companyPosted',
                select: 'companyDetails profileImageUrl hiringPreferences',
            })
            .lean()
            .exec(); // Add .exec() for better promise handling
        
        // Check if response exists
        if (!response) {
            console.log('❌ No internship found for ID:', id);
            return res.status(404).json({ 
                error: 'Internship not found',
                id: id 
            });
        }
        
        // Add debug logging
        console.log('✅ Internship Backend Response:', {
            jobId: id,
            found: !!response,
            _id: response._id,
            jobTitle: response.jobTitle,
            hasCompanyPosted: !!response?.companyPosted,
            profileImageUrl: response?.companyPosted?.profileImageUrl,
            companyName: response?.companyPosted?.companyDetails?.companyName,
            companyPostedFields: response?.companyPosted ? Object.keys(response.companyPosted) : [],
            allResponseFields: Object.keys(response)
        });
        
        // Log the entire response for debugging (first few keys)
        console.log('📦 Full response structure:', {
            ...response,
            // Don't log huge fields
            description: response.description ? `${response.description.substring(0, 100)}...` : 'No description'
        });
        
        res.status(200).json(response);
    }
    catch (err) {
        console.error('❌ Error in getIntershipById:', err);
        console.error('Error stack:', err.stack);
        
        // More detailed error response
        res.status(500).json({ 
            success: false,
            error: 'Internal server error',
            message: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
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