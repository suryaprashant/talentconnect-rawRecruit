// src/routes/auth.js
import express from 'express';
import { signup, login, logout,getCountOfTotalUsers, sendSignupOtp, getMe } from '../controllers/authentication/manualAuthController.js';
import { googleAuth } from '../controllers/authentication/googleAuthController.js';
import {  handleLinkedInCallback, redirectToLinkedIn } from '../controllers/authentication/linkedInAuthController.js';
import { requestPasswordReset, resetPassword, validateResetToken } from '../controllers/authentication/forgotPasswordController.js';
import authMiddleware from '../middlewares/auth.middleware.js';


const router = express.Router();

router.get("/me", authMiddleware, getMe);
router.post('/signup', signup);
router.post('/login', login);
router.post('/google', googleAuth);
router.get('/linkedin', redirectToLinkedIn);
router.get('/linkedin/callback', handleLinkedInCallback)

router.post("/getcount/toteluser", getCountOfTotalUsers) ;
router.post("/logout", logout) ;

router.post('/send-otp',sendSignupOtp) ;

router.post('/forgot-password' , requestPasswordReset);
router.post('/validate-reset-token' , validateResetToken);
router.post('/reset-password' , resetPassword);

// // routes/auth.js
// router.get("/current-user",secureRoute, (req, res) => {
//   res.json({ user: req.user });
// });


export default router;

// import {
//   sendResetLink,
//   resetPassword,
// } from '../controllers/authentication/forgotPasswordController.js';


// router.post('/forgot-password', sendResetLink);
// router.post('/reset-password/:token', resetPassword);
