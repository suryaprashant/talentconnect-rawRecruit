import { JobPostingTable } from '../models/jobPostingsModel.js';

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

export const getJobPostingsByJobTypeWithLocationBasedService = async (jobType, studentLocations = []) => {
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

export const getJobPostedByCompanyService = async (Id, jobType,userType) => {
    try {
        let response;
        if(userType==='company') response = await JobPostingTable.find({ companyPosted: Id, jobType: jobType }).lean();
        else if(userType==='college') response = await JobPostingTable.find({ collegePosted: Id, jobType: jobType }).lean();
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