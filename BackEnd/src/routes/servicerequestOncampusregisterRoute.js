import express from "express";
import { submitRegistration } from "src/controllers/servicerequest_oncampusregister.js";

const router = express.Router();

router.post("/register-on-campus", submitRegistration);

export default router;
