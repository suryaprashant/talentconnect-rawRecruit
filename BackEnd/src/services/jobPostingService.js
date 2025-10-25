import mongoose from 'mongoose';
import { JobPostingTable } from '../models/jobPostingsModel.js';
import Application from '../models/applicationModel.js';
import OnboardingModel from '../models/studentonboardingModel.js';

export const createPostingService = async (postingData) => {
    try {
        const newPosting = new JobPostingTable(postingData);
        console.log("New Posting Data:", newPosting);
        const savedPosting = await newPosting.save();
        // console.log("Saved Posting Data:", savedPosting);
        return savedPosting;
    } catch (error) {

        console.error("Error in createPostingService:", error.message);
        throw error;
    }
};


export const getJobPostingsByJobTypeService = async (jobType, userId) => {
    try {
        const postings = await JobPostingTable.find({ jobType }).populate('companyPosted')
            .sort({ createdAt: -1 });

        const currentDate = new Date();
        const updatedPostings = postings.map(posting => {
            let status = posting.jobStatus;

            // Check and update status based on dates
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

export const getReferralJobsService = async (jobType, candidatePostedId) => {
    try {
        const response = await JobPostingTable.find({
            jobType: jobType,
            candidatePosted: { $ne: candidatePostedId }
        })
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
        const updatedPostings = postings.map(posting => {
            let status = posting.jobStatus;

            // Check and update status based on dates
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
        // console.log("Updated Postings:", updatedPostings);
        return updatedPostings;
    } catch (error) {
        console.error("Error in getJobPostingsByJobTypeService:", error.message);
        throw error;
    }
};



// export const getJobPostingsByCollegeService = async (jobType) => {
//     try {
//         const postings = await JobPostingTable.find({ jobType }).populate('collegePosted');

//         const currentDate = new Date();
//         const updatedPostings = postings.map(posting => {
//             let status = posting.jobStatus;

//             // Check and update status based on dates
//             if (posting.startDate && posting.endDate) {
//                 const startDate = new Date(posting.startDate);
//                 const endDate = new Date(posting.endDate);

//                 if (currentDate < startDate) {
//                     status = "Pending";
//                 } else if (currentDate >= startDate && currentDate <= endDate) {
//                     status = "Open";
//                 } else if (currentDate > endDate) {
//                     status = "Closed";
//                 }
//             }

//             return {
//                 ...posting.toObject(),
//                 jobStatus: status
//             };
//         });
//         console.log("Updated Postings:", updatedPostings);
//         return updatedPostings;
//     } catch (error) {
//         console.error("Error in getJobPostingsByJobTypeService:", error.message);
//         throw error;
//     }
// };

export const getJobPostedByCompanyService = async (Id, jobType, userType) => {
    try {
        let response;
        if (userType === 'company') response = await JobPostingTable.find({ companyPosted: Id, jobType: jobType }).lean();
        else if (userType === 'college') response = await JobPostingTable.find({ collegePosted: Id, jobType: jobType }).lean();
        //  console.log(response);
        return { success: true, response: response };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}



export const deleteJobByIdService = async (jobId, companyId) => {
    try {
        const response = await JobPostingTable.findOneAndDelete({ _id: jobId, companyPosted: companyId });
        // console.log(response);
        return { success: true, msg: "Job Deleted" };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}