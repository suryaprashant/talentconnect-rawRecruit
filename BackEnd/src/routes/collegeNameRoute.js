import express from 'express';
import { getAllColleges, registerCollege } from '../controllers/collegeNameController.js';

const router = express.Router();

router.get('/all', getAllColleges);
router.post('/register', registerCollege);

export default router;