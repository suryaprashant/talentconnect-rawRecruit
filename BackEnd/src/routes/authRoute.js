// src/routes/auth.js
import express from 'express';
import { signup, login, logout,getCountOfTotalUsers, sendSignupOtp, getMe, getUserById ,deleteAccount} from '../controllers/authentication/manualAuthController.js';
import { googleAuth } from '../controllers/authentication/googleAuthController.js';
import {  handleLinkedInCallback, redirectToLinkedIn } from '../controllers/authentication/linkedInAuthController.js';
import { requestPasswordReset, resetPassword, validateResetToken } from '../controllers/authentication/forgotPasswordController.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import optionalAuth from '../middlewares/optionalAuth.middleware.js';
import  Auth  from '../models/authModel.js';
import secureRoute from '../middlewares/secureRouteMiddleware.js';


const router = express.Router();

router.get("/me", optionalAuth, getMe);
router.post('/signup', signup);
router.post('/login', login);
router.delete('/delete',secureRoute, deleteAccount);
router.post('/google', googleAuth);
router.get('/linkedin', redirectToLinkedIn);
router.get('/linkedin/callback', handleLinkedInCallback)

router.post("/getcount/toteluser", getCountOfTotalUsers) ;
router.post("/logout", secureRoute, logout) ;

router.post('/send-otp',sendSignupOtp) ;

router.post('/forgot-password' , requestPasswordReset);
router.post('/validate-reset-token' , validateResetToken);
router.post('/reset-password' , resetPassword);

// // routes/auth.js
// router.get("/current-user",secureRoute, (req, res) => {
//   res.json({ user: req.user });
// });

// In your auth routes
router.get('/user/:id', getUserById);

router.patch("/device-token", secureRoute, async (req, res) => {
  try {
    const { deviceToken } = req.body;
    if (!deviceToken) {
      return res.status(400).json({ message: "deviceToken is required" });
    }
    await Auth.findByIdAndUpdate(req.user._id, { deviceToken });
    res.status(200).json({ success: true, message: "Device token updated" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;

// import {
//   sendResetLink,
//   resetPassword,
// } from '../controllers/authentication/forgotPasswordController.js';


// router.post('/forgot-password', sendResetLink);
// router.post('/reset-password/:token', resetPassword);
