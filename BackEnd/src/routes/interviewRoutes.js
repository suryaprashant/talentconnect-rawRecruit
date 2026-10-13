import express from "express";
import secureRoute from "../middlewares/secureRouteMiddleware.js";
import {
  getCompanyInterviews,
  getCollegeInterviews,
  getInterviewById,
  updateInterviewStatus,
  getInterviews,
  getUnreadInterviews,
  markInterviewAsRead,
  scheduleInterviewByProfessional,
} from "../controllers/interviewController.js";
import {
    searchLimiter,
    applicationLimiter,
    adminLimiter,
} from "../middlewares/ratelimiter/index.js";

const router = express.Router();

// ============================================================
// Interview Routes
// ============================================================

// POST schedule interview by professional - uses applicationLimiter (30 per hour)
router.post(
    "/professional/schedule",
    secureRoute,
    applicationLimiter,
    scheduleInterviewByProfessional
);

// GET all interviews - uses searchLimiter (60 per minute)
router.get(
    "/",
    secureRoute,
    searchLimiter,
    getInterviews
);

// Company dashboard – scheduled interviews - uses searchLimiter (60 per minute)
router.get(
    "/company",
    secureRoute,
    searchLimiter,
    getCompanyInterviews
);

// College dashboard – scheduled interviews - uses searchLimiter (60 per minute)
router.get(
    "/college",
    secureRoute,
    searchLimiter,
    getCollegeInterviews
);

// GET unread interviews - uses searchLimiter (60 per minute)
router.get(
    "/unread",
    secureRoute,
    searchLimiter,
    getUnreadInterviews
);

// Single interview detail - uses searchLimiter (60 per minute)
router.get(
    "/:interviewId",
    secureRoute,
    searchLimiter,
    getInterviewById
);

// Update interview status (Completed / Cancelled) - uses adminLimiter (300 per minute)
router.patch(
    "/:interviewId/status",
    secureRoute,
    adminLimiter,
    updateInterviewStatus
);

// Mark interview as read - uses searchLimiter (60 per minute)
router.patch(
    "/:interviewId/mark-read",
    secureRoute,
    searchLimiter,
    markInterviewAsRead
);

export default router;