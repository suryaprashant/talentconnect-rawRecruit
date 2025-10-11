import express from "express";
import { submitRequestInfo } from "../controllers/servicerequqestCollegeOncampusrequestController.js";

const router = express.Router();

router.post("/submit", submitRequestInfo);

export default router;
