import mongoose from 'mongoose';

import Application from '../models/applicationModel.js';
import { JobPostingTable } from '../models/jobPostingsModel.js';
import { getCollegeService } from './collegeService.js';
import { getCompanyService } from './companyService.js';
import { getEmployerService } from './companyService.js';


class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

//////////////////////////////////////
/**
 * Deletes the 'Saved' application record for a specific user and job.
 */
export async function unsaveJobService(applicantId, jobId) {
    try {
        // We only remove the record if the status is "Saved".
        // This prevents deleting an actual "Applied" or "Shortlisted" application.
        const result = await Application.findOneAndDelete({
            applicant: applicantId,
            job: jobId,
            currentStatus: "Saved"
        });

        if (!result) {
            return { success: false, message: "Save record not found or job already applied" };
        }

        return { success: true, message: "Job removed from saved successfully" };
    } catch (error) {
        console.error("Error in unsaveJobService:", error.message);
        throw new Error("Failed to unsave job");
    }
}

export const getAll = async () => {
    try {
        const applications = await Application.find();
        return applications;
    } catch (error) {
        console.error("❌ Error in getAllApplications service:", error.message);
        throw new Error("Failed to fetch applications from the database");
    }
};

// export const getTotalJobApplicationSubmited = async () => {
//   try {
//     const totalapplication = await Application.countDocuments({currentStatus:"Applied"});
//     return totalapplication;
//   } catch (error) {
//     console.error("Error in getTotalJobApplicationSubmited:", error.message);
//     throw new Error("Failed to get total Application");
//   }
// };

export const getTotalJobApplicationSubmited = async (filter = {}) => {
    try {
        return await Application.countDocuments(filter);
    } catch (error) {
        console.error("Error in getTotalApplicationSubmited:", error);
        throw error;
    }
};

// check if similar application exists
export async function getApplicationService(userId, userType, jobId, jobType) {
    try {
        const response = await Application.find({
            applicant: userId,
            applicantType: userType,
            job: jobId,
            jobType: jobType
        });
        return { success: true, response: response }
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}

/*export async function getSavedJobsService(userId) {
    try {
        const applications = await Application.aggregate([
            {
                $match: {
                    currentStatus: "Saved",
                    applicant: new mongoose.Types.ObjectId(userId),
                    // applicantType: userType
                }
            },
            {
                $lookup: {
                    from: "jobpostingtables",
                    localField: "job",
                    foreignField: "_id",
                    as: "jobDetails"
                }
            }
        ]);
        return { success: true, data: applications }
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}*/
//Prathmesh
export async function getSavedJobsService(userId) {
  try {
    const applications = await Application.find({
      currentStatus: "Saved",
      applicant: userId,
    })
      .populate({
        path: "job",
        populate: {
          path: "companyPosted",
          model: "CompanyProfile",
       select: "companyDetails.companyName profileImageUrl",
        },
      })
      .lean();

    return { success: true, data: applications };
  } catch (error) {
    console.error("Error:", error.message);
    throw new Error("Failed to fetch saved jobs");
  }
}

//prathmesh-company
export async function getSavedCollegesService(applicantId, applicantType) {
  try {
    const applications = await Application.find({
      applicant: applicantId,
      applicantType: { $in: ["company", "employer"] },
      currentStatus: "Saved",
    })
      .populate({
        path: "job",
        populate: {
          path: "collegePosted",
          // OPTIONAL (recommended if name missing)
          populate: {
            path: "collegeUniversityDetails",
          },
        },
      })
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      data: applications,
    };
  } catch (error) {
    console.error("Error in getSavedCollegesService:", error);
    return {
      success: false,
      message: "Failed to fetch saved colleges",
    };
  }
}

// save job by user
export async function saveJobService(userId, userType, jobId, jobType) {
    try {
      
        const existing = await getApplicationService(userId, userType, jobId, jobType);

        if (existing?.response[0]?.currentStatus === "Applied" || existing?.response[0]?.currentStatus === "Shortlisted" || existing?.response[0]?.currentStatus === "Rejected" || existing?.response[0]?.currentStatus === "Accepted") {
            return { success: false, message: `Already ${existing?.response[0]?.currentStatus}` };
        }
        else if (existing?.response[0]?.currentStatus === "Saved") {
            return { success: false, message: "Already saved" }
        }
        else {
            const newApplication = new Application({
                applicant: userId,
                applicantType: userType,
                appliedByType: userType, 
                job: jobId,
                jobType: jobType,
                statusHistory: [{ status: "Saved" }],
                currentStatus: "Saved"
            });
            await newApplication.save();
        }
        return { success: true, message: 'Application submited!' };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to Save");
    }
}

// create application
{/*export async function createApplicationService({appliedByUserId,
  appliedByType,
  appliedForCompanyId,
  jobId,
  jobType,}) {
    try {
        // 1️⃣ Decide who the applicant is
        let applicantId;

        if (appliedByType === "employer") {
          applicantId = appliedByUserId;               // employer profile
        } else if (appliedByType === "company") {
          applicantId = appliedForCompanyId;           // company profile
        } else {
          applicantId = appliedByUserId;               // student / college
        }

        const existing = await Application.findOne({
          job: jobId,
          jobType,
          appliedForCompany: appliedForCompanyId,
        });

       
        if (existing?.response[0]?.currentStatus === "Shortlisted" || existing?.response[0]?.currentStatus === "Accepted" || existing?.response[0]?.currentStatus === "Rejected") {
            return { success: false, message: `currentStatus: ${existing?.response[0]?.currentStatus}` };
        }
        else if (existing?.response[0]?.currentStatus === "Applied") {
            return { success: false, message: "Already Applied" };
        }
        else if (existing?.response[0]?.currentStatus === "Saved") {
            existing.response[0].currentStatus = "Applied";
            existing.response[0].statusHistory.push({ status: "Applied" });
            await existing.response[0].save();
        }
        else {
            const newApplication = new Application({
              applicant: applicantId,
              applicantType: appliedByType,
              appliedByType,
              appliedForCompany: appliedForCompanyId, // 🔑 new field
              job: jobId,
              jobType: jobType,
              statusHistory: [{ status: "Applied" }],
              currentStatus: "Applied"
            });

            await newApplication.save();

        }

        return { success: true, message: 'Application submited!' };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to Save");
    }
}*/}

//step3 apply service
export async function createApplicationService({
  appliedByUserId,
  appliedByType,
  appliedForCompanyId,
  jobId,
  jobType,
}) {
  try {
    // 1️⃣ Decide applicant
    let applicantId;

    if (appliedByType === "company") {
      applicantId = appliedForCompanyId;
    } else {
      // employer / student / college / fresher / professional
      applicantId = appliedByUserId;
    }

    if (jobType === "Referral") {
      const job = await JobPostingTable.findOne({
        _id: jobId,
        jobType: "Referral",
      }).select("approvalStatus");
    
      if (!job) {
        return { success: false, message: "Referral job not found" };
      }
    
      if (job.approvalStatus !== "Approved") {
        return {
          success: false,
          message: "Referral job not approved by admin yet",
        };
      }
    }

    // 2️⃣ Build SAFE uniqueness condition
    const match = {
      job: jobId,
      jobType,
    };

    if (appliedForCompanyId) {
      // company or employer-on-behalf
      match.appliedForCompany = appliedForCompanyId;
    } else {
      // student / college / employer independent
      match.applicant = applicantId;
    }

    const existing = await Application.findOne(match);

    if (existing) {
      if (
        ["Shortlisted", "Accepted", "Rejected"].includes(existing.currentStatus)
      ) {
        return {
          success: false,
          message: `currentStatus: ${existing.currentStatus}`,
        };
      }

      if (existing.currentStatus === "Applied") {
        return { success: false, message: "Already Applied" };
      }

      if (existing.currentStatus === "Saved") {
        existing.currentStatus = "Applied";
        existing.statusHistory.push({ status: "Applied" });
        await existing.save();
        return { success: true, message: "Application submitted!" };
      }
    }

    // 3️⃣ Create new application
    const newApplication = new Application({
      applicant: applicantId,
      applicantType: appliedByType,
      appliedByType,
      appliedForCompany: appliedForCompanyId || null,
      job: jobId,
      jobType,
      statusHistory: [{ status: "Applied" }],
      currentStatus: "Applied",
    });

    await newApplication.save();

    return { success: true, message: "Application submitted!" };
  } catch (error) {
    console.error("createApplicationService error:", error);
    throw new Error("Failed to Save");
  }
}


export async function createInternshipApplicationService(userId, userType, jobId, jobType) {
    try {
        const existing = await getApplicationService(userId, userType, jobId, jobType);
       
        if (existing?.response[0]?.currentStatus === "Shortlisted" || existing?.response[0]?.currentStatus === "Accepted" || existing?.response[0]?.currentStatus === "Rejected") {
            return { success: false, message: `currentStatus: ${existing?.response[0]?.currentStatus}` };
        }
        else if (existing?.response[0]?.currentStatus === "Applied") {
            return { success: false, message: "Already Applied" };
        }
        else if (existing?.response[0]?.currentStatus === "Saved") {
            existing.response[0].currentStatus = "Applied";
            existing.response[0].statusHistory.push({ status: "Applied" });
            await existing.response[0].save();
        }
        else {
            const newApplication = new Application({
                applicant: userId,
                applicantType: userType,
                appliedByType: userType, 
                job: jobId,
                jobType: jobType,
                statusHistory: [{ status: "Applied" }],
                currentStatus: "Applied"
            });
            await newApplication.save();

        }

        return { success: true, message: 'Application submited!' };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to Save");
    }
}


// getStatus
// export async function fetchApplicationStatusService(userId, jobType, userType) {
//     let fromCollection;
//     let localField;
//     if (userType === 'company') {
//         fromCollection = "collegeonboardings";
//         localField = "jobDetails.collegePosted";
//     }
//     if (userType === 'employer') {
//         fromCollection = "collegeonboardings";
//         localField = "jobDetails.collegePosted";
//     }
//     else {
//         fromCollection = "companyprofiles";
//         localField = "jobDetails.companyPosted";
//     }

//     try {
//         const applicationData = await Application.aggregate([
//             {
//                 $match: {
//                     applicant: new mongoose.Types.ObjectId(userId),
//                     jobType: jobType,
//                     currentStatus: { $ne: 'Saved' }
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'jobpostingtables',
//                     localField: 'job',
//                     foreignField: '_id',
//                     as: 'jobDetails'
//                 }
//             },
//             // { $unwind: '$jobDetails' },
//             {
//                 $lookup: {
//                     from: fromCollection,
//                     localField: localField,
//                     foreignField: '_id',
//                     // as: 'companyDetails'
//                     as: 'postedByDetails'
//                 }
//             },
//             // { $unwind: '$companyDetails' },
//             // {
//             //     $project: {
//             //         job: 1,
//             //         statusHistory: 1,
//             //         currentStatus: 1,
//             //         createdAt: 1,
//             //         "jobDetails.jobTitle": 1,
//             //         "jobDetails._id": 1,
//             //         "jobDetails.jobDescription": 1,
//             //         "jobDetails.preferredHiringLocation": 1,
//             //         "jobDetails.yearsOfExperience": 1,
//             //         "companyDetails.companyName": 1, // example field, adjust as needed
//             //         "companyDetails.companyDetails": 1 // example field, adjust as needed
//             //     }
//             // }
//         ]);

//         return { success: true, data: applicationData };
//     } catch (error) {
//         console.log("Error: ", error.message);
//         throw new Error("Failed to fetch");
//     }
// }

////////////MANAV//////////////
// export async function fetchApplicationStatusService(userId, jobType, userType) {


//     try {
        

//         const applicationData = await Application.aggregate([
//             {
//                 $match: {
//                     applicant: new mongoose.Types.ObjectId(userId),
//                     jobType: jobType,
//                     currentStatus: { $ne: 'Saved' }
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'jobpostingtables',
//                     localField: 'job',
//                     foreignField: '_id',
//                     as: 'jobDetails'
//                 }
//             },
//             { $unwind: { path: "$jobDetails", preserveNullAndEmptyArrays: true } },
//             {
//                 $lookup: {
//                     from: 'companyprofiles', // Ensure this matches your DB collection name
//                     localField: 'jobDetails.companyPosted',
//                     foreignField: '_id',
//                     as: 'companyProfile'
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'collegeonboardings',
//                     localField: 'jobDetails.collegePosted',
//                     foreignField: '_id',
//                     as: 'collegeDetails'
//                 }
//             },
//             {
//                 $lookup: {
//                     from: userType === 'company' || userType === 'employer' 
//                         ? 'collegeonboardings' 
//                         : 'companyprofiles',
//                     localField: 'jobDetails.postedBy',
//                     foreignField: '_id',
//                     as: 'postedByDetails'
//                 }
//             },
//             // Add debug fields
//             {
//                $addFields: {
//                     // This ensures jobDetails is an object, not an array
//                     jobDetails: { $arrayElemAt: ["$jobDetails", 0] },
//                     // This attaches the company profile (with the logo)
//                     companyProfile: { $arrayElemAt: ["$companyProfileDetails", 0] },
//                     collegeDetails: { $arrayElemAt: ["$collegeDetails", 0] }
//                 }
//             }
//         ]);

//         // 🔍 COMPREHENSIVE DEBUGGING
//         console.log("🔍 Total applications found:", applicationData.length);
        
//         if (applicationData.length > 0) {
//             const firstApp = applicationData[0];
//             //console.log("🔍 FIRST APPLICATION DEBUG:");
//             //console.log(JSON.stringify(firstApp, null, 2));
            
//             //console.log("🔍 KEY FIELDS:");
//             //console.log("1. jobDetails count:", firstApp.debugJobDetailsCount);
//             //console.log("2. collegeDetails count:", firstApp.debugCollegeDetailsCount);
//             //console.log("3. jobDetails[0].collegePosted:", firstApp.debugJobDetailsCollegePosted);
            
//             if (firstApp.collegeDetails && firstApp.collegeDetails.length > 0) {
//                 const college = firstApp.collegeDetails[0];
//                 console.log("4. collegeDetails[0] keys:", Object.keys(college));
                
//                 // Check EVERY field for possible college name
//                 Object.keys(college).forEach(key => {
//                     const value = college[key];
//                     if (typeof value === 'string' && value.length < 100) {
//                         console.log(`   "${key}": "${value}"`);
//                     } else if (key === 'collegeUniversityDetails') {
//                         console.log(`   "${key}":`, value);
//                         if (value && typeof value === 'object') {
//                             console.log(`   "${key}" keys:`, Object.keys(value));
//                             Object.keys(value).forEach(subKey => {
//                                 if (typeof value[subKey] === 'string') {
//                                     console.log(`     "${subKey}": "${value[subKey]}"`);
//                                 }
//                             });
//                         }
//                     }
//                 });
                
//                 // Try to find college name
//                 console.log("5. Searching for college name...");
//                 const possiblePaths = [
//                     () => college.collegeUniversityDetails?.collegeName,
//                     () => college.collegeUniversityDetails?.name,
//                     () => college.collegeName,
//                     () => college.name,
//                     () => college.institutionName,
//                     () => college.universityName,
//                     () => college.collegeDetails?.collegeName
//                 ];
                
//                 possiblePaths.forEach((path, i) => {
//                     const result = path();
//                     console.log(`   Path ${i + 1}: ${path.toString().match(/college\.([^}]+)/)?.[1] || 'unknown'} = "${result}"`);
//                 });
//             }
//         }
//           console.log(applicationData)
//         return { success: true, data: applicationData };
//     } catch (error) {
//         console.log("Error: ", error.message);
//         throw new Error("Failed to fetch");
//     }
// }

// export async function fetchApplicationStatusService(userId, jobType, userType) {
//     try {
//         console.log("🔍 BACKEND DEBUG - Starting service");
//         console.log("🔍 Parameters:", { userId, jobType, userType });

//         const applicationData = await Application.aggregate([
//             {
//                 $match: {
//                     applicant: new mongoose.Types.ObjectId(userId),
//                     jobType: jobType,
//                     currentStatus: { $ne: 'Saved' }
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'jobpostingtables',
//                     localField: 'job',
//                     foreignField: '_id',
//                     as: 'jobDetails'
//                 }
//             },
//             // 🔥 DYNAMIC LOOKUP based on applicantType
//             {
//                 $lookup: {
//                     from: {
//                         $switch: {
//                             branches: [
//                                 {
//                                     case: { $eq: ["$applicantType", "college"] },
//                                     then: "collegeonboardings"
//                                 },
//                                 {
//                                     case: { $eq: ["$applicantType", "student"] },
//                                     then: "students"
//                                 },
//                                 {
//                                     case: { $eq: ["$applicantType", "company"] },
//                                     then: "companyprofiles"
//                                 },
//                                 {
//                                     case: { $eq: ["$applicantType", "employer"] },
//                                     then: "employers"
//                                 }
//                             ],
//                             default: "collegeonboardings"  // Default if unknown
//                         }
//                     },
//                     localField: 'applicant',
//                     foreignField: '_id',
//                     as: 'applicantDetails'
//                 }
//             },
//             // For company info from job
//             {
//                 $lookup: {
//                     from: 'companyprofiles',
//                     localField: 'jobDetails.postedBy',
//                     foreignField: '_id',
//                     as: 'companyDetails'
//                 }
//             },
//             // Add debug fields
//             {
//                 $addFields: {
//                     debugApplicant: "$applicant",
//                     debugApplicantType: "$applicantType",
//                     debugApplicantDetailsCount: { $size: "$applicantDetails" },
//                     debugJobDetailsCount: { $size: "$jobDetails" },
//                     debugApplicantDetailsKeys: {
//                         $cond: {
//                             if: { $gt: [{ $size: "$applicantDetails" }, 0] },
//                             then: { $objectToArray: { $arrayElemAt: ["$applicantDetails", 0] } },
//                             else: []
//                         }
//                     }
//                 }
//             }
//         ]);

//         // DEBUGGING
//         console.log("🔍 Total applications found:", applicationData.length);
        
//         if (applicationData.length > 0) {
//             const firstApp = applicationData[0];
//             console.log("🔍 FIRST APPLICATION DEBUG:");
//             console.log("applicantType:", firstApp.applicantType);
//             console.log("applicantDetails count:", firstApp.debugApplicantDetailsCount);
            
//             if (firstApp.applicantDetails && firstApp.applicantDetails.length > 0) {
//                 const applicant = firstApp.applicantDetails[0];
//                 console.log("🔍 Applicant Details Found!");
//                 console.log("Collection:", firstApp.applicantType === 'college' ? 'collegeonboardings' : 'unknown');
//                 console.log("All keys:", Object.keys(applicant));
                
//                 // Search for name/college name in all possible fields
//                 const nameFields = ['collegeName', 'name', 'institutionName', 'universityName', 'collegeUniversityName', 'title'];
//                 nameFields.forEach(field => {
//                     if (applicant[field]) {
//                         console.log(`✅ Found ${field}: "${applicant[field]}"`);
//                     }
//                 });
//             }
//         }

//         return { success: true, data: applicationData };
//     } catch (error) {
//         console.log("Error: ", error.message);
//         throw new Error("Failed to fetch");
//     }
// }

// job management
// joblisting and offcampus

export async function fetchApplicationStatusService(userId, jobType, userType, activeCompanyId = null) {
  try {
    let matchStage = {
      jobType,
      currentStatus: { $ne: "Saved" },
    };

    if (userType === "employer") {
      matchStage.appliedByType = "employer";
      matchStage.appliedForCompany = new mongoose.Types.ObjectId(
        activeCompanyId || userId
      );
    }

    else if (userType === "company") {
      matchStage.appliedForCompany = new mongoose.Types.ObjectId(userId);
    } 
    else {
      matchStage.applicant = new mongoose.Types.ObjectId(userId);
    }

    console.log("Match stage for aggregation:", matchStage);

    const applicationData = await Application.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "jobpostingtables",
          localField: "job",
          foreignField: "_id",
          as: "jobDetails",
        },
      },
      { $unwind: { path: "$jobDetails", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "companyprofiles",
          localField: "jobDetails.companyPosted",
          foreignField: "_id",
          as: "companyProfile",
        },
      },
      {
        $lookup: {
          from: "collegeonboardings",
          localField: "jobDetails.collegePosted",
          foreignField: "_id",
          as: "collegeDetails",
        },
      },
      {
        $addFields: {
          companyProfile: { $arrayElemAt: ["$companyProfile", 0] },
          collegeDetails: { $arrayElemAt: ["$collegeDetails", 0] },
        },
      },
    ]);

    console.log("🔍 Total applications found:", applicationData.length);
    return { success: true, data: applicationData };
  } catch (error) {
    console.error("Aggregation Error:", error.message);
    throw new Error("Failed to fetch");
  }
}



export async function fetchApplicationsByJobService(
  jobId,
  jobType,
  targetStatus,
  isVisited
) {
  try {
    console.log("bantai");
    const matchConditions = {
      job: new mongoose.Types.ObjectId(jobId),
      jobType: jobType,
      currentStatus: targetStatus,
    };

    if (isVisited !== undefined) {
      matchConditions.isVisited =
        isVisited === "true" || isVisited === true ? true : false;
    }

    const response = await Application.aggregate([
      {
        $match: matchConditions,
      },
      {
        $lookup: {
          from: "onboardings",
          localField: "applicant",
          foreignField: "_id",
          as: "applicant",
        },
      },
      {
        $unwind: {
          path: "$applicant",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          applicant: 1,
          jobType: 1,
          statusHistory: 1,
          currentStatus: 1,
          createdAt: 1,
        },
      },
    ]);

    const idsToMarkVisited = response
      .filter((doc) => !doc.isVisited)
      .map((doc) => doc._id);

    if (idsToMarkVisited.length > 0) {
      await Application.updateMany(
        { _id: { $in: idsToMarkVisited } },
        { $set: { isVisited: true } }
      );
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.log("Error:", error.message);
    throw new Error("Failed to fetch");
  }
}



// oncampus and poolcampus -> past new working for company employer Prathmesh
export async function fetchCollegeApplicationsByJobService(
  jobId,
  jobType,
  userType,
  targetStatus,
  isVisited
) {
  try {
    console.log("hello 23");
    const matchConditions = {
      job: new mongoose.Types.ObjectId(jobId),
      jobType,
    };

    if (targetStatus) {
      matchConditions.currentStatus = targetStatus;
    }

    if (isVisited !== undefined) {
      matchConditions.isVisited =
        isVisited === "true" || isVisited === true;
    }

    console.log("MATCH =>", matchConditions);


    const response = await Application.aggregate([
      { $match: matchConditions },
        
      // ✅ Decide which ID to lookup
      {
        $addFields: {
          effectiveApplicantId: {
            $cond: [
              {
                $and: [
                  { $eq: ["$appliedByType", "employer"] },
                  { $ne: ["$appliedForCompany", null] }
                ]
              },
              "$appliedForCompany", // employer applying for company
              "$applicant"          // all others
            ]
          }
        }
      },
    
      // ---------- LOOKUPS ----------
    
      {
        $lookup: {
          from: "companyprofiles",
          localField: "effectiveApplicantId",
          foreignField: "_id",
          as: "companyApplicant"
        }
      },
    
      {
        $lookup: {
          from: "collegeonboardings",
          localField: "effectiveApplicantId",
          foreignField: "_id",
          as: "collegeApplicant"
        }
      },
    
      {
        $lookup: {
          from: "onboardings", // fresher / student
          localField: "effectiveApplicantId",
          foreignField: "_id",
          as: "studentApplicant"
        }
      },
    
      {
        $lookup: {
          from: "employerprofiles",
          localField: "effectiveApplicantId",
          foreignField: "_id",
          as: "employerApplicant"
        }
      },
    
      // ---------- FINAL APPLICANT SELECTOR ----------
    
      {
        $addFields: {
          applicant: {
            $cond: [
              // ⭐ Employer applying FOR COMPANY
              {
                $and: [
                  { $eq: ["$appliedByType", "employer"] },
                  { $ne: ["$appliedForCompany", null] }
                ]
              },
              { $arrayElemAt: ["$companyApplicant", 0] },
            
              // ⭐ Otherwise choose based on applicantType
              {
                $switch: {
                  branches: [
                    {
                      case: { $eq: ["$applicantType", "company"] },
                      then: { $arrayElemAt: ["$companyApplicant", 0] }
                    },
                    {
                      case: { $eq: ["$applicantType", "college"] },
                      then: { $arrayElemAt: ["$collegeApplicant", 0] }
                    },
                    {
                      case: { $eq: ["$applicantType", "employer"] },
                      then: { $arrayElemAt: ["$employerApplicant", 0] }
                    },
                    {
                      case: {
                        $in: ["$applicantType", ["student", "fresher", "professional"]]
                      },
                      then: { $arrayElemAt: ["$studentApplicant", 0] }
                    }
                  ],
                  default: null
                }
              }
            ]
          }
        }
      },
    
      {
        $project: {
          applicant: 1,
          applicantType: 1,
          statusHistory: 1,
          currentStatus: 1,
          createdAt: 1,
          isVisited: 1
        }
      }
    ]);



    // 👁️ mark visited only for new fetch
    if (isVisited === "false" || isVisited === false) {
      const idsToMarkVisited = response
        .filter((doc) => doc.isVisited === false)
        .map((doc) => doc._id);

      if (idsToMarkVisited.length) {
        await Application.updateMany(
          { _id: { $in: idsToMarkVisited } },
          { $set: { isVisited: true } }
        );
      }
    }

    return { success: true, data: response };
  } catch (error) {
    console.error("fetchCollegeApplicationsByJobService error:", error);
    throw error;
  }
}


// 🔥 NEW — used ONLY by college controller
export async function fetchCollegeSideApplicationsByJobService(
  jobId,
  jobType,
  targetStatus,
  isVisited
) {
  const matchConditions = {
    job: new mongoose.Types.ObjectId(jobId),
    jobType,
    currentStatus: targetStatus,
  };

  // College logic is SIMPLE
  if (isVisited === "false" || isVisited === false) {
    matchConditions.isVisited = false; // New
  }

  if (isVisited === "true" || isVisited === true) {
    matchConditions.isVisited = true; // Past
  }

  const response = await Application.aggregate([
    { $match: matchConditions },
    {
      $lookup: {
        from: "companyprofiles",
        localField: "applicant",
        foreignField: "_id",
        as: "applicant",
      },
    },
    {
      $unwind: {
        path: "$applicant",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        applicant: 1,
        statusHistory: 1,
        currentStatus: 1,
        createdAt: 1,
        isVisited: 1,
      },
    },
  ]);

  // Mark visited ONLY for new applications
  if (isVisited === "false" || isVisited === false) {
    await Application.updateMany(
      { _id: { $in: response.map(r => r._id) } },
      { $set: { isVisited: true } }
    );
  }

  return { success: true, data: response };
}



// count applications
export async function countApplicationsService(jobId, jobType, targetStatus) {
    try {
        const response = await Application.countDocuments({ job: jobId, jobType: jobType, currentStatus: targetStatus, isVisited: false });
        return { success: true, count: response };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed");
    }
}

// shortlist application
export async function ChangeStatusService(applicationId, newStatus) {
    try {
        const existing = await Application.findById(applicationId);
        // console.log("existing response: ", existing);
        if (existing?.currentStatus === newStatus) {
            return { success: false, msg: `Already ${newStatus}` };
        }
        else if (existing?.currentStatus === "Applied" || existing?.currentStatus === "Shortlisted" || existing?.currentStatus === "Accepted") {
            existing.currentStatus = newStatus;
            existing.isVisited = false;
            existing.statusHistory.push({ status: newStatus });
            await existing.save();
            return { success: true, msg: `status changed to: ${newStatus}`, data: existing };
        }
        else {
            return { success: false, msg: "Error" };
        }
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed");
    }
}

export async function fetchCompanyDashboardMetrics(user) {
    try {
        const userId = user._id;
        const userType = user?.userType;

        let companyProfileId;
        let collegeProfileId;

        // --- COMPANY USER ---
        if (userType === 'company') {
            const company = await getCompanyService(userId);

            if (!company || !company.success || company.data.length === 0) {
                throw new AppError("Company profile not found!", 404);
            }

            companyProfileId = company.data[0]._id;
        }

        // --- EMPLOYER USER ---
        else if (userType === 'employer') {
            const employer = await getEmployerService(user); // Pass the full user object

            if (!employer || !employer.success || employer.data.length === 0) {
                throw new AppError(employer.msg || "Employer profile not found!", 404);
            }

            companyProfileId = employer.data[0]._id;
        }
        // --- COLLEGE USER ---
        else if (userType === 'college') {
            const college = await getCollegeService(userId);

            if (!college || !college.success || college.data.length === 0) {
                throw new AppError(college.msg || "College profile not found!", 404);
            }

            collegeProfileId = college.data[0]._id;
        } else {
            throw new AppError("This user type cannot access this resource.", 403);
        }

        let query = {};
        if (userType === 'college') {
            query = { collegePosted: collegeProfileId };
        } else {
            query = { companyPosted: companyProfileId };
        }

        // Fetch all jobs posted by this company/college
        const companyJobs = await JobPostingTable.find(query).select('_id jobType');

        const allJobIds = companyJobs.map(job => job._id);

        if (allJobIds.length === 0) {
            return {
                appliedByCategory: { 'On-campus': 0, 'Pool-campus': 0, 'Off-campus': 0 },
                statusTotals: { 'Shortlisted': 0, 'Accepted': 0, 'Rejected': 0 },
                totalApplied: 0,
                totalShortlisted: 0,
                totalAccepted: 0,
                totalRejected: 0,
                // Add these for dashboard display
                shortlistedByCategory: { 'On-campus': 0, 'Pool-campus': 0, 'Off-campus': 0 },
                acceptedByCategory: { 'On-campus': 0, 'Pool-campus': 0, 'Off-campus': 0 },
                rejectedByCategory: { 'On-campus': 0, 'Pool-campus': 0, 'Off-campus': 0 }
            };
        }

        // ===== FIX 1: Count ALL applications (not just 'Applied') =====
        // Count by job type (ALL applications regardless of status)
        const allApplicationsByType = await Application.aggregate([
            {
                $match: {
                    job: { $in: allJobIds }
                    // REMOVED: currentStatus: 'Applied' - This was the bug!
                }
            },
            {
                $lookup: {
                    from: 'jobpostingtables', // Ensure correct collection name
                    localField: 'job',
                    foreignField: '_id',
                    as: 'jobDetails'
                }
            },
            { $unwind: '$jobDetails' },
            {
                $group: {
                    _id: '$jobDetails.jobType',
                    count: { $sum: 1 }
                }
            }
        ]);

        // ===== FIX 2: Also get counts by status AND type for dashboard table =====
        const applicationsByStatusAndType = await Application.aggregate([
            {
                $match: {
                    job: { $in: allJobIds }
                }
            },
            {
                $lookup: {
                    from: 'jobpostingtables',
                    localField: 'job',
                    foreignField: '_id',
                    as: 'jobDetails'
                }
            },
            { $unwind: '$jobDetails' },
            {
                $group: {
                    _id: {
                        status: '$currentStatus',
                        jobType: '$jobDetails.jobType'
                    },
                    count: { $sum: 1 }
                }
            }
        ]);

        // ===== FIX 3: Count by status (same as before) =====
        const statusCounts = await Application.aggregate([
            {
                $match: {
                    job: { $in: allJobIds },
                    currentStatus: { $in: ['Shortlisted', 'Accepted', 'Rejected'] }
                }
            },
            {
                $group: {
                    _id: '$currentStatus',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Format applied counts
        const formattedAppliedCounts = {
            'On-campus': 0,
            'Pool-campus': 0,
            'Off-campus': 0
        };

        allApplicationsByType.forEach(item => {
            if (formattedAppliedCounts[item._id] !== undefined) {
                formattedAppliedCounts[item._id] = item.count;
            }
        });

        // Format counts by status and type for dashboard table
        const formattedCountsByStatusAndType = {
            'On-campus': { 'Shortlisted': 0, 'Accepted': 0, 'Rejected': 0 },
            'Pool-campus': { 'Shortlisted': 0, 'Accepted': 0, 'Rejected': 0 },
            'Off-campus': { 'Shortlisted': 0, 'Accepted': 0, 'Rejected': 0 }
        };

        applicationsByStatusAndType.forEach(item => {
            const jobType = item._id.jobType;
            const status = item._id.status;
            
            if (formattedCountsByStatusAndType[jobType] && 
                formattedCountsByStatusAndType[jobType][status] !== undefined) {
                formattedCountsByStatusAndType[jobType][status] = item.count;
            }
        });

        // Format status counts
        const formattedStatusCounts = {
            'Shortlisted': 0,
            'Accepted': 0,
            'Rejected': 0
        };

        statusCounts.forEach(item => {
            if (formattedStatusCounts[item._id] !== undefined) {
                formattedStatusCounts[item._id] = item.count;
            }
        });

        // Calculate total applied (sum of all applications)
        const totalApplied = Object.values(formattedAppliedCounts).reduce((sum, count) => sum + count, 0);

        // For debugging
        

        return {
            appliedByCategory: formattedAppliedCounts,
            shortlistedByCategory: {
                'On-campus': formattedCountsByStatusAndType['On-campus']['Shortlisted'],
                'Pool-campus': formattedCountsByStatusAndType['Pool-campus']['Shortlisted'],
                'Off-campus': formattedCountsByStatusAndType['Off-campus']['Shortlisted']
            },
            acceptedByCategory: {
                'On-campus': formattedCountsByStatusAndType['On-campus']['Accepted'],
                'Pool-campus': formattedCountsByStatusAndType['Pool-campus']['Accepted'],
                'Off-campus': formattedCountsByStatusAndType['Off-campus']['Accepted']
            },
            rejectedByCategory: {
                'On-campus': formattedCountsByStatusAndType['On-campus']['Rejected'],
                'Pool-campus': formattedCountsByStatusAndType['Pool-campus']['Rejected'],
                'Off-campus': formattedCountsByStatusAndType['Off-campus']['Rejected']
            },
            statusTotals: formattedStatusCounts,
            totalApplied: totalApplied,
            totalShortlisted: formattedStatusCounts.Shortlisted,
            totalAccepted: formattedStatusCounts.Accepted,
            totalRejected: formattedStatusCounts.Rejected
        };

    } catch (error) {
        console.error('❌ Error in fetchCompanyDashboardMetrics:', error);
        throw new AppError(error.message || 'Failed to fetch dashboard metrics', 500);
    }
}

// candidate
// export async function fetchOffcampusApplicationService(userId) {
//     try {

//         const applicationData = await OffCampusApplication.aggregate([
//             {
//                 $match: {
//                     user: new mongoose.Types.ObjectId(userId)
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'hiringdrives',
//                     localField: 'job',
//                     foreignField: '_id',
//                     as: 'jobDetails'
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'companyprofiles',
//                     localField: 'jobDetails.companyId',
//                     foreignField: '_id',
//                     as: 'companyDetails'
//                 }
//             },
//             {
//                 $project: {
//                     job: 1,
//                     statusHistory: 1,
//                     currentStatus: 1,
//                     createdAt: 1,
//                     "jobDetails.jobRoles": 1,
//                     "jobDetails._id": 1,
//                     "jobDetails.description": 1,
//                     "jobDetails.workLocations": 1,
//                     "jobDetails.workModes": 1,
//                     "jobDetails.yearsOfExperience": 1,
//                     "companyDetails.companyDetails": 1,
//                 }
//             }
//             // {
//             //     $unwind: '$jobDetails'
//             // }
//         ]);

//         // const applicationData = await OffCampusApplication.find({ user: userId })
//         //     .populate('job')
//         //     .populate('$job.companyId')
//         //     .lean();

//         return { success: true, data: applicationData };
//     } catch (error) {
//         console.log("Error: ", error.message);
//         throw new Error("Failed to fetch");
//     }
// }
// export async function fetchJoblistingApplicationService(userId) {
//     try {

//         const applicationData = await JobListingApplication.aggregate([
//             {
//                 $match: {
//                     user: new mongoose.Types.ObjectId(userId)
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'jobpostings',
//                     localField: 'job',
//                     foreignField: '_id',
//                     as: 'jobDetails'
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'companyprofiles',
//                     localField: 'jobDetails.companyId',
//                     foreignField: '_id',
//                     as: 'companyDetails'
//                 }
//             },
//             {
//                 $project: {
//                     job: 1,
//                     statusHistory: 1,
//                     currentStatus: 1,
//                     createdAt: 1,
//                     "jobDetails.jobTitle": 1,
//                     "jobDetails._id": 1,
//                     "jobDetails.jobDescription": 1,
//                     "jobDetails.preferredHiringLocation": 1,
//                     // "jobDetails.workModes": 1,
//                     "jobDetails.yearsOfExperience": 1,
//                     "companyDetails.companyDetails": 1,
//                 }
//             }
//             // {
//             //     $unwind: '$jobDetails'
//             // }
//         ]);

//         return { success: true, data: applicationData };
//     } catch (error) {
//         console.log("Error: ", error.message);
//         throw new Error("Failed to fetch");
//     }
// }
// export async function fetchInternshipApplicationService(userId) {
//     try {

//         const applicationData = await InternshipApplication.aggregate([
//             {
//                 $match: {
//                     user: new mongoose.Types.ObjectId(userId)
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'intern',
//                     localField: 'job',
//                     foreignField: '_id',
//                     as: 'jobDetails'
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'companyprofiles',
//                     localField: 'jobDetails.companyId',
//                     foreignField: '_id',
//                     as: 'companyDetails'
//                 }
//             },
//             // {
//             //     $project: {
//             //         job: 1,
//             //         statusHistory: 1,
//             //         currentStatus: 1,
//             //         createdAt: 1,
//             //         "jobDetails.jobTitle": 1,
//             //         "jobDetails._id": 1,
//             //         "jobDetails.jobDescription": 1,
//             //         "jobDetails.preferredHiringLocation": 1,
//             //         // "jobDetails.workModes": 1,
//             //         "jobDetails.yearsOfExperience": 1,
//             //         "companyDetails.companyDetails": 1,
//             //     }
//             // }
//             // {
//             //     $unwind: '$jobDetails'
//             // }
//         ]);

//         return { success: true, data: applicationData };
//     } catch (error) {
//         console.log("Error: ", error.message);
//         throw new Error("Failed to fetch");
//     }
// }

// export async function createJobListingApplicationService(userId, jobId) {
//     try {
//         const newApplication = new JobListingApplication({
//             user: userId,
//             job: jobId,
//             statusHistory: [{ status: "Applied" }],
//             currentStatus: "Applied"
//         });
//         await newApplication.save();
//         return { success: true, message: 'Application submited!' };
//     } catch (error) {
//         console.log("Error: ", error.message);
//         throw new Error("Failed to Save");
//     }
// }

// export async function fetchShortlistedCandidatesService(jobId) { //offcampus jobs
//     try {
//         const response = await OffCampusApplication.find({ job: jobId, currentStatus: 'Shortlisted' })
//             .populate({
//                 path: 'user',
//                 // select: "name collegeName cgpa resumeUrl"
//             })
//             .populate({
//                 path: 'job',
//                 // select: "title"
//             })
//             .lean();
//         return { success: true, data: response };
//     } catch (error) {
//         console.log("Error: ", error.message);
//         throw new Error("Failed to fetch");
//     }
// }

// getshorlisted candidate by company
export async function fetchCandidatesbyStatus(companyId, targetStatus, applicantType, jobType, posterField = "companyPosted") {
    // console.log("type: ", companyId, targetStatus, applicantType, jobType);
    try {
        // determine which collection to lookup based on applicantType
        let fromCollection, projectApplicant;

        if (applicantType === "user") {
            fromCollection = "onboardings";
            projectApplicant = {
                cgpa: "$applicantDetails.cgpa",
                college: "$applicantDetails.college",
                name: "$applicantDetails.name",
                userId: "$applicantDetails.userId"
            };
        } else if (applicantType === "college") {
            fromCollection = "collegeonboardings";
            projectApplicant = {
                college: "$applicantDetails.collegeUniversityDetails"
            };
        }
        else if (applicantType == "company" || applicantType == 'employer') {
            fromCollection = "CompanyProfile";
            projectApplicant = {
                company: "$applicantDetails.companyDetails"
            }
        }
        else {
            throw new Error(`Unsupported applicantType: ${applicantType}`);
        }

        const candidates = await Application.aggregate([
            // Lookup job details
            {
                $lookup: {
                    from: "jobpostingtables",
                    localField: "job",
                    foreignField: "_id",
                    as: "jobDetails"
                }
            },
            {
                $match: {
                    [
                        `jobDetails.${posterField}`
                    ]: new mongoose.Types.ObjectId(companyId),
                    currentStatus: targetStatus,
                    // applicantType: applicantType,
                    jobType: jobType
                }
            },
            // left-outer join applicant details based on type
            {
                $lookup: {
                    from: fromCollection,
                    localField: "applicant",
                    foreignField: "_id",
                    as: "applicantDetails"
                }
            },
            {
                $unwind: {
                    path: "$applicantDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    currentStatus: 1,
                    statusHistory: 1,
                    jobTitle: "$jobDetails.jobRoles",
                    applicant: projectApplicant
                }
            }
        ]);

        return { success: true, response: candidates };
    } catch (error) {
        console.log("Error in fetchCandidatesbyStatus:", error.message);
        throw new Error("Failed to fetch");
    }
}

// // export async function getAcceptedOnCampusService(companyId) {
// //     try {

// //         const response = await Job.find({ companyPosted: companyId, openingFor: "Oncampus" }, { _id: 1 }).lean();

// //         let acceptedCandidates = [];
// //         for (let i = 0; i < response.length; i++) {
// //             const candidateData = await fetchAcceptedCandidatesService(response[i]._id);
// //             if (candidateData.data.length > 0) acceptedCandidates.push(candidateData);
// //         }

// //         // const result = await Application.aggregate([
// //         //     {
// //         //         $match: {
// //         //             job: mongoose.Types.ObjectId(jobId),
// //         //             currentStatus: "Offer Extended"
// //         //         }
// //         //     },
// //         // {
// //         //     $lookup: {
// //         //         from: "jobs",
// //         //         localField: "job",
// //         //         foreignField: "_id",
// //         //         as: "jobDetails"
// //         //     }
// //         // },
// //         // {
// //         //     $unwind: "$jobDetails"
// //         // },
// //         // {
// //         //     $match: {
// //         //         "jobDetails.jobType": "Oncampus"
// //         //     }
// //         // },
// //         // {
// //         //     $lookup: {
// //         //         from: "StudentOverview",
// //         //         localField: "user",
// //         //         foreignField: "_id",
// //         //         as: "userDetails"
// //         //     }
// //         // },
// //         // {
// //         //     $unwind: "$userDetails"
// //         // }
// //         // ]);

// //         return { success: true, data: acceptedCandidates };
// //     } catch (error) {
// //         console.log("Error: ", error.message);
// //         throw new Error("Failed to fetch");
// //     }
// // }

// // by company - same for getall, shortlisted, accepted candidates
// export async function getOffCampusApplicantsService(query) {
//     try {
//         const response = await OffCampusApplication.find(query)
//             .populate('user')
//             .lean();
//         return { success: true, data: response };
//     } catch (error) {
//         console.log("Error: ", error.message);
//         throw new Error("Failed to fetch");
//     }
// }

// // internship
// export async function checkInternshipExitence(jobId, userId) {
//     try {
//         const response = await InternshipApplication.find({ user: userId, job: jobId });
//         // console.log("res: ", response);
//         if (response?.length > 0) return true;
//     } catch (error) {
//         console.log("Error: ", error.message);
//         throw new Error("Failed to fetch");
//     }
//     return false;
// }

// // by company - same for getall, shortlisted, accepted candidates
// export async function getInternshipApplicantsService(query) {
//     try {
//         const response = await InternshipApplication.find(query)
//             .populate()
//             .lean();
//         return { success: true, data: response };
//     } catch (error) {
//         console.log("Error: ", error.message);
//         throw new Error("Failed to Save");
//     }
// }

// export async function createInternshipApplicationService(userId, jobId) {

//     try {
//         const newApplication = new InternshipApplication({
//             user: userId,
//             job: jobId,
//             statusHistory: [{ status: "Applied" }],
//             currentStatus: "Applied"
//         });
//         await newApplication.save();
//         return { success: true, message: 'Application submited!' };
//     } catch (error) {
//         console.log("Error: ", error.message);
//         throw new Error("Failed to Save");
//     }
// }

// export async function checkPoolCampusApplicationExitence(collegeId, jobId) {
//     try {
//         const response = await PoolCampusApplication.find({ college: collegeId, drive: jobId });
//         // console.log("res: ", response);
//         console.log(response.length);
//         if (response?.length > 0) return true;
//     } catch (error) {
//         console.log("Error: ", error.message);
//         throw new Error("Failed to fetch");
//     }
//     return false;
// }

// export async function poolcampusApplicationService(collegeId, jobId) {
//     try {
//         const newApplication = new PoolCampusApplication({
//             college: collegeId,
//             drive: jobId,
//             statusHistory: [{ status: "Applied" }],
//             currentStatus: "Applied"
//         });
//         await newApplication.save();
//         return { success: true, message: 'Application submited!' };
//     } catch (error) {
//         console.log("Error: ", error.message);
//         throw new Error("Failed to Save");
//     }
// }

// export async function checkOnCampusApplicationExitence(collegeId, jobId) {
//     try {
//         const response = await OnCampusApplication.find({ college: collegeId, drive: jobId });
//         // console.log("res: ", response);
//         console.log(response.length);
//         if (response?.length > 0) return true;
//     } catch (error) {
//         console.log("Error: ", error.message);
//         throw new Error("Failed to fetch");
//     }
//     return false;
// }

// export async function oncampusApplicationService(collegeId, jobId) {
//     try {
//         const newApplication = new OnCampusApplication({
//             college: collegeId,
//             drive: jobId,
//             statusHistory: [{ status: "Applied" }],
//             currentStatus: "Applied"
//         });
//         await newApplication.save();
//         return { success: true, message: 'Application submited!' };
//     } catch (error) {
//         console.log("Error: ", error.message);
//         throw new Error("Failed to Save");
//     }
// }

// export async function getOncampusApplicantsService(query) {
//     try {
//         const response = await OnCampusApplication.find(query)
//             .populate('drive')
//             .lean();
//         return { success: true, data: response };
//     } catch (error) {
//         console.log("Error: ", error.message);
//         throw new Error("Failed to Save");
//     }
// }