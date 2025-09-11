import express from "express";
import { submitRequest } from "../controllers/hiringChannelsOncampusController.js";

const router = express.Router();

// GET /api/applications
router.post("/oncampus", submitRequest);

export default router;
