import express from "express";
import { createApplication, getUserApplication } from "../controllers/application.controller.js";

const router=express.Router();

// api '.../studentApply'

router.get('/',getUserApplication);
router.post('/',createApplication);

export default router;