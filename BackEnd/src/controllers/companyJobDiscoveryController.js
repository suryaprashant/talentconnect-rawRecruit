import mongoose from "mongoose";
import { getAlumniByCompanyForCandidate } from "../services/alumniService.js";
import Onboarding from "../models/studentonboardingModel.js";
import DiscoveredCompany from "../models/DiscoveredCompany.js";
import CareerPageReferralRequest from "../models/AlumniJobRequest.js";
import { extractCompanyNameFromCareerUrl } from "../utils/jobTextUtils.js";
import { paginatedResponse } from "../utils/paginate.js";
import { notifyOnApplicationStatusChange } from "../services/notificationService.js";
import Application from "../models/applicationModel.js";
import { JobPostingTable } from "../models/jobPostingsModel.js";
import {
  
  getStudentService,
} from "../services/studentService.js";

export const addCompanyWithCareer = async (req, res) => {
  try {
    const senderUserId = req.user?._id || req.user?.id;
    const careerPageUrl = String(req.body.careerPageUrl || "").trim();

    if (!senderUserId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Sender user ID not found.",
      });
    }

    if (!careerPageUrl) {
      return res.status(400).json({
        success: false,
        message: "careerPageUrl is required.",
      });
    }

    const companyName = extractCompanyNameFromCareerUrl(careerPageUrl);
    
    if (!companyName) {
      return res.status(400).json({
        success: false,
        message: "Invalid career page URL. Company name not found.",
      });
    }
    const companyResult =
      await resolveCompany(
        companyName
      );

    const canonicalCompanyId =
      companyResult?.canonicalId;

    if (!canonicalCompanyId) {

      await logNormalization({
        entityType: "company",

        rawInput: companyName,

        normalizedInput:
          normalizeText(
            companyName
          ),

        canonicalId: null,

        displayName: null,

        confidence: null,

        matchType: "unmatched",
      });

      return res.status(404).json({
        success: false,

        message:
          "No alumni found. Company has been submitted for review.",

        companyName,

        pendingReview: true,
      });
    }
    const senderProfile = await Onboarding.findOne({
      userId: senderUserId,
    }).lean();

    if (!senderProfile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found. Complete onboarding first.",
      });
    }

    const applicantType =
      senderProfile.profileType || senderProfile.userType || "fresher";

    const alumniResult = await getAlumniByCompanyForCandidate({
      userId: senderUserId,
      companyName,
      page: 1,
      limit: 100,
      skip: 0,
    });

    const alumniList = alumniResult?.data || [];

    if (!alumniResult?.alumFound || alumniList.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No alumni or current employee found for this company.",
        data: {
          companyName,
          careerPageUrl,
          alumni: [],
        },
      });
    }

    const requests = [];
    const applications = [];
    const referralJobs = [];

    for (const alumni of alumniList) {
      const receiverUserId = alumni?.userId;

      if (!receiverUserId) continue;

      if (String(receiverUserId) === String(senderUserId)) continue;

      const request = await CareerPageReferralRequest.findOneAndUpdate(
        {
          senderUserId,
          receiverUserId,
          careerPageUrl,
        },
        {
          $setOnInsert: {
            senderUserId,
            receiverUserId,
            companyName,
            careerPageUrl,
            senderProfile,
            receiverProfile: alumni,
            status: "pending",
          },
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        },
      );

      requests.push(request);

      let referralJob = await JobPostingTable.findOne({
        referralRequestId: request._id,
        isAskForReferral: true,
      });

      const userProfile = await getStudentService(receiverUserId);
      
      if (!userProfile || !userProfile.data || userProfile.data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Professional profile not found for this account.",
      });
    }

      if (!referralJob) {
        referralJob = await JobPostingTable.create({
          candidatePosted:userProfile.data[0]._id,

          postedByUser: receiverUserId,

          jobType: "Referral",
          approvalStatus: "Approved",

          visibleTo: "All",
          broadcastType: "Everyone",

          location: ["None"],

          jobTitle: [`Referral request for ${companyName}`],
          jobCategory: "Referral",

          description: `Referral request for ${companyName}. Career page URL: ${careerPageUrl}`,

          jobStatus: "Open",
          lookingFor: "Job",

          referralRequestId: request._id,
          careerPageUrl,

          isAskForReferral: true,
          inactive: false,
        });
      }

      referralJobs.push(referralJob);

      const existingApplication = await Application.findOne({
        applicant: senderProfile._id,
        job: referralJob._id,
        jobType: "Referral",
        isAskForReferral: true,
      });

      if (!existingApplication) {
        const application = await Application.create({
          applicant: senderProfile._id,
          applicantType,

          appliedForCompany: null,
          referralCompany: companyName,

          appliedByType: applicantType,
          adminApprovalStatus: "Approved",

          job: referralJob._id,
          jobType: "Referral",
          isAskForReferral: true,

          isVisited: true,

          statusHistory: [
            {
              status: "Applied",
              date: new Date(),
            },
          ],

          currentStatus: "Applied",
          adminComment: "",
          rating: 0,
        });

        applications.push(application);
      }
    }

    return res.status(201).json({
      success: true,
      message: "Career page referral request sent successfully.",
      data: {
        companyName,
        careerPageUrl,
        sourceType: alumniResult?.sourceType,
        totalAlumniFound: alumniList.length,
        totalRequestsSent: requests.length,
        totalReferralJobsCreated: referralJobs.length,
        totalApplicationsCreated: applications.length,
        alumni: alumniList,
        requests,
        referralJobs,
        applications,
      },
    });
  } catch (error) {
    console.error("addCompanyWithCareer error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Referral request already exists for this career page.",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to send career page referral request.",
    });
  }
};

/**
 * GET
 * Alumni gets received requests.
 * receiverUserId comes from token.
 */
export const getReceivedCareerPageRequests = async (req, res) => {
  try {
    const receiverUserId = req.user?._id || req.user?.id;

    if (!receiverUserId) {
      return res.status(401).json({
        success: false,
        message: "Receiver user ID not found.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(receiverUserId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid receiverUserId.",
      });
    }

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 20, 1);
    const skip = (page - 1) * limit;

    const filter = {
      receiverUserId: new mongoose.Types.ObjectId(receiverUserId),
    };

    const total = await CareerPageReferralRequest.countDocuments(filter);

    const requests = await CareerPageReferralRequest.find(filter)
      .select(
        "senderUserId companyName careerPageUrl senderProfile status createdAt updatedAt",
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const result = paginatedResponse(requests, total, { page, limit });

    return res.status(200).json({
      success: true,
      message: "Received career page referral requests fetched successfully.",
      ...result,
    });
  } catch (error) {
    console.error("getReceivedCareerPageRequests error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch received requests.",
    });
  }
};

/**
 * PATCH
 * Alumni accepts/rejects request.
 * receiverUserId comes from token.
 */
export const updateCareerPageRequestStatus = async (req, res) => {
  try {
    const receiverUserId = req.user?._id || req.user?.id;
    const { requestId } = req.params;
    const { status } = req.body;

    if (!receiverUserId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Receiver user ID not found.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(receiverUserId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid receiverUserId.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid requestId.",
      });
    }

    const allowedStatuses = ["accepted", "rejected"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be accepted or rejected.",
      });
    }

    const request = await CareerPageReferralRequest.findOneAndUpdate(
      {
        _id: requestId,
        receiverUserId,
      },
      {
        $set: {
          status,
        },
      },
      {
        new: true,
      },
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message:
          "Referral request not found or you are not allowed to update it.",
      });
    }

    const applicationStatus = status === "accepted" ? "Accepted" : "Rejected";

    const updatedApplication = await Application.findOneAndUpdate(
      {
        job: request._id,
        jobType: "AskForReferral",
      },
      {
        $set: {
          currentStatus: applicationStatus,
        },
        $push: {
          statusHistory: {
            status: applicationStatus,
            changedAt: new Date(),
          },
        },
      },
      {
        new: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: `Referral request ${status} successfully.`,
      data: {
        request,
        application: updatedApplication,
      },
    });
  } catch (error) {
    console.error("updateCareerPageRequestStatus error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update request status.",
    });
  }
};

/**
 * POST
 * Admin adds company career page.
 * adminId comes from token.
 */
export const adminAddCompanyCareerPage = async (req, res) => {
  try {
    const adminId = req.user?._id || req.user?.id;

    const companyName = String(req.body.companyName || "").trim();
    const careerPageUrl = String(
      req.body.careerPageUrl || req.body.careerpageUrl || "",
    ).trim();

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Admin ID not found.",
      });
    }

    if (!companyName || !careerPageUrl) {
      return res.status(400).json({
        success: false,
        message: "companyName and careerPageUrl are required.",
      });
    }

    const existingCompany = await DiscoveredCompany.findOne({
      companyName: new RegExp(`^${companyName}$`, "i"),
    });

    if (existingCompany) {
      return res.status(409).json({
        success: false,
        message: "This company already exists.",
        data: existingCompany,
      });
    }

    const company = await DiscoveredCompany.create({
      companyName,
      careerPageUrl,
      addedBy: adminId,
    });

    return res.status(200).json({
      success: true,
      message: "Company career page added successfully.",
      data: company,
    });
  } catch (error) {
    console.error("adminAddCompanyCareerPage error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This company already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to add company career page.",
    });
  }
};

/**
 * GET
 * Company name comes from URL query.
 */
export const getCareerPageUrlByCompanyName = async (req, res) => {
  try {
    const companyName = String(req.query.companyName || "").trim();

    if (!companyName) {
      return res.status(400).json({
        success: false,
        message: "companyName is required in URL query.",
      });
    }

    const company = await DiscoveredCompany.findOne({
      companyName: new RegExp(`^${companyName}$`, "i"),
    }).lean();

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Career page URL not found for this company.",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Career page URL found successfully.",
      data: {
        companyName: company.companyName,
        careerPageUrl: company.careerPageUrl,
      },
    });
  } catch (error) {
    console.error("getCareerPageUrlByCompanyName error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get career page URL.",
    });
  }
};

/**
 * GET
 * Candidate gets sent requests.
 * senderUserId comes from token.
 */
export const getSentCareerPageRequests = async (req, res) => {
  try {
    const senderUserId = req.user?._id || req.user?.id;

    if (!senderUserId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Sender user ID not found.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(senderUserId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid senderUserId.",
      });
    }

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 20, 1);
    const skip = (page - 1) * limit;

    const filter = {
      senderUserId: new mongoose.Types.ObjectId(senderUserId),
    };

    const total = await CareerPageReferralRequest.countDocuments(filter);

    const requests = await CareerPageReferralRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const result = paginatedResponse(requests, total, { page, limit });

    return res.status(200).json({
      success: true,
      message: "Sent career page referral requests fetched successfully.",
      ...result,
    });
  } catch (error) {
    console.error("getSentCareerPageRequests error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch sent referral requests.",
    });
  }
};
