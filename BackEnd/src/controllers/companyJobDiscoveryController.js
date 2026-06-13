import mongoose from "mongoose";
import { getAlumniByCompanyForCandidate } from "../services/alumniService.js";
import Onboarding from "../models/studentonboardingModel.js";
import DiscoveredCompany from "../models/DiscoveredCompany.js";
import CareerPageReferralRequest from "../models/AlumniJobRequest.js";
import { extractCompanyNameFromCareerUrl } from "../utils/jobTextUtils.js";
import { paginatedResponse } from "../utils/paginate.js";
import { notifyOnApplicationStatusChange } from "../services/notificationService.js";

/**
 * POST
 * Candidate sends careerPageUrl.
 * senderUserId comes from token.
 */
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

    const senderProfile = await Onboarding.findOne({
      userId: senderUserId,
    }).lean();

    if (!senderProfile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found. Complete onboarding first.",
      });
    }

    const alumniResult = await getAlumniByCompanyForCandidate({
      userId: senderUserId,
      companyName,
      page: 1,
      limit: 100,
      skip: 0,
    });

    if (!alumniResult.alumFound) {
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

    for (const alumni of alumniResult.data) {
      if (!alumni.userId) continue;

      const request = await CareerPageReferralRequest.findOneAndUpdate(
        {
          senderUserId,
          receiverUserId: alumni.userId,
          careerPageUrl,
        },
        {
          $setOnInsert: {
            senderUserId,
            receiverUserId: alumni.userId,
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
        },
      );

      requests.push(request);

      // await notifyOnApplicationStatusChange({
      //   recipientId: alumni.userId,
      //   senderId: senderUserId,
      //   companyName: "Professional Referral",
      //   status: "Referred To Company",
      //   applicationId: request._id,
      //   jobType: "Referral",
      // });
    }

    return res.status(201).json({
      success: true,
      message: "Career page referral request sent successfully.",
      data: {
        companyName,
        careerPageUrl,
        sourceType: alumniResult.sourceType,
        totalAlumniFound: alumniResult.data.length,
        totalRequestsSent: requests.length,
        alumni: alumniResult.data,
        requests,
      },
    });
  } catch (error) {
    console.error("addCompanyWithCareer error:", error);

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
        message: "Receiver user ID not found.",
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

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be accepted or rejected.",
      });
    }

    const request = await CareerPageReferralRequest.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(requestId),
        receiverUserId: new mongoose.Types.ObjectId(receiverUserId),
      },
      {
        $set: { status },
      },
      {
        new: true,
      },
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Referral request not found or receiverUserId not matched.",
      });
    }

    // await notifyOnApplicationStatusChange({
    //   recipientId: request.senderUserId,
    //   senderId: receiverUserId,
    //   companyName: "Professional Referral",
    //   status: status === "accepted" ? "Accepted" : "Rejected",
    //   applicationId: request._id,
    //   jobType: "Referral",
    // });

    return res.status(200).json({
      success: true,
      message: `Referral request ${status} successfully.`,
      data: request,
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
