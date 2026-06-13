import express from "express";
import { createOffcampusApplication, createIntershipApplication, createJobListingApplication, saveJobByUser ,unsaveJobByUser, getApplicationsByJob, getCollegeApplicationsByJob, createOncampusApplication, createPoolcampusApplication, shortlistApplicant, acceptApplicant, rejectApplicant, getShortlistedCandidatesByCompany, getAcceptedCandidatesByCompany, fetchSavedJobs, createCampusInternshipApplication, getUserApplicationStatus, createReferralApplication, getShortlistedCompaniesForCollege, shortlistApplicantForCompany, rejectCompanyApplicationByCollege, scheduleInterview ,
getCompanyDashboardMetrics,
submitAlternateDates,getReferralApplicationsForProfessional,
getProfessionalDashboardMetrics,
 updateApplicationStatus,
 getGlobalReferralApplications,
 getReferralsForCompany,
 getProfessionalReferralMetrics,
 getCandidateDashboardStats,
 getReferredCandidatesPipeline, updateReferralCandidateStatus,
 getApplicationDetailsById
 } from "../controllers/applicationController.js";
import secureRoute from '../middlewares/secureRouteMiddleware.js';
//import { updateApplicationStatus } from '../controllers/applicationController.js';

const router = express.Router();

// api '.../application'
// save opportunity
router.patch('/update-status/:applicationId',secureRoute, updateApplicationStatus)
router.post("/saveopportunity", secureRoute, saveJobByUser);
router.delete("/saveopportunity/:jobId", secureRoute, unsaveJobByUser);
router.get("/saveopportunity", secureRoute, fetchSavedJobs);

// offcampus
router.post('/candidate/offcampus', secureRoute, createOffcampusApplication);
router.get('/status/candidate/:jobType', secureRoute, getUserApplicationStatus);
// router.get('/offcampus/shortlisted', secureRoute, getShortlistedCandidatesByCompany);
// router.get('/offcampus/accepted', secureRoute, getAcceptedCandidatesByCompany);

// joblisting
router.post('/candidate/joblisting', secureRoute, createJobListingApplication);
// router.get('/candidate/joblisting', secureRoute, getJobListingUserApplication);

// internship
router.post('/candidate/internship', secureRoute, createIntershipApplication);
// router.get('/candidate/internship', secureRoute, getInternshipUserApplication);

// referral
router.post('/candidate/referral', secureRoute, createReferralApplication);
router.get(
  "/referrals/referred-by-me",
  secureRoute,
  getReferredCandidatesPipeline
);

router.patch(
  "/referrals/:applicationId/status",
  secureRoute,
  updateReferralCandidateStatus
);

// company and college-- oncampus poolcampus campus-internship 
router.post('/oncampus', secureRoute, createOncampusApplication);
router.post('/poolcampus', secureRoute, createPoolcampusApplication);
router.post('/internship', secureRoute, createCampusInternshipApplication);

// access only to company 

// shortlist
router.patch('/manage/shortlist/:applicationId', secureRoute, shortlistApplicant);
router.patch('/manage/college/shortlist/:applicationId', secureRoute, shortlistApplicantForCompany);

router.get('/manage/shortlist/', secureRoute, getShortlistedCandidatesByCompany);
router.get('/manage/college/shortlist/', secureRoute, getShortlistedCompaniesForCollege);

// reject
// router.get('/manage/rejected/', secureRoute, getRejectedCandidatesByCompany);

router.patch('/manage/reject/:applicationId', secureRoute, rejectApplicant);
router.patch("/manage/college/reject/:applicationId", secureRoute, rejectCompanyApplicationByCollege)
// accept
router.patch('/manage/accept/:applicationId', secureRoute, acceptApplicant);
router.get('/manage/accept/', secureRoute, getAcceptedCandidatesByCompany);


router.get('/company/metrics', secureRoute, getCompanyDashboardMetrics);
router.get('/professional/metrics', secureRoute, getProfessionalDashboardMetrics);



// get candidates by job
router.get('/manage', secureRoute, getApplicationsByJob);

// get college by job
router.get('/manage/college', secureRoute, getCollegeApplicationsByJob);

// accept offcampus
// router.get('/accept/:id', getAcceptedCandidatesByJob);

// schedule interview
router.post('/manage/schedule', secureRoute, scheduleInterview);

router.post('/:jobId/submit' , secureRoute , submitAlternateDates) ;

// router.js
router.get(
  "/my-referral-applications",
  secureRoute, // Ensures req.user.profileId is populated
  getReferralApplicationsForProfessional
);

router.get(
  "/all-referrals",
  secureRoute,
  getGlobalReferralApplications
);

router.get(
  "/company/referred-candidates",
  secureRoute,
  getReferralsForCompany
);

router.get(
  "/professional/referral-metrics",
  secureRoute,
  getProfessionalReferralMetrics
);

router.get('/dashboard/candidate/stats', secureRoute, getCandidateDashboardStats);
router.get('/details/:applicationId', secureRoute, getApplicationDetailsById);
export default router;