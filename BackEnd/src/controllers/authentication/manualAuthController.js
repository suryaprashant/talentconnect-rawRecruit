import { loginUser, registerUser, generateToken,getTotalUsersCount, sendSignupOtpService } from "../../services/authService.js";
import Otp from "../../models/otpModel.js";

const setJwtCookie = (res, token) => {
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: true, 
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000, 
        path: '/'
    });
};



export const signup = async (req, res) => {
    try {
        const { email, password, userType , otp } = req.body;

        if (!email || !password || !userType || !otp) {
            return res.status(400).json({
                message: "Email, password and userType are required"
            });
        }

        const validOtp = await Otp.findOne({ email, otp });
        if (!validOtp) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        const newUser = await registerUser({ email, password, userType });

        await Otp.deleteOne({ _id: validOtp._id });
        
        const token = generateToken({
            userId: newUser._id,
            email: newUser.email,
            userType: newUser.userType
        });
      
        setJwtCookie(res, token);
        res.status(201).json({
            message: "Signup successful",
            user: {
                _id: newUser._id,
                email: newUser.email,
                userType: newUser.userType,
                onboardingCompleted: newUser.onboardingCompleted
            },
            token
        });
    } catch (error) {
      console.error("Signup Error:", error); 
      res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error" });
    }
};

export const sendSignupOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const response = await sendSignupOtpService({ email });
        res.status(200).json(response);
    } catch (error) {
        console.error("Send Signup OTP Error:", error);
        res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error" });
    }
};

  

export const login = async (req, res) => {
    try {
       
        const { email, password } = req.body;
        
        const user = await loginUser({ email, password });

        const token = generateToken({
            userId: user._id,
            email: user.email,
            userType: user.userType
        });

        setJwtCookie(res, token);
        
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                _id: user._id,
                email: user.email,
                userType: user.userType,
                name: user.name,
                basicDetails: user,
                onboardingCompleted: user.onboardingCompleted
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(error.statusCode || 500).json({ message: error.message || 'Internal Server Error' });
    }
};

export const logout = async (req, res) => {
  // console.log("hero");
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: 'none',
      secure: process.env.NODE_ENV === 'production',
      path: '/'
    });
    //localStorage.removeItem() ;
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error('Logout Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getCountOfTotalUsers= async (req, res, next) =>{
  try {
    // If you want filters from req (e.g. by userType), you can parse them
    const { userType } = req.body;  // or req.query, etc.
    const filter = {};
    if (userType) {
      filter.userType = userType;
    }

    const total = await getTotalUsersCount(filter);
    return res.status(200).json({
      success: true,
      totalUsers: total,
    });
  } catch (error) {
    console.error("Error in getTotalUsersCount controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
