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

const router = express.Router();

router.post(
  "/career-page-referral",
  secureRoute,
  getAlumniForCareerPageUrl
);

router.post(
  "/career-page-referral/send",
  secureRoute,
  sendCareerPageReferralRequest
);
router.post("/addCompany-carrer",secureRoute,adminAddCompanyCareerPage)

router.get(
  "/career-page-referral/received",
  secureRoute,
  getReceivedCareerPageRequests
);

router.get("/company-career-page", secureRoute, getCareerPageUrlByCompanyName);

router.patch(
  "/career-page-referral/:requestId/status",
  secureRoute,
  updateCareerPageRequestStatus
);

router.get(
  "/career-page-referral/sent",
  secureRoute,
  getSentCareerPageRequests
);

export default router;
