// routes/studentDashboardProfileRoutes.js
/*import express from "express";
import upload from "../middlewares/upload.js";
import verifyToken from "../middlewares/verifyToken.js";
import {createOrUpdateStudentProfile } from "../controllers/studentDashboardProfileController.js";

const router = express.Router();

router.post(
  "/:userId",
  verifyToken,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "profileIcon", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  createOrUpdateStudentProfile
);

export default router;
*/