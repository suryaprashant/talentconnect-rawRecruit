import express from "express";
import {
   sendCareerPageReferralRequest,
   getAlumniForCareerPageUrl,
  getReceivedCareerPageRequests,
  updateCareerPageRequestStatus,
  adminAddCompanyCareerPage,
  getCareerPageUrlByCompanyName,
  getSentCareerPageRequests
} from "../controllers/companyJobDiscoveryController.js";
import secureRoute from "../middlewares/secureRouteMiddleware.js";
import {
    searchLimiter,
    applicationLimiter,
    adminLimiter,
    deleteAccountLimiter,
} from "../middlewares/ratelimiter/index.js";

const router = express.Router();

// ============================================================
// Career Page Referral Routes
// ============================================================

// POST get alumni for career page - uses searchLimiter (60 per minute)
router.post(
  "/career-page-referral",
  secureRoute,
  searchLimiter,
  getAlumniForCareerPageUrl
);

// POST send career page referral request - uses applicationLimiter (30 per hour)
router.post(
  "/career-page-referral/send",
  secureRoute,
  applicationLimiter,
  sendCareerPageReferralRequest
);

// POST add company career page (Admin only) - uses adminLimiter (300 per minute)
router.post(
  "/addCompany-carrer",
  secureRoute,
  adminLimiter,
  adminAddCompanyCareerPage
);

// GET received career page requests - uses searchLimiter (60 per minute)
router.get(
  "/career-page-referral/received",
  secureRoute,
  searchLimiter,
  getReceivedCareerPageRequests
);

// GET company career page - uses searchLimiter (60 per minute)
router.get(
  "/company-career-page",
  secureRoute,
  searchLimiter,
  getCareerPageUrlByCompanyName
);

// PATCH update career page request status - uses applicationLimiter (30 per hour)
router.patch(
  "/career-page-referral/:requestId/status",
  secureRoute,
  applicationLimiter,
  updateCareerPageRequestStatus
);

// GET sent career page requests - uses searchLimiter (60 per minute)
router.get(
  "/career-page-referral/sent",
  secureRoute,
  searchLimiter,
  getSentCareerPageRequests
);

export default router;