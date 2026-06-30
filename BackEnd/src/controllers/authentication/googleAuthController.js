import { authenticateWithGoogle } from "../../services/googleAuthService.js";
// import { generateToken } from "../..//services/authService.js";
import { createUserSession } from "../../services/sessionService.js";
import Auth from "../../models/authModel.js";

const ALLOWED_USER_TYPES = [
  "student",
  "fresher",
  "professional",
  "company",
  "college",
  "employer",
];



export const cgoogleAuth = async (req, res) => {
    try {
        const { code, userType,isApp, googleToken} = req.body;

        // if (!code) {
        //     return res.status(400).json({ message: 'Authorization code is required' });
        // }

        const { user, isNewUser } = await authenticateWithGoogle({ code, userType,isApp, googleToken });

        if (req.body.deviceToken) {
          await Auth.findByIdAndUpdate(user._id, { deviceToken: req.body.deviceToken });
        }

        if (isNewUser && !ALLOWED_USER_TYPES.includes(userType)) {
          return res.status(400).json({
            message: "Invalid user type selected"
          });
        }

        const { accessToken } = await createUserSession({
            user,
            req,
            res,
        });

        res.status(200).json({
            success: true,
            isNewUser,
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                userType: user.userType,
                profileImage: user.profileImage,
                onboardingCompleted: user.onboardingCompleted,
                onboardingStep: user.onboardingStep,
            },
            token: accessToken,
        });

    } catch (error) {
        console.error('Google Auth Controller Error:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Google authentication failed'
        });
    }
};




