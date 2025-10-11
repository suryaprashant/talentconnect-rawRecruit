import express from "express";
import { registerOffCampus } from "src/controllers/servicerequestOffcampusregisterController.js";

const router = express.Router();
router.post("/offcampus/register", registerOffCampus);
export default router;
