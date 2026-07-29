import express from 'express';
import secureRoute from "../middlewares/secureRouteMiddleware.js";
import { 
  getAlumniWhoCanHelp,
  getAlumniHiringNetwork, 
  ProfileScore, 
  getNewApplications, 
  getCollegeAlumni, 
  getCompanyAlumni,
  getNewUser
} from '../controllers/AlumniJobsController.js';
import verifyUser from '../middlewares/verifyUser.js';
import {
  searchLimiter,
  adminLimiter,
} from "../middlewares/ratelimiter/index.js";

const router = express.Router();

// ============================================================
// Alumni Routes (All are GET/read operations)
// ============================================================

// College alumni - uses searchLimiter (60 requests per minute)
router.get(
  '/college-alumni',
  secureRoute,
  searchLimiter,
  getCollegeAlumni
);

// Company alumni - uses searchLimiter (60 requests per minute)
router.get(
  '/company-alumni',
  secureRoute,
  searchLimiter,
  getCompanyAlumni
);

// Alumni who can help - uses searchLimiter (60 requests per minute)
router.get(
  '/alumni/:company/:postedByUser',
  secureRoute,
  searchLimiter,
  getAlumniWhoCanHelp
);

// Profile score - uses searchLimiter (60 requests per minute)
router.get(
  '/profile-score',
  secureRoute,
  searchLimiter,
  ProfileScore
);

// New applications - uses adminLimiter (300 requests per minute)
router.get(
  '/new-application',
  secureRoute,
  adminLimiter,
  getNewApplications
);

// Hiring network - uses searchLimiter (60 requests per minute)
router.get(
  '/hiring-network',
  secureRoute,
  searchLimiter,
  getAlumniHiringNetwork
);

// New users - uses adminLimiter (300 requests per minute)
router.get(
  '/new-users',
  verifyUser,
  adminLimiter,
  getNewUser
);

export default router;