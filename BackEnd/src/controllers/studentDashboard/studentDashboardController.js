import { getJobPostingsByCollegeService, getJobPostingsByJobTypeService, getJobPostingsByJobTypeWithLocationBasedService, getReferralJobsService } from "../../services/jobPostingService.js";
import CompanyProfile from "../../models/companyDashboard/companyProfileModel.js";
import { JobPostingTable  } from "../../models/jobPostingsModel.js";
import OnboardingModel from "../../models/studentonboardingModel.js";
import { getStudentService } from "../../services/studentService.js";
import { getCompanyService, getEmployerService } from "../../services/companyService.js";
import Application from "../../models/applicationModel.js";
import { getCollegeService } from "../../services/collegeService.js";
import Auth from "../../models/authModel.js";
import {getProfessionalReferralsService} from "../../services/jobPostingService.js"
import mongoose from "mongoose";

const sendResponse = (res, statusCode, data) => res.status(statusCode).json(data);
const sendError = (res, statusCode, message) => res.status(statusCode).json({ message });

export const getProfessionalReferrals = async (req, res) => {
console.log(">>> API Request Received <<<");
    try {
        const authUserId = req.user._id;
        console.log("1. Auth User ID:", authUserId);

        // Step 1: Directly find the student profile in the DB
        const studentProfile = await OnboardingModel.findOne({ 
            userId: new mongoose.Types.ObjectId(authUserId) 
        }).lean();

        if (!studentProfile) {
            console.log("2. ❌ No student profile found for this Auth ID");
            return res.status(404).json({ message: "Student profile not found" });
        }

        const profileId = studentProfile._id;
        console.log("2. ✅ Found Student Profile ID:", profileId);

        // Step 2: Directly find the jobs matching that profile ID
        const referrals = await JobPostingTable.find({
            candidatePosted: profileId,
            jobType: "Referral"
        }).sort({ createdAt: -1 }).lean();

        console.log(`3. 📊 Referrals Found: ${referrals.length}`);

        return res.status(200).json({
            success: true,
            count: referrals.length,
            data: referrals
        });

    } catch (error) {
        console.error("4. ❌ Error:", error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
};

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

{/*export const getOnCampusPostingsForCompany = async (req, res) => {
    // 1. Safely handle guest users
    const userId = req.user ? req.user._id : null; 
    console.log("=== GET ON-CAMPUS POSTINGS FOR COMPANY ===");
    
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
        // 4. Apply application filtering for logged-in companies
        try {
          const companyProfileId = company.data[0]._id;
          const jobIds = filteredPostings.map(p => p._id);
        
          const applications = await Application.find({
            job: { $in: jobIds },
            $or: [
              // Company applied directly
              { applicant: companyProfileId },
            
              // Employer applied on behalf of company
              { appliedForCompany: companyProfileId }
            ]
          }).select('job').lean();
      
          const appliedJobIds = new Set(applications.map(a => String(a.job)));
      
          const finalPostings = filteredPostings.filter(
            p => !appliedJobIds.has(String(p._id))
          );
      
          return sendResponse(res, 200, { data: finalPostings });
        } catch (err) {
          console.error('Error filtering postings:', err.message);
          return sendResponse(res, 200, { data: filteredPostings });
        }

    } catch (error) {
        console.error("Error in getOnCampusPostingsForCompany:", error.message);
        sendError(res, 500, "Internal server error");
    }
};*/}

//comapny-> employer parenmt child working 
export const getOnCampusPostingsForCompany = async (req, res) => {
      const userId = req.user ? req.user._id : null;
      


      try {
        let companyProfileId = null;

        // Employer acting on behalf of company
        if (req.user?.userType === "employer" && req.user.activeCompanyId) {
          companyProfileId = req.user.activeCompanyId;
        }
        // Company user
        else if (req.user?.userType === "company") {
          const company = await getCompanyService(userId);
          companyProfileId = company?.data?.[0]?._id || null;
        }

        let employerProfileId = null;

        if (req.user?.userType === "employer" && !req.user.activeCompanyId) {
          const employer = await getEmployerService(userId);
          employerProfileId = employer?.data?.[0]?._id || null;
        }

        // Get all on-campus postings
        const postings = await getJobPostingsByCollegeService(
          "On-campus",
          userId
        );

        // Visible to company
        const filteredPostings = postings.filter(
          (posting) => posting.visibleTo === "Company"
        );

        // Guest / no company context
        // Guest = neither company nor employer individual
        if (!companyProfileId && !employerProfileId) {
          return sendResponse(res, 200, {
            data: filteredPostings,
            message: "Guest view: Showing all available postings.",
          });
        }


        // 🔒 EXACT SAME RULE AS POOL-CAMPUS
        const jobIds = filteredPostings.map((p) => p._id);

        {/*const applications = await Application.find({
          appliedForCompany: companyProfileId,
          job: { $in: jobIds },
        })
          .select("job")
          .lean();*/}

        const applicationQuery = {
          job: { $in: jobIds },
        };

        // Company OR employer acting on behalf
        if (companyProfileId) {
          //applicationQuery.appliedForCompany = companyProfileId;
          applicationQuery.$or = [
        { appliedForCompany: companyProfileId },
        { applicant: companyProfileId } 
    ];
        }

        // Employer as individual
        else if (employerProfileId) {
          applicationQuery.applicant = employerProfileId;
        }



        const applications = await Application.find(applicationQuery)
          .select("job")
          .lean();

  
        const appliedJobIds = new Set(applications.map((a) => String(a.job)));

        const finalPostings = filteredPostings.filter(
          (p) => !appliedJobIds.has(String(p._id))
        );
        
      console.log('finalpostings',finalPostings)
        return sendResponse(res, 200, { data: finalPostings });
      } catch (error) {
        console.error("Error in getOnCampusPostingsForCompany:", error);
        return sendError(res, 500, "Internal server error");
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

// export const getOnCampusPostingsForCollege = async (req, res) => {
//     const userId = req.user && req.user._id;
    
//     try {
//         let collegeCity = null;
//         let collegeProfileId = null;
       
//         console.log("=== getOnCampusPostingsForCollege called ===");
//         console.log("User ID:", userId);
//         console.log("User object:", req.user);

//         // Get college profile
//         if (userId) {
//             try {
//                 const college = await getCollegeService(userId);
//                 console.log("College service response:", college);
                
//                 if (college && college.success && college.data && college.data.length > 0) {
//                     collegeProfileId = college.data[0]._id;
//                     collegeCity = profile.collegeUniversityDetails?.city
//                     console.log('CITY HERE ',collegeCity)
//                     console.log("College Profile ID found:", collegeProfileId);
//                 } else {
//                     console.log("No college profile found for user");
//                 }
//             } catch (collegeError) {
//                 console.error("Error fetching college profile:", collegeError.message);
//             }
//         }

//         // Get all on-campus postings
//         let postings;
//         try {
//             postings = await getJobPostingsByJobTypeService("On-campus", userId);
//             console.log(`Found ${postings.length} on-campus postings`);
//         } catch (postingsError) {
//             console.error("Error fetching postings:", postingsError.message);
//             return sendError(res, 500, "Failed to fetch job postings");
//         }

//         // Filter by visibility to "College"
//         const filteredPostings = postings.filter(
//             (posting) => posting.visibleTo === "College"
//         );
//         console.log(`After visibility filter: ${filteredPostings.length} postings`);

//         // If no college profile, return all filtered postings
//         if (!collegeProfileId) {
//             console.log("Returning postings without application filter (no college profile)");
//             return sendResponse(res, 200, { 
//                 data: filteredPostings,
//                 message: "No college profile found. Showing all available postings."
//             });
//         }

//         // Filter out already applied postings
//         try {
//             const jobIds = filteredPostings.map(p => p._id);
//             console.log(`Checking applications for ${jobIds.length} jobs`);
            
//             const applications = await Application.find({ 
//                 applicant: collegeProfileId, 
//                 job: { $in: jobIds } 
//             }).select('job').lean();
            
//             console.log(`Found ${applications.length} existing applications`);
            
//             const appliedJobIds = new Set(applications.map(a => String(a.job)));
//             const finalPostings = filteredPostings.filter(p => !appliedJobIds.has(String(p._id)));
            
//             console.log(`Final postings after filter: ${finalPostings.length}`);
//             return sendResponse(res, 200, { 
//                 data: finalPostings,
//                 filteredFrom: filteredPostings.length,
//                 appliedJobs: applications.length
//             });
//         } catch (filterError) {
//             console.error('Error filtering applications:', filterError.message);
//             // Return unfiltered postings as fallback
//             return sendResponse(res, 200, { 
//                 data: filteredPostings,
//                 message: "Unable to filter applications. Showing all available postings.",
//                 error: filterError.message
//             });
//         }
//     } catch (error) {
//         console.error("Unexpected error in getOnCampusPostingsForCollege:", error.message);
//         console.error("Stack trace:", error.stack);
//         sendError(res, 500, "Internal server error: " + error.message);
//     }
// };

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

export const getOnCampusPostingsForCollege = async (req, res) => {
    const userId = req.user && req.user._id;
    
    try {
        let collegeCity = null;
        let collegeProfileId = null;

        // 1. Fetch College Profile and Extract City
        if (userId) {
            const college = await getCollegeService(userId);
            
            if (college && college.success && college.data?.length > 0) {
                const collegeDoc = college.data[0]; // Define the variable here
                collegeProfileId = collegeDoc._id;
                
                // Extract city from the nested object
                collegeCity = collegeDoc.collegeUniversityDetails?.collegeLocation;
                console.log(collegeCity)
                
                console.log("Found College City:", collegeCity);
            }
        }

        // 2. Fetch Job Postings
        let postings = await getJobPostingsByJobTypeService("On-campus", userId);

        // 3. Filter by Visibility AND Location logic
        const filteredPostings = postings.filter((posting) => {
            // Must be visible to College
            if (posting.visibleTo !== "College") return false;

            // If Broadcast is Location, check for city match
            if (posting.broadcastType === "Location") {
                // If we don't know the college's city, they can't see location-restricted jobs
                if (!collegeCity) return false;

                const jobCities = posting.location || [];
                const isMatch = (posting.city === collegeCity) || jobCities.includes(collegeCity);
                
                if (!isMatch) return false;
            }

            // If broadcastType is 'Everyone', it passes through automatically
            return true;
        });

        // 4. Application Filter (Existing Logic)
        if (!collegeProfileId) {
            return sendResponse(res, 200, { data: filteredPostings });
        }

        const jobIds = filteredPostings.map(p => p._id);
        const applications = await Application.find({ 
            applicant: collegeProfileId, 
            job: { $in: jobIds } 
        }).select('job').lean();
        
        const appliedJobIds = new Set(applications.map(a => String(a.job)));
        const finalPostings = filteredPostings.filter(p => !appliedJobIds.has(String(p._id)));

        return sendResponse(res, 200, { 
            data: finalPostings,
            totalAvailable: finalPostings.length 
        });

    } catch (error) {
        console.error("Critical Error in getOnCampusPostingsForCollege:", error.message);
        sendError(res, 500, "Internal server error");
    }
};

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

// export const getPoolCampusForCollege = async (req, res) => {
//     // 1. Manually extract the token from headers
//     {/*const authHeader = req.headers.authorization;
//     let userId = null;

//     if (authHeader && authHeader.startsWith('Bearer ')) {
//         try {
//             const token = authHeader.split(' ')[1];
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);
//             userId = decoded._id || decoded.id; // Get the user ID if token is valid
//         } catch (err) {
//             console.log("Request by Guest/Invalid Token - proceeding as non-login");
//             // We don't throw an error, we just keep userId as null
//         }
//     }*/}

//     try {
//         console.log("=== getPoolCampusForCollege called ===");
//         console.log("req.user:", req.user);

//         // ✅ ADD THIS (single source of truth)
//         const userId = req.user?._id;
        
//         // 2. Fetch the postings (visible to everyone)
//         const postings = await getJobPostingsByJobTypeService("Pool-campus", userId);
//         const filteredPostings = postings.filter(p => p.visibleTo === "College");

//         // 3. Logic for LOGGED IN users only
//         if (userId) {
//             // Your existing logic for filtering applications
//             // Use 'userId' instead of 'req.user._id'
//             let collegeProfile = null;
//             const college = await getCollegeService(userId);
            
//             if (college?.success && college?.data?.length > 0) {
//                 collegeProfile = college.data[0];
                
//                 const jobIds = filteredPostings.map(p => p._id);
//                 const applications = await Application.find({ 
//                     applicant: collegeProfile._id, 
//                     job: { $in: jobIds } 
//                 }).select('job').lean();
                
//                 const appliedJobIds = new Set(applications.map(a => String(a.job)));
//                 const finalPostings = filteredPostings.filter(p => !appliedJobIds.has(String(p._id)));
                
//                 return sendResponse(res, 200, { data: finalPostings });
//             }
//         }

//         // 4. Fallback for non-logged in users (Guests)
//         // If no userId or no collegeProfile, just send all visible postings
//         return sendResponse(res, 200, { 
//             data: filteredPostings,
//             message: "Successfully fetched postings (Guest View)"
//         });

//     } catch (error) {
//         console.error("Error in getPoolCampusForCollege:", error.message);
//         sendError(res, 500, "Internal server error");
//     }
// };

export const getPoolCampusForCollege = async (req, res) => {
    const userId = req.user?._id;

    try {
        console.log("=== getPoolCampusForCollege called ===");
        
        let collegeCity = null;
        let collegeProfileId = null;

        // 1. Fetch college info if user is logged in
        if (userId) {
            const college = await getCollegeService(userId);
            if (college?.success && college.data?.[0]) {
                const profile = college.data[0];
                collegeProfileId = profile._id;
                // Capture city for location-based filtering
                collegeCity = profile.collegeUniversityDetails?.collegeLocation;
            }
        }

        // 2. Fetch all Pool-campus postings
        const postings = await getJobPostingsByJobTypeService("Pool-campus", userId);

        // 3. Apply Visibility and Location Filter
        const filteredByLocation = postings.filter((posting) => {
            // Must be visible to Colleges
            if (posting.visibleTo !== "College") return false;

            // Apply Broadcast Logic:
            // If broadcast is 'Location', cities MUST match. 
            // If it's 'Everyone', skip the city check.
            if (posting.broadcastType === "Location") {
                if (!collegeCity) return false; // Hide location-restricted jobs if city is unknown

                const jobCities = posting.venue || [];
                const isMatch = (posting.city === collegeCity) || jobCities.includes(collegeCity);
                
                if (!isMatch) return false;
            }

            return true;
        });

        // 4. Filter out already applied postings for logged-in users
        if (collegeProfileId) {
            const jobIds = filteredByLocation.map(p => p._id);
            const applications = await Application.find({ 
                applicant: collegeProfileId, 
                job: { $in: jobIds } 
            }).select('job').lean();
            
            const appliedJobIds = new Set(applications.map(a => String(a.job)));
            const finalPostings = filteredByLocation.filter(p => !appliedJobIds.has(String(p._id)));
            
            return sendResponse(res, 200, { data: finalPostings });
        }

        // 5. Fallback for Guests
        return sendResponse(res, 200, { 
            data: filteredByLocation,
            message: "Showing jobs based on guest visibility."
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


//comapny-> employer parenmt child working 
export const getPoolCampusForCompany = async (req, res) => {
  const userId = req.user ? req.user._id : null;
  console.log("🧭 ENTRY getPoolCampusForCompany", {
    userType: req.user?.userType,
    activeCompanyId: req.user?.activeCompanyId,
  });

  try {
    let companyProfileId = null;
    let employerProfileId = null;

    // Employer acting for company
    if (req.user?.userType === "employer" && req.user.activeCompanyId) {
      companyProfileId = req.user.activeCompanyId;
    }
    // Company user
    else if (req.user?.userType === "company") {
      const company = await getCompanyService(userId);
      companyProfileId = company?.data?.[0]?._id || null;
    }

    // Employer as individual
    if (req.user?.userType === "employer" && !req.user.activeCompanyId) {
      const employer = await getEmployerService(userId);
      employerProfileId = employer?.data?.[0]?._id || null;
    }

    console.log("🔍 Dashboard Context Debug", {
      companyProfileId,
      employerProfileId,
    });

    // Get all pool-campus postings
    const postings = await getJobPostingsByCollegeService(
      "Pool-campus",
      userId
    );

    // Visible to company
    const filteredPostings = postings.filter(
      (posting) => posting.visibleTo === "Company"
    );

    // Guest view
    if (!companyProfileId && !employerProfileId) {
      return sendResponse(res, 200, {
        data: filteredPostings,
        message: "Guest view: Showing all available postings.",
      });
    }

    // Hide already-applied jobs (company-level)
    const jobIds = filteredPostings.map((p) => p._id);

    const applicationQuery = {
      job: { $in: jobIds },
    };

    if (companyProfileId) {
      // company OR employer-on-behalf
     applicationQuery.$or = [
        { appliedForCompany: companyProfileId },
        { applicant: companyProfileId }
      ];
    } else if (employerProfileId) {
      // employer individual
      applicationQuery.applicant = employerProfileId;
      console.log("👤 Pool-campus employer-individual filter applied");
    }

    console.log("📦 Application Query:", applicationQuery);

    const applications = await Application.find(applicationQuery)
      .select("job")
      .lean();

    const appliedJobIds = new Set(applications.map((a) => String(a.job)));
    const finalPostings = filteredPostings.filter(
      (p) => !appliedJobIds.has(String(p._id))
    );

    return sendResponse(res, 200, { data: finalPostings });
  } catch (error) {
    console.error("Error in getPoolCampusForCompany:", error);
    return sendError(res, 500, "Internal server error");
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
        console.log("userId.....:\n", userId);
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

// export const getInternshipPostings = async (req, res) => {
//     try {
//         const userId = req.user?._id;
//         let studentLocations = [];
//         let appliedJobIds = [];

//         const studentProfile = await getStudentService(userId);

//         if (
//             studentProfile.success &&
//             studentProfile.data.length > 0
//         ) {
//             const student = studentProfile.data[0];
//             studentLocations = student.locations || [];

//             if (userId) {
//                 appliedJobIds = await Application
//                     .find({ applicant: student._id })
//                     .distinct("job");
//             }
//         }

//         const postings =
//             await getJobPostingsByJobTypeWithLocationBasedService(
//                 "Internship",
//                 studentLocations,
//                 userId
//             );

//         const filteredPostings =
//             userId && appliedJobIds.length > 0
//                 ? postings.filter(p =>
//                       !appliedJobIds.some(id => id.equals(p._id))
//                   )
//                 : postings;

//         sendResponse(res, 200, { data: filteredPostings });
//     } catch (error) {
//         console.error("Internship error:", error);
//         sendError(res, 500, "Internal server error");
//     }
// };

export const getInternshipPostings = async (req, res) => {
    console.log('here i am ')
    try {
        const userId = req.user?._id;
        let studentLocations = [];
        let studentProfileId = null;
        let appliedJobIds = [];

        // 1. Fetch Student Profile Standardized
        if (userId) {
            const studentProfile = await getStudentService(userId);
            if (studentProfile?.success && studentProfile.data?.length > 0) {
                const student = studentProfile.data[0];
                studentProfileId = student._id;
                studentLocations = student.locations || [];

                // Fetch jobs student already applied to
                appliedJobIds = await Application.find({ applicant: studentProfileId }).distinct("job");
            }
        }

        // 2. Fetch Base Postings (assuming this service handles basic db fetching)
        const postings = await getJobPostingsByJobTypeService("Internship", userId);

        // 3. Apply Strict Visibility Logic
        const filteredByBroadcast = postings.filter((posting) => {
            // Respect basic visibility
            if (posting.visibleTo === "College") return false;

            // Strict Broadcast Logic: student must have job venue in their locations
            if (posting.broadcastType === "Location") {
                if (!studentLocations.length) return false;

                const norm = (v) => v ? String(v).toLowerCase().replace(/[\s.-]/g, "").trim() : "";
                const jVenue = norm(posting.location);
                const sLocs = studentLocations.map(norm);

                // MATCH: Does student's preference list include the job venue?
                const isVenueMatch = sLocs.includes(jVenue);

                // Bypass if workMode is Remote (Standard practice)
                // if (posting.workMode?.includes("Remote")) return true;

                if (!isVenueMatch) return false;
            }
            return true;
        });

        // 4. Remove Already Applied Postings
        const finalPostings = userId && appliedJobIds.length > 0
            ? filteredByBroadcast.filter(p => !appliedJobIds.some(id => id.equals(p._id)))
            : filteredByBroadcast;

        sendResponse(res, 200, { data: finalPostings });

    } catch (error) {
        console.error("Internship error:", error.message);
        sendError(res, 500, "Internal server error");
    }
};


export const getIntershipById = async (req, res) => {
    console.log('in internship section')
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

{/*export const getIntershipById = async (req, res) => {
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
     */}

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