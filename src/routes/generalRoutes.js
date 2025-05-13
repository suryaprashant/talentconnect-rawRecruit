// src/routes/generalRoutes.js
import express from 'express';
import { createProfile} from '../controllers/createProfileController.js';

const router = express.Router();

router.post('/create-profile', createProfile);


export default router;
