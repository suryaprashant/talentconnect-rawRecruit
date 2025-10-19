import { JobPostingTable } from '../models/jobPostingsModel.js';
import Application from "../models/applicationModel.js";

// get totel job posted and it is in active state 
export const getTotalJobPostedCount = async (filters = {}) => {
  try {
    // ✅ Default filter (current implementation)
    const query = { jobStatus: "Open" };

    // ✅ Optional filter by jobType (string field)
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


export const getJobPostingsByJobTypeService = async (jobType) => {
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
        // console.log("Updated Postings:", updatedPostings);
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

export const getJobPostedByCompanyService = async (companyId, jobType) => {
    try {
        const response = await JobPostingTable.find({ companyPosted: companyId, jobType: jobType }).lean();
        //  console.log(response);
        return { success: true, response: response };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}



export const deleteJobByIdService = async (jobId,companyId) => {
    try {
        const response = await JobPostingTable.findOneAndDelete({ _id: jobId, companyPosted: companyId });
        // console.log(response);
        return { success: true, msg: "Job Deleted" };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}