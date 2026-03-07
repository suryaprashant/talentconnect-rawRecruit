import mongoose from 'mongoose';
import { JobPostingTable } from '../models/jobPostingsModel.js';
import Application from "../models/applicationModel.js";
import OnboardingModel from '../models/studentonboardingModel.js';
import { getStudentService } from './studentService.js';
export const getProfessionalReferralsService = async (userId) => {
  try {
        // Step 1: 
        // Get the student/onboarding profile first
        const authUserId=userId
        const userProfile = await getStudentService(authUserId);
        const onboardingId = userProfile?.data?._id;

        if (!onboardingId) {
            console.log("No onboarding profile found for this user.");
            return [];
        }

        console.log("Searching for jobs with candidatePosted ID:", onboardingId);

        // Step 2: Query using the onboardingId found in your Compass screenshot
        return await JobPostingTable.find({
            candidatePosted: onboardingId,
            jobType: "Referral"
        })
        .sort({ createdAt: -1 })
        .lean();

    } catch (error) {
        console.error("Service Error:", error.message);
        throw error;
    }
};

// get totel job posted and it is in active state 
export const getTotalJobPostedCount = async (filters = {}) => {
  try {
    //  Default filter (current implementation)
    const query = { jobStatus: "Open" };

    //  Optional filter by jobType (string field)
    if (filters.jobType) {
      query.jobType = filters.jobType;
    }

    const totalJobs = await JobPostingTable.countDocuments(query);
    return totalJobs;
  } catch (error) {
    console.error("Error in getTotalJobPostedCount:", error.message);
    throw new Error("Failed to get total job posted count");
  }
};

// get all data with application count
export const getAll = async () => {
  try {
    // Fetch job postings with populated fields
    const jobs = await JobPostingTable.find()
      .populate({
        path: "candidatePosted",
        select: "name"
      })
      .populate({
        path: "companyPosted",
        select: "name"
      })
      .populate({
        path: "collegePosted",
        select: "name"
      })
      .lean(); // Use lean() to get plain JS objects instead of Mongoose docs

    // Get all application counts grouped by job
    const applicationCounts = await Application.aggregate([
      {
        $group: {
          _id: "$job",
          totalApplications: { $sum: 1 }
        }
      }
    ]);

    // Convert counts to a lookup object for fast mapping
    const countsMap = {};
    applicationCounts.forEach((item) => {
      countsMap[item._id.toString()] = item.totalApplications;
    });

    // Add applicationCount field to each job
    const jobsWithCount = jobs.map((job) => ({
      ...job,
      applicationCount: countsMap[job._id.toString()] || 0
    }));

    return jobsWithCount;
  } catch (error) {
    console.error("❌ Error in getAll service:", error.message);
    throw new Error("Failed to fetch job postings from the database");
  }
};





export const createPostingService = async (postingData , authUserId) => {
    try {

        const enhancedPostingData = {
            ...postingData,
            postedByUser: authUserId 
        };
      
        const newPosting = new JobPostingTable(enhancedPostingData);
       
        const savedPosting = await newPosting.save();
      
        return savedPosting;
    } catch (error) {

        console.error("Error in createPostingService:", error.message);
        throw error;
    }
};


export const getJobPostingsByJobTypeService = async (jobType, userId, studentProfile = null) => {
    try {
        const postings = await JobPostingTable.find({ jobType })
            .populate({
                path: 'companyPosted',
                select: 'companyDetails profileImage profileImageUrl name hiringPreferences', // companyDetails is already in companyPosted
            })
            .lean();

        const currentDate = new Date();
        
        let processedPostings = postings.map(posting => {
            let status = posting.jobStatus;
            if (posting.startDate && posting.endDate) {
                const startDate = new Date(posting.startDate);
                const endDate = new Date(posting.endDate);

                if (currentDate < startDate) status = "Pending";
                else if (currentDate >= startDate && currentDate <= endDate) status = "Open";
                else status = "Closed";
            }
            return { ...posting, jobStatus: status };
        });

        // --- STEP 2: Applied Jobs Filter ---
        if (userId) {
            let applicantId;
            if (studentProfile && studentProfile._id) {
                applicantId = studentProfile._id;
            } else {
                if (mongoose.Types.ObjectId.isValid(userId)) {
                    applicantId = userId;
                } else {
                    const student = await OnboardingModel.findOne({ userId }).select('_id').lean();
                    applicantId = student ? student._id : userId;
                }
            }

            const jobIds = processedPostings.map(p => p._id);
            const applications = await Application.find({
                applicant: applicantId,
                job: { $in: jobIds }
            }).select('job').lean();

            const appliedJobIds = new Set(applications.map(a => String(a.job)));
            processedPostings = processedPostings.filter(p => !appliedJobIds.has(String(p._id)));
        }

        // DEBUG: Log what we're getting
        if (processedPostings.length > 0) {
            console.log("Sample posting company data:", {
                hasCompanyPosted: !!processedPostings[0].companyPosted,
                companyPostedKeys: processedPostings[0].companyPosted ? Object.keys(processedPostings[0].companyPosted) : 'none',
                companyDetails: processedPostings[0].companyPosted?.companyDetails,
                companyName: processedPostings[0].companyPosted?.companyDetails?.companyName
            });
        }

        return processedPostings;
    } catch (error) {
        console.error("Error in getJobPostingsByJobTypeService:", error.message);
        throw error;
    }
};
    

   

export const getReferralJobsService = async (jobType, candidatePostedId) => {
    try {
        const response = await JobPostingTable.find({
            jobType: jobType,
            approvalStatus: "Approved", 
            candidatePosted: { $ne: candidatePostedId }
        })
            .populate('candidatePosted')
            .lean()
            .sort({ createdAt: -1 });

        // If userId provided, filter out jobs the user already applied for
        if (candidatePostedId) {
            try {
                let applicantId = candidatePostedId;

                if (!applicantId) {
                    try {
                        applicantId = new mongoose.Types.ObjectId(userId);
                    } catch (e) {
                        applicantId = userId;
                    }
                }

                const jobIds = response.map(r => r._id);
                const applications = await Application.find({ applicant: applicantId, job: { $in: jobIds } }).select('job').lean();
                const appliedJobIds = new Set(applications.map(a => String(a.job)));
                const filtered = response.filter(r => !appliedJobIds.has(String(r._id)));
                return filtered;
            } catch (err) {
                console.error('Error filtering referral jobs by applications:', err);
                return { success: true, response };
            }
        }

        return response;
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}

export const getJobPostingsByJobTypeWithLocationBasedService = async (jobType, studentLocations = [], userId) => {
    try {
        let query = { jobType };

        if (studentLocations && studentLocations.length > 0) {
            query.$or = [
                { broadcastType: 'Everyone' },
                { broadcastType: 'Location', location: { $in: studentLocations } }
            ];
        } else {
            query.broadcastType = 'Everyone';
        }

        const postings = await JobPostingTable.find(query)
            .populate('companyPosted')
            .sort({ createdAt: -1 });

        const currentDate = new Date();
        const updatedPostings = postings.map(posting => {
            let status = posting.jobStatus;

            if (posting.startDate && posting.endDate) {
                const startDate = new Date(posting.startDate);
                const endDate = new Date(posting.endDate);

                if (currentDate < startDate) {
                    status = "Pending";
                } else if (currentDate >= startDate && currentDate <= endDate) {
                    status = "Open";
                } else if (currentDate > endDate) {
                    status = "Closed";
                }
            }

            return {
                ...posting.toObject(),
                jobStatus: status
            };
        });

        // Filter out jobs the user has already applied for
        if (userId) {
            try {
                let applicantId = null;
                const onboarding = await OnboardingModel.findOne({ userId: userId }).select('_id').lean();
                if (onboarding && onboarding._id) applicantId = onboarding._id;

                if (!applicantId) {
                    try {
                        applicantId = new mongoose.Types.ObjectId(userId);
                    } catch (e) {
                        applicantId = userId;
                    }
                }

                const jobIds = postings.map(p => p._id);
                const applications = await Application.find({
                    applicant: applicantId,
                    job: { $in: jobIds }
                }).select('job').lean();

                const appliedJobIds = new Set(applications.map(a => String(a.job)));
                const filteredPostings = updatedPostings.filter(p => !appliedJobIds.has(String(p._id)));
                return filteredPostings;
            } catch (err) {
                console.error('Error checking applications for user:', err);
                return updatedPostings;
            }
        }

        return updatedPostings;
    } catch (error) {
        console.error("Error in getJobPostingsByJobTypeService:", error.message);
        throw error;
    }
};

export const getJobPostingsByCollegeService = async (jobType) => {
    try {
        const postings = await JobPostingTable.find({ jobType }).populate('collegePosted');

        const currentDate = new Date();

        // Mapping of normalized degree → degreeType category
        const degreeToDegreeTypeMap = {
            // Polytechnic
            "engineering": "Polytechnic",
            "mechanical": "Polytechnic",
            "civil": "Polytechnic",
            "electrical": "Polytechnic",
            "electronics": "Polytechnic",

            // ITI
            "fitter": "ITI",
            "welding": "ITI",

            // Diploma
            "dpharma": "Diploma",

            // Undergraduate
            "puchumanities": "Undergraduate",
            "puccommerce": "Undergraduate",
            "btech": "Undergraduate",
            "be": "Undergraduate",
            "bsc": "Undergraduate",
            "bca": "Undergraduate",
            "bba": "Undergraduate",
            "bbm": "Undergraduate",
            "ba": "Undergraduate",
            "bpharma": "Undergraduate",

            // Postgraduate
            "mtech": "Postgraduate",
            "me": "Postgraduate",
            "mba": "Postgraduate",
            "ma": "Postgraduate",
            "mca": "Postgraduate",
            "msc": "Postgraduate",
            "mcom": "Postgraduate",
            "mpharma": "Postgraduate"
        };

        const updatedPostings = postings.map(posting => {
            let status = posting.jobStatus;

            // --- Determine job status based on start/end dates ---
            if (posting.startDate && posting.endDate) {
                const startDate = new Date(posting.startDate);
                const endDate = new Date(posting.endDate);

                if (currentDate < startDate) {
                    status = "Pending";
                } else if (currentDate >= startDate && currentDate <= endDate) {
                    status = "Open";
                } else if (currentDate > endDate) {
                    status = "Closed";
                }
            }

            // --- Derive degreeType category from degree field ---
            const degreeValues = posting.degree || [];
            const degreeTypeSet = new Set();

            degreeValues.forEach(deg => {
                // normalize: lowercase, remove dots, dashes, spaces, and trim
                const normalized = deg
                    ?.toLowerCase()
                    .replace(/[\s.\-]/g, "")  // remove spaces, dots, and hyphens
                    .trim();

                const mappedDegreeType = degreeToDegreeTypeMap[normalized];
                if (mappedDegreeType) degreeTypeSet.add(mappedDegreeType);
            });

            const degreeType = Array.from(degreeTypeSet); 
            return {
                ...posting.toObject(),
                jobStatus: status,
                degreeType
            };
        });

        return updatedPostings;
    } catch (error) {
        console.error("Error in getJobPostingsByCollegeService:", error.message);
        throw error;
    }
};

export const getJobPostedByCompanyService = async (Id, jobType, userType , authUserId = null) => {
    try {
        let response;
          if (userType === 'company') {
            response = await JobPostingTable.find({ 
                companyPosted: Id, 
                jobType: jobType 
            }).lean();
          
        }
         else if (userType === 'employer') {
            const query = { 
                companyPosted: Id,      
                jobType: jobType,
                postedByUser: authUserId 
            };
            
            response = await JobPostingTable.find(query).lean();
          
        }
        else if (userType === 'college') response = await JobPostingTable.find({ collegePosted: Id, jobType: jobType }).lean();
        //  console.log(response);
        return { success: true, response: response };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}



export const deleteJobByIdService = async (jobId, companyId) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // 1️⃣ Verify job belongs to company
        const job = await JobPostingTable.findOne(
            { _id: jobId, companyPosted: companyId },
            null,
            { session }
        );

        if (!job) {
            throw new Error("Job not found or unauthorized");
        }

        // 2️⃣ Delete all applications for this job
        await Application.deleteMany(
            { job: jobId },
            { session }
        );

        // 3️⃣ Delete the job itself
        await JobPostingTable.deleteOne(
            { _id: jobId },
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        return { success: true, msg: "Job and related applications deleted successfully" };

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Delete Job Error:", error.message);
        throw error;
    }
};