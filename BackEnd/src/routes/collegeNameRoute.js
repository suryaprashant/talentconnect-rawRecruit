import express from 'express';
import { createCollegeMasterDataController, getAllColleges, getCollegeMasterDataByTypeController, registerCollege } from '../controllers/collegeNameController.js';

const router = express.Router();

router.get('/all', getAllColleges);
router.post('/register', registerCollege);

router.post("/college-master-data", createCollegeMasterDataController);
router.get("/college-master-data/:type", getCollegeMasterDataByTypeController);

export default router;