import { authenticateWithGoogle } from "src/services/googleAuthService.js";
import { generateToken } from "src/services/authService.js";


export const googleAuth = async (req, res) => {
    try {
        const { code, userType } = req.body;

        if (!code) {
            return res.status(400).json({ message: 'Authorization code is required' });
        }

        const { user, isNewUser } = await authenticateWithGoogle({ code, userType });

        const token = generateToken({
            userId: user._id,
            email: user.email,
            userType: user.userType
        });

     
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict', // Note: 'strict' is more secure than 'none'
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
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
                onboardingStep: user.onboardingStep
            },
            token
        });

    } catch (error) {
        console.error('Google Auth Controller Error:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Google authentication failed'
        });
    }
};