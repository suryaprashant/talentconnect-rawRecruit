import express from 'express';
// Import specific functions
import { getAllSkills, addSkill, deleteSkill } from '../controllers/SkillsController.js';
import {
    searchLimiter,
    profileUpdateLimiter,
    deleteAccountLimiter,
} from "../middlewares/ratelimiter/index.js";

const router = express.Router();

// ============================================================
// Skills Routes
// ============================================================

// GET all skills - uses searchLimiter (60 per minute)
router.get(
    '/get-skills',
    searchLimiter,
    getAllSkills
);

// POST add skill - uses profileUpdateLimiter (30 per hour)
router.post(
    '/add-skill',
    profileUpdateLimiter,
    addSkill
);

// DELETE skill - uses deleteAccountLimiter (2 per day)
router.delete(
    '/delete-skill/:id',
    deleteAccountLimiter,
    deleteSkill
);

export default router;