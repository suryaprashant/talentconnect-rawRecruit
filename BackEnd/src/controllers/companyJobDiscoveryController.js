import mongoose from "mongoose";
import { getAlumniByCompanyForCandidate } from "../services/alumniService.js";
import Onboarding from "../models/studentonboardingModel.js";
import DiscoveredCompany from "../models/DiscoveredCompany.js";
import { validateCareerPageUrl } from "../utils/jobTextUtils.js";
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
import { getAlumniWhoCanHelpService } from "./AlumniJobsController.js";


// export const getAlumniForCareerPageUrl  = async (req, res) => {
//   try {
//     const senderUserId = req.user?._id || req.user?.id;
//     const rawCareerPageUrl = String(req.body.careerPageUrl || "").trim();
//     const companyName = String(req.query.companyName || "").trim();

//     if (!senderUserId) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized. Sender user ID not found.",
//       });
//     }

//     if (!companyName) {
//       return res.status(400).json({
//         success: false,
//         message: "companyName is required.",
//       });
//     }

//     const companyResult = await resolveCompany(companyName);
//     const canonicalCompanyId = companyResult?.canonicalId;

//     if (!canonicalCompanyId) {
//       await logNormalization({
//         entityType: "company",
//         rawInput: companyName,
//         normalizedInput: normalizeText(companyName),
//         canonicalId: null,
//         displayName: null,
//         confidence: null,
//         matchType: "unmatched",
//       });

//       return res.status(404).json({
//         success: false,
//         message: "No alumni found. Company has been submitted for review.",
//         companyName,
//         pendingReview: true,
//       });
//     }

//     const senderProfile = await Onboarding.findOne({
//       userId: senderUserId,
//     }).lean();

//     if (!senderProfile) {
//       return res.status(404).json({
//         success: false,
//         message: "Profile not found. Complete onboarding first.",
//       });
//     }

//     const alumniResult = await getAlumniByCompanyForCandidate({
//       userId: senderUserId,
//       companyName,
//       canonicalCompanyId,
//       page: 1,
//       limit: 100,
//       skip: 0,
//     });

//     let alumniList = alumniResult?.data || [];

//     alumniList = alumniList.filter(
//       (alumni) =>
//         alumni?.userId &&
//         String(alumni.userId) !== String(senderUserId)
//     );

//     if (!alumniResult?.alumFound || alumniList.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No alumni or current employee found for this company.",
//         data: {
//           companyName,
//           alumni: [],
//         },
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Alumni fetched successfully.",
//       data: {
//         companyName,
//         sourceType: alumniResult?.sourceType,
//         totalAlumniFound: alumniList.length,
//         alumni: alumniList,
//       },
//     });
//   } catch (error) {
//     console.error("getAlumniForCompanyName error:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message || "Failed to fetch alumni.",
//     });
//   }
// };

// export const getAlumniForCareerPageUrl = async (req, res) => {
//   try {
//     const senderUserId = req.user?._id || req.user?.id;
//     const rawCareerPageUrl = String(req.body.careerPageUrl || "").trim();

//     if (!senderUserId) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized. Sender user ID not found.",
//       });
//     }

//     if (!rawCareerPageUrl) {
//       return res.status(400).json({
//         success: false,
//         message: "careerPageUrl is required.",
//       });
//     }

//     const urlValidation = await validateCareerPageUrl(rawCareerPageUrl);

//     if (!urlValidation.valid) {
//       return res.status(400).json({
//         success: false,
//         message: urlValidation.message,
//       });
//     }

//     const careerPageUrl = urlValidation.normalizedUrl;
//     const companyName = urlValidation.companyName;

//     if (!companyName) {
//       return res.status(400).json({
//         success: false,
//         message: "Unable to extract company name from this job URL.",
//         data: {
//           careerPageUrl,
//         },
//       });
//     }

//     const companyResult = await resolveCompany(companyName);
//     const canonicalCompanyId = companyResult?.canonicalId;

//     if (!canonicalCompanyId) {
//       // await logNormalization({
//       //   entityType: "company",
//       //   rawInput: companyName,
//       //   normalizedInput: normalizeText(companyName),
//       //   canonicalId: null,
//       //   displayName: null,
//       //   confidence: null,
//       //   matchType: "unmatched",
//       // });

//       return res.status(404).json({
//         success: false,
//         message: `No alumni found for Company ${companyName}.`,
//         companyName,
//         careerPageUrl,
//         pendingReview: true,
//       });
//     }

//     const senderProfile = await Onboarding.findOne({
//       userId: senderUserId,
//     }).lean();

//     if (!senderProfile) {
//       return res.status(404).json({
//         success: false,
//         message: "Profile not found. Complete onboarding first.",
//       });
//     }

//     const alumniResult = await getAlumniByCompanyForCandidate({
//       userId: senderUserId,
//       postedByUser: null,
//       company: companyName,
//       page: 1,
//       limit: 100,
//     });


//     // const alumniResult = await getAlumniWhoCanHelpService({
//     //   userId: senderUserId,
//     //   postedByUser: null,
//     //   company: companyName,
//     //   page: 1,
//     //   limit: 100,
//     // });

//     let alumniList = alumniResult?.data || [];

//     alumniList = alumniList.filter(
//       (alumni) =>
//         alumni?.userId && String(alumni.userId) !== String(senderUserId),
//     );
//     let alumniFound = true;
//     if (alumniList.length === 0) {
//       alumniFound = false;
//       alumniList = await Onboarding.find({
//         currentCompany_canonical_id: canonicalCompanyId,
//       }).lean();

//       alumniList = alumniList.filter(
//         (alumni) =>
//           alumni?.userId && String(alumni.userId) !== String(senderUserId),
//       );
//     }

//     if (alumniList.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No alumni or current employee found for this company.",
//         data: {
//           companyName,
//           careerPageUrl,
//           alumni: [],
//         },
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Alumni fetched successfully.",
//       data: {
//         companyName,
//         careerPageUrl,
//         alumniFound,
//         // sourceType: alumniResult?.sourceType,
//         totalAlumniFound: alumniList.length,
//         alumni: alumniList,
//       },
//     });
//   } catch (error) {
//     console.error("getAlumniForCareerPageUrl error:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message || "Failed to fetch alumni.",
//     });
//   }
// };

export const getAlumniForCareerPageUrl = async (req, res) => {
  try {
    // User authenticated ho sakta hai ya nahi
    const senderUserId = req.user?._id || req.user?.id;

    const rawCareerPageUrl = String(
      req.body.careerPageUrl || "",
    ).trim();

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
    const companyName = urlValidation.companyName;

    if (!companyName) {
      return res.status(400).json({
        success: false,
        message: "Unable to extract company name from this job URL.",
        data: {
          careerPageUrl,
        },
      });
    }

    const companyResult = await resolveCompany(companyName);
    const canonicalCompanyId = companyResult?.canonicalId;

    if (!canonicalCompanyId) {
      return res.status(404).json({
        success: false,
        message: `No alumni found for Company ${companyName}.`,
        companyName,
        careerPageUrl,
        pendingReview: true,
      });
    }

    let alumniList = [];
    let alumniFound = true;

    /*
     * AUTHENTICATED USER
     *
     * Existing flow remains exactly the same.
     */
    if (senderUserId) {
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
        postedByUser: null,
        company: companyName,
        page: 1,
        limit: 100,
      });

      alumniList = alumniResult?.data || [];

      // Don't return the logged-in user himself
      alumniList = alumniList.filter(
        (alumni) =>
          alumni?.userId &&
          String(alumni.userId) !== String(senderUserId),
      );

      /*
       * Existing fallback for authenticated users
       */
      if (alumniList.length === 0) {
        alumniFound = false;

        alumniList = await Onboarding.find({
          currentCompany_canonical_id: canonicalCompanyId,
        }).lean();

        alumniList = alumniList.filter(
          (alumni) =>
            alumni?.userId &&
            String(alumni.userId) !== String(senderUserId),
        );
      }
    }

    /*
     * UNAUTHENTICATED USER
     *
     * No req.user -> directly find alumni/current employees
     * of this company.
     */
    else {
      alumniFound = false;

      alumniList = await Onboarding.find({
        currentCompany_canonical_id: canonicalCompanyId,
      }).lean();
    }

    /*
     * No alumni found
     */
    if (alumniList.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No alumni or current employee found for ${companyName} company.`,
        data: {
          companyName,
          careerPageUrl,
          alumni: [],
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Alumni fetched successfully.",
      data: {
        companyName,
        careerPageUrl,
        alumniFound,
        totalAlumniFound: alumniList.length,
        alumni: alumniList,
      },
    });
  } catch (error) {
    console.error("getAlumniForCareerPageUrl error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch alumni.",
    });
  }
};

export const sendCareerPageReferralRequest = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const senderUserId = req.user?._id || req.user?.id;
    const rawCareerPageUrl = String(req.body.careerPageUrl || "").trim();
    const receiverUserIds = req.body.receiverUserIds;

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

    if (!Array.isArray(receiverUserIds) || receiverUserIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "receiverUserIds must be a non-empty array.",
      });
    }

    const uniqueReceiverUserIds = [
      ...new Set(receiverUserIds.map((id) => String(id).trim())),
    ];

    for (const receiverUserId of uniqueReceiverUserIds) {
      if (!mongoose.Types.ObjectId.isValid(receiverUserId)) {
        return res.status(400).json({
          success: false,
          message: `Invalid receiverUserId: ${receiverUserId}`,
        });
      }

      if (String(senderUserId) === String(receiverUserId)) {
        return res.status(400).json({
          success: false,
          message: "You cannot send referral request to yourself.",
        });
      }
    }

    const urlValidation = await validateCareerPageUrl(rawCareerPageUrl);

    if (!urlValidation.valid) {
      return res.status(400).json({
        success: false,
        message: urlValidation.message,
      });
    }

    const careerPageUrl = urlValidation.normalizedUrl;
    const companyName = urlValidation.companyName;

    if (!companyName) {
      return res.status(400).json({
        success: false,
        message: "Unable to extract company name from this job URL.",
      });
    }

    const senderProfile = await Onboarding.findOne({
      userId: senderUserId,
    })
      .session(session)
      .lean();

    if (!senderProfile) {
      return res.status(404).json({
        success: false,
        message: "Sender profile not found. Complete onboarding first.",
      });
    }

    const applicantType =
      senderProfile.profileType || senderProfile.userType || "fresher";

    const created = [];
    const skipped = [];

    for (const receiverUserId of uniqueReceiverUserIds) {
      const existingReferral = await JobPostingTable.findOne({
        referralRequestId: senderUserId,
        postedByUser: receiverUserId,
        careerPageUrl,
        isAskForReferral: true,
        jobType: "Referral",
      })
        .session(session)
        .lean();

      if (existingReferral) {
        skipped.push({
          receiverUserId,
          reason: "Referral request already sent to this alumni for this URL.",
        });
        continue;
      }

      const receiverStudentProfile = await getStudentService(receiverUserId);

      const alumniProfile = receiverStudentProfile?.data?.[0];

      if (!alumniProfile) {
        skipped.push({
          receiverUserId,
          reason: "Receiver profile not found.",
        });
        continue;
      }

      const referralJob = await JobPostingTable.create(
        [
          {
            candidatePosted: alumniProfile._id,
            postedByUser: receiverUserId,

            jobType: "Referral",
            approvalStatus: "Approved",

            visibleTo: "All",
            broadcastType: "Everyone",

            companyName,
            careerPageUrl,

            senderProfile,
            receiverProfile: alumniProfile,

            location: ["None"],
            jobTitle: [`Referral request for ${companyName}`],
            jobCategory: "Referral",

            description: `Referral request for ${companyName}. Career page URL: ${careerPageUrl}`,

            lookingFor: "Job",

            referralRequestId: senderUserId,
            isAskForReferral: true,
            inactive: false,
          },
        ],
        { session },
      );

      const createdReferralJob = referralJob[0];

      const application = await Application.create(
        [
          {
            applicant: senderProfile._id,
            applicantType,

            appliedForCompany: null,
            referralCompany: companyName,

            appliedByType: applicantType,
            adminApprovalStatus: "Approved",

            job: createdReferralJob._id,
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
          },
        ],
        { session },
      );

      const createdApplication = application[0];

      created.push({
        receiverUserId,
        referralJob: createdReferralJob,
        application: createdApplication,
      });

      notifyAlumniOnNewReferralRequest({
        alumniAuthId: receiverUserId,
        senderUserId,
        senderName: senderProfile?.name || "Someone",
        companyName,
        requestId: createdReferralJob._id,
        applicationId: createdApplication._id,
      }).catch((err) =>
        console.error("Referral notification failed:", err.message),
      );
    }

    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      message: "Referral request process completed.",
      data: {
        companyName,
        careerPageUrl,
        totalSelected: uniqueReceiverUserIds.length,
        totalCreated: created.length,
        totalSkipped: skipped.length,
        created,
        skipped,
      },
    });
  } catch (error) {
    await session.abortTransaction();

    console.error("sendCareerPageReferralRequest error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate referral request found.",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to send referral request.",
    });
  } finally {
    session.endSession();
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
        "referralRequestId postedByUser companyName careerPageUrl senderProfile receiverProfile jobTitle description  isAskForReferral createdAt updatedAt",
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

    const applicationStatus = status === "accepted" ? "Accepted" : "Rejected";

    const application = await Application.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(requestId),
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
    )
      .populate({
        path: "job",
        select:
          "companyName careerPageUrl jobTitle description isAskForReferral referralRequestId postedByUser senderProfile receiverProfile",
      })
      .lean();

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Referral application not found.",
      });
    }

    const job = application.job;

    if (!job || String(job.postedByUser) !== String(receiverUserId)) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this referral request.",
      });
    }

    notifySenderOnReferralRequestStatusChange({
      senderAuthId: job.referralRequestId,
      receiverAuthId: receiverUserId,
      status,
      requestId: application._id,
      companyName: job.companyName,
    }).catch((err) =>
      console.error("Referral status notification failed:", err.message),
    );

    return res.status(200).json({
      success: true,
      message: `Referral request ${status} successfully.`,
      data: application,
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

    const senderObjectId = new mongoose.Types.ObjectId(senderUserId);

    const receiverStudentProfile = await getStudentService(senderUserId);

    const applicantId = receiverStudentProfile?.data?.[0]?._id;

    if (!applicantId) {
      return res.status(404).json({
        success: false,
        message: "Applicant onboarding profile not found.",
      });
    }

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 20, 1);
    const skip = (page - 1) * limit;

    const filter = {
      referralRequestId: senderObjectId,
      isAskForReferral: true,
      jobType: "Referral",
      inactive: false,
    };

    const total = await JobPostingTable.countDocuments(filter);

    const requests = await JobPostingTable.find(filter)
      .select(
        "referralRequestId postedByUser companyName careerPageUrl senderProfile receiverProfile jobTitle description isAskForReferral createdAt updatedAt",
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const requestsWithApplicationStatus = await Promise.all(
      requests.map(async (request) => {
        const application = await Application.findOne({
          applicant: applicantId,
          job: request._id,
        })
          .select("currentStatus createdAt updatedAt")
          .sort({ createdAt: -1 })
          .lean();

        return {
          ...request,
          currentStatus: application?.currentStatus || null,
          application,
        };
      }),
    );

    const result = paginatedResponse(requestsWithApplicationStatus, total, {
      page,
      limit,
    });

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
