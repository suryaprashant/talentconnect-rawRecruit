import express from "express";
import {
  getAllOnboardingForms,
  submitOnboardingForm,
  getOnboardingForm,
  updateOnboardingForm,
  getMasterData,
  createMasterData,
  getCategorizedSkills,
  getOnboardingByUserId
} from "../controllers/studentOnboardingController.js";
import secureRoute from "../middlewares/secureRouteMiddleware.js"; 
import multer from "multer"; 

const router = express.Router();


const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });


router.get("/onboarding", secureRoute, getAllOnboardingForms);

router.post(
  "/onboarding",
  secureRoute, 
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "degreeCertificate", maxCount: 1 },
    { name: "project", maxCount: 1 },
  
    { name: "profileImage", maxCount: 1 }, 
    { name: "backgroundImage", maxCount: 1 },
    { name: "experienceCertificate", maxCount: 10 },
    { name: "leadershipCertificate", maxCount: 10 },
    { name: "internationalExperienceCertificate", maxCount: 10 },
      { name: "awardCertificate", maxCount: 10 }, // Added for background image upload
  ]),
  submitOnboardingForm
);

router.get("/onboarding/me", secureRoute, getOnboardingForm);

// // fetch categorized skills
// router.get("/onboarding/categorized-skills", secureRoute, getCategorizedSkills);

router.put(
  "/onboarding/update",
  secureRoute, // Apply secureRoute here
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "degreeCertificate", maxCount: 1 },
    { name: "project", maxCount: 2 },
    { name: "experienceCertificate", maxCount: 5 },
    { name: "profileImage", maxCount: 1 }, 
    { name: "backgroundImage", maxCount: 1 },
    
    { name: "leadershipCertificate", maxCount: 10 },
    { name: "internationalExperienceCertificate", maxCount: 10 },
    { name: "awardCertificate", maxCount: 10 },
  ]),
  updateOnboardingForm
);
// get all the details of the user
router.get("/onboarding/get-details/:userId", secureRoute, getOnboardingByUserId);
// Fetch dropdown options
router.get("/master-data", getMasterData);

// Add custom option (during onboarding)
router.post("/master-data", secureRoute, createMasterData);

export default router;