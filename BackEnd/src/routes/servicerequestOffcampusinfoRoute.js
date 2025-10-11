import express from "express";
import { submitOffCampusInfo } from "../controllers/servicerequestOffcampusinfoController.js";

const router = express.Router();
router.post("/offcampus/info", submitOffCampusInfo);
export default router;
