import mongoose from "mongoose";
import { getAlumniByCompanyForCandidate } from "../services/alumniService.js";
import Onboarding from "../models/studentonboardingModel.js";
import DiscoveredCompany from "../models/DiscoveredCompany.js";
import {
  extractCompanyNameFromCareerUrl,
  validateCareerPageUrl,
} from "../utils/jobTextUtils.js";
import { paginatedResponse } from "../utils/paginate.js";
import Application from "../models/applicationModel.js";
import { JobPostingTable } from "../models/jobPostingsModel.js";
import { getStudentService } from "../services/studentService.js";
import { logNormalization } from "../services/normalizationLogService.js";
import { resolveCompany } from "../services/normalizationService.js";
import { normalizeText } from "../utils/normalizeText.js";
import {
  notifyAlumniOnNewReferralRequest,
  notifySenderOnReferralRequestStatusChange,
} from "../services/notificationService.js";

export const addCompanyWithCareer = async (req, res) => {
  try {
    const senderUserId = req.user?._id || req.user?.id;
    const rawCareerPageUrl = String(req.body.careerPageUrl || "").trim();

    if (!senderUserId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Sender user ID not found.",
      });
    }

    if (!rawCareerPageUrl) {
      return res.status(400).json({
        success: false,
        message: "careerPageUrl is required.",
      });
    }

    const urlValidation = await validateCareerPageUrl(rawCareerPageUrl);

    if (!urlValidation.valid) {
      return res.status(400).json({
        success: false,
        message: urlValidation.message,
      });
    }

    const careerPageUrl = urlValidation.normalizedUrl;

    const companyName = extractCompanyNameFromCareerUrl(careerPageUrl);

    if (!companyName) {
      return res.status(400).json({
        success: false,
        message: "Invalid career page URL. Company name not found.",
      });
    }

    const companyResult = await resolveCompany(companyName);
    const canonicalCompanyId = companyResult?.canonicalId;

    if (!canonicalCompanyId) {
      await logNormalization({
        entityType: "company",
        rawInput: companyName,
        normalizedInput: normalizeText(companyName),
        canonicalId: null,
        displayName: null,
        confidence: null,
        matchType: "unmatched",
      });

      return res.status(404).json({
        success: false,
        message: "No alumni found. Company has been submitted for review.",
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
      canonicalCompanyId,
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

    const referralJobs = [];
    const applications = [];

    for (const alumni of alumniList) {
      const receiverUserId = alumni?.userId;

      if (!receiverUserId) continue;
      if (String(receiverUserId) === String(senderUserId)) continue;

      const receiverStudentProfile = await getStudentService(receiverUserId);

      if (!receiverStudentProfile?.data?.length) {
        console.warn(
          `Professional profile not found for user: ${receiverUserId}`,
        );
        continue;
      }

      let referralJob = await JobPostingTable.findOne({
        referralRequestId: new mongoose.Types.ObjectId(senderUserId),
        postedByUser: new mongoose.Types.ObjectId(receiverUserId),
        careerPageUrl,
        isAskForReferral: true,
        jobType: "Referral",
      });

      const isNewReferralJob = !referralJob;

      if (!referralJob) {
        referralJob = await JobPostingTable.create({
          candidatePosted: receiverStudentProfile.data[0]._id,
          postedByUser: receiverUserId,

          jobType: "Referral",
          approvalStatus: "Approved",

          visibleTo: "All",
          broadcastType: "Everyone",

          companyName,
          careerPageUrl,

          senderProfile,
          receiverProfile: alumni,

          location: ["None"],
          jobTitle: [`Referral request for ${companyName}`],
          jobCategory: "Referral",

          description: `Referral request for ${companyName}. Career page URL: ${careerPageUrl}`,

          lookingFor: "Job",

          referralRequestId: senderUserId,

          status: "Applied",
          isAskForReferral: true,
          inactive: false,
        });
      }

      referralJobs.push(referralJob);

      let application = await Application.findOne({
        applicant: senderProfile._id,
        job: referralJob._id,
        jobType: "Referral",
        isAskForReferral: true,
      });

      if (!application) {
        application = await Application.create({
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
      }

      const populatedApplication = await Application.findById(application._id)
        .populate({
          path: "job",
          select:
            "companyName careerPageUrl jobTitle description status isAskForReferral senderProfile receiverProfile",
        })
        .lean();

      applications.push(populatedApplication);

      if (isNewReferralJob) {
        notifyAlumniOnNewReferralRequest({
          alumniAuthId: receiverUserId,
          senderUserId,
          senderName: senderProfile?.name || "Someone",
          companyName,
          requestId: referralJob._id,
          applicationId: application._id,
        }).catch((err) =>
          console.error("Referral notification failed:", err.message),
        );
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
        totalReferralJobsCreated: referralJobs.length,
        totalApplicationsCreated: applications.length,
        alumni: alumniList,
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
      postedByUser: new mongoose.Types.ObjectId(receiverUserId),
      isAskForReferral: true,
      jobType: "Referral",
      inactive: false,
    };

    const total = await JobPostingTable.countDocuments(filter);

    const requests = await JobPostingTable.find(filter)
      .select(
        "referralRequestId postedByUser companyName careerPageUrl senderProfile receiverProfile jobTitle description status isAskForReferral createdAt updatedAt",
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

export const updateCareerPageRequestStatus = async (req, res) => {
  try {
    const receiverUserId = req.user?._id || req.user?.id;
    console.log(receiverUserId);
    const { requestId } = req.params;
    console.log(requestId);
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

    const request = await JobPostingTable.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(requestId),
        postedByUser: new mongoose.Types.ObjectId(receiverUserId),
        isAskForReferral: true,
        jobType: "Referral",
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

    console.log(request);

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
        jobType: "Referral",
        isAskForReferral: true,
      },
      {
        $set: {
          currentStatus: applicationStatus,
        },
        $push: {
          statusHistory: {
            status: applicationStatus,
            date: new Date(),
          },
        },
      },
      {
        new: true,
      },
    );

    notifySenderOnReferralRequestStatusChange({
      senderAuthId: request.referralRequestId,
      receiverAuthId: receiverUserId,
      status,
      requestId: request._id,
      companyName: request.companyName,
    }).catch((err) =>
      console.error("Referral status notification failed:", err.message),
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
      referralRequestId: new mongoose.Types.ObjectId(senderUserId),
      isAskForReferral: true,
      jobType: "Referral",
      inactive: false,
    };

    const total = await JobPostingTable.countDocuments(filter);

    const requests = await JobPostingTable.find(filter)
      .select(
        "referralRequestId postedByUser companyName careerPageUrl senderProfile receiverProfile jobTitle description status isAskForReferral createdAt updatedAt",
      )
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
