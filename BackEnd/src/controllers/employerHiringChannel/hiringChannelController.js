
import Auth from '../../models/authModel.js';
import CompanyProfile from '../../models/companyDashboard/companyProfileModel.js';
import { createPostingService } from '../../services/jobPostingService.js';
import { getCompanyService } from "../../services/companyService.js";
import { notifyCollegesOnOnCampusJob } from '../../services/notificationService.js';

// Helper fuction to consistent response handling
const sendResponse = (res, statusCode, data) => res.status(statusCode).json(data);
const sendError = (res, statusCode, message) => res.status(statusCode).json({ message });

// Helper Function to determine which compny ID to use for a job opsting

const getCompanyIdToPostAs = async (userId) => {
    try {

        if (!userId) {
            return { error: 'Authentication required.' };
        }

        const user = await Auth.findById(userId);
        if (!user) {
            return { error: 'User not found.' };
        }
        let companyIdToUse;
        if (user.activeCompanyId) {
            const activeCompanyExists = await CompanyProfile.findById(user.activeCompanyId);
            if (!activeCompanyExists) {
                return { error: 'The selected active company profile no longer exists.' };
            }
            companyIdToUse = user.activeCompanyId;
        } else {
            const ownProfile = await getCompanyService(userId);
            if (!ownProfile) {
                return { error: 'You must create a company profile before you can post a job.' };
            }
            companyIdToUse = ownProfile.data[0]._id;
        }
        return { companyId: companyIdToUse, error: null };
    }
    catch (error) {
        console.error("Error in getCompanyIdToPostAs:", error);
        return { error: 'Server error while determininig companyProfile' };
    }
}

// Controller to  create an JOBS 

export const createJobPosting = async (req, res) => {
    try {
        const userId = req.user.id;
        const { companyId, error } = await getCompanyIdToPostAs(userId);

        if (error) {
            return sendError(res, 400, error);
        }

        const postingData = {
            ...req.body,
            companyPosted: companyId,
            jobType: "Job-listing",
        };

        const newPosting = await createPostingService(postingData, userId);
        if (!newPosting) {
            return sendError(res, 500, "Failed to create job posting");
        }

        sendResponse(res, 201, { message: "Job posting created successfully!", data: newPosting });
    } catch (error) {
        console.error("Error in createJobPosting:", error.message);
        sendError(res, 500, "Internal server error");
    }
};


export const createOffCampusJobPosting = async (req, res) => {
    try {
        const userId = req.user.id;
        const { companyId, error } = await getCompanyIdToPostAs(userId);

        if (error) {
            return sendError(res, 400, error);
        }

        const postingData = {
            ...req.body,
            companyPosted: companyId,
            jobType: "Off-campus",
        };

        const newPosting = await createPostingService(postingData , userId);
        if (!newPosting) {
            return sendError(res, 500, "Failed to create off-campus posting");
        }

        sendResponse(res, 201, { message: "Off-campus posting created successfully!", data: newPosting });
    } catch (error) {
        console.error("Error in createOffCampusJobPosting:", error.message);
        sendError(res, 500, "Internal server error");
    }
};

{/*export const createOnCampusPosting = async (req, res) => {
    try {
        const userId = req.user.id;
        const { companyId, error } = await getCompanyIdToPostAs(userId);

        if (error) {
            return sendError(res, 400, error);
        }

        

        const postingData = {
            ...req.body,
            companyPosted: companyId,
            jobType: "On-campus",
            visibleTo: "College",
            
        };

        const newPosting = await createPostingService(postingData, userId);
        if (!newPosting) {
            return sendError(res, 500, "Failed to create on-campus posting");
        }

       

    sendResponse(res, 201, {
      message: "On-campus posting created successfully!",
      data: newPosting
    });
    } catch (error) {
        console.error("Error in createOnCampusPosting:", error.message);
        sendError(res, 500, "Internal server error");
    }
};*/}

//Prathmesh
export const createOnCampusPosting = async (req, res) => {
  try {
    const userId = req.user.id;

    // ✅ KEEP EXISTING LOGIC
    const { companyId, error } = await getCompanyIdToPostAs(userId);
    if (error) {
      return sendError(res, 400, error);
    }

    // 🔹 Fetch company name USING companyId returned by service
    let companyName = "Company";

    const companyProfile = await CompanyProfile.findById(companyId)
      .select("companyDetails.companyName");

    if (companyProfile?.companyDetails?.companyName) {
      companyName = companyProfile.companyDetails.companyName;
    }

    const postingData = {
      ...req.body,
      companyPosted: companyId,
      jobType: "On-campus",
      visibleTo: "College"
    };

    const newPosting = await createPostingService(postingData, userId);
    if (!newPosting) {
      return sendError(res, 500, "Failed to create on-campus posting");
    }

    // 🔔 ADD NOTIFICATION (NO STRUCTURE CHANGE)
    notifyCollegesOnOnCampusJob({
      companyId: userId, // sender = employer user
      companyName,
      jobTitle: newPosting.jobTitle || req.body.jobTitle || "new job",
      jobId: newPosting._id
    }).catch(err => {
      console.error("Employer notification error:", err);
    });

    sendResponse(res, 201, {
      message: "On-campus posting created successfully!",
      data: newPosting
    });

  } catch (error) {
    console.error("Error in createOnCampusPosting:", error);
    sendError(res, 500, "Internal server error");
  }
};

{/*export const createPoolCampusPosting = async (req, res) => {
    try {
        const userId = req.user.id;
        const { companyId, error } = await getCompanyIdToPostAs(userId);

        if (error) {
            return sendError(res, 400, error);
        }

        const postingData = {
            ...req.body,
            companyPosted: companyId,
            jobType: "Pool-campus",
            visibleTo: "College",
        };

        const newPosting = await createPostingService(postingData, userId);
        if (!newPosting) {
            return sendError(res, 500, "Failed to create pool-campus posting");
        }

        sendResponse(res, 201, { message: "Pool-campus posting created successfully!", data: newPosting });
    } catch (error) {
        console.error("Error in createPoolCampusPosting:", error.message);
        sendError(res, 500, "Internal server error");
    }
};*/}

 //prathmesh
export const createPoolCampusPosting = async (req, res) => {
  try {
    const userId = req.user.id;

    // ✅ KEEP EXISTING LOGIC
    const { companyId, error } = await getCompanyIdToPostAs(userId);
    if (error) {
      return sendError(res, 400, error);
    }

    // 🔹 Resolve company name (same pattern as on-campus)
    let companyName = "Company";

    const companyProfile = await CompanyProfile.findById(companyId)
      .select("companyDetails.companyName");

    if (companyProfile?.companyDetails?.companyName) {
      companyName = companyProfile.companyDetails.companyName;
    }

    const postingData = {
      ...req.body,
      companyPosted: companyId,
      jobType: "Pool-campus",
      visibleTo: "College"
    };

    const newPosting = await createPostingService(postingData, userId);
    if (!newPosting) {
      return sendError(res, 500, "Failed to create pool-campus posting");
    }

    // 🔔 NOTIFICATION (REUSED SERVICE)
    notifyCollegesOnOnCampusJob({
      companyId: userId,
      companyName,
      jobTitle: newPosting.jobTitle || req.body.jobTitle || "new job",
      jobId: newPosting._id
    }).catch(err => {
      console.error("Pool-campus notification error:", err);
    });

    sendResponse(res, 201, {
      message: "Pool-campus posting created successfully!",
      data: newPosting
    });

  } catch (error) {
    console.error("Error in createPoolCampusPosting:", error.message);
    sendError(res, 500, "Internal server error");
  }
};

export const createInternshipPosting = async (req, res) => {
    try {
        console.log("Creating internship posting...");
        const userId = req.user.id;
        const { companyId, error } = await getCompanyIdToPostAs(userId);

        if (error) {
            return sendError(res, 400, error);
        }

        const postingData = {
            ...req.body,
            companyPosted: companyId,
            jobType: "Internship",
             packageDetails: {
              currency: req.body.minPackage?.currency,
              totalCTC: req.body.minPackage?.amount, // 👈 map stipend here
              fixedPay: 0,
              joiningBonus: 0
            }
        };

        const newPosting = await createPostingService(postingData, userId);
        if (!newPosting) {
            return sendError(res, 500, "Failed to create internship posting");
        }

        sendResponse(res, 201, { message: "Internship posting created successfully!", data: newPosting });
    } catch (error) {
        console.error("Error in createInternshipPosting:", error.message);
        sendError(res, 500, "Internal server error");
    }
};


