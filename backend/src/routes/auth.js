// src/routes/auth.js
import express from 'express';
import { signup, login } from '../controllers/authentication/manualAuth.js';
import { googleAuth } from '../controllers/authentication/googleAuthController.js';
import { handleLinkedInCallback } from '../controllers/authentication/LinkedInAuth.js';
import {
  sendResetLink,
  resetPassword
} from '../controllers/authentication/forgotPasswordController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/google', googleAuth);
router.get('/linkedin/callback', handleLinkedInCallback);
router.post('/forgot-password', sendResetLink);
router.post('/reset-password/:token', resetPassword);

export default router;
