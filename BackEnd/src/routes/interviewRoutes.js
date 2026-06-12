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
} from "../controllers/interviewController.js";

const router = express.Router();

router.get("/", secureRoute, getInterviews);

// Company dashboard – scheduled interviews
router.get("/company", secureRoute, getCompanyInterviews);

// College dashboard – scheduled interviews
router.get("/college", secureRoute, getCollegeInterviews);

// Single interview detail (optional – for modal/detail page)
router.get("/:interviewId", secureRoute, getInterviewById);

// Update interview status (Completed / Cancelled)
router.patch("/:interviewId/status", secureRoute, updateInterviewStatus);

router.get("/unread", secureRoute, getUnreadInterviews);
router.patch("/:interviewId/mark-read", secureRoute, markInterviewAsRead);
export default router;
