// import express from "express";

// import { uploadResume } from "../controllers/uploadResumeController.js";

// const router = express.Router();
// router.post("/upload-resume", uploadResume);

// export default router;
import express from "express";
import { uploadResume } from "../controllers/uploadResumeController.js";
// 1. Correctly import your upload middleware
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// 2. Add the 'upload' middleware to the route before the controller
router.post(
  "/upload-resume",
  // The middleware processes the file. 'resume' must match the key in your frontend FormData.
  upload.single("resume"), 
  uploadResume
);

export default router;
