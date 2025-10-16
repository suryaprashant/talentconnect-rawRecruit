// src/routes/auth.js
import express from 'express';
import { signup, login, logout,getCountOfTotalUsers } from '../controllers/authentication/manualAuthController.js';
import { googleAuth } from '../controllers/authentication/googleAuthController.js';
import {  handleLinkedInCallback, redirectToLinkedIn } from '../controllers/authentication/linkedInAuthController.js';
import {
  sendResetLink,
  resetPassword,
} from '../controllers/authentication/forgotPasswordController.js';


const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/google', googleAuth);
router.get('/linkedin', redirectToLinkedIn);
router.get('/linkedin/callback', handleLinkedInCallback)
router.post('/forgot-password', sendResetLink);
router.post('/reset-password/:token', resetPassword);
router.post("/getcount/toteluser", getCountOfTotalUsers) ;
router.post("/logout", logout) ;

// // routes/auth.js
// router.get("/current-user",secureRoute, (req, res) => {
//   res.json({ user: req.user });
// });


export default router;
