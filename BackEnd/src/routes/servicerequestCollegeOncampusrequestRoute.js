import express from "express";
import { submitRequestInfo } from "src/controllers/servicerequqestCollegeOncampusrequestController.js";

const router = express.Router();

router.post("/submit", submitRequestInfo);

export default router;
