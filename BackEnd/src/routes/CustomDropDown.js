import express from 'express';
// Import specific functions
import { getAllSkills, addSkill, deleteSkill } from '../controllers/SkillsController.js';

const router = express.Router();

router.get('/get-skills', getAllSkills);
router.post('/add-skill', addSkill);
router.delete('/delete-skill/:id', deleteSkill); // Added a dynamic ID parameter

export default router;