import bcrypt from "bcryptjs";
import { loginUser, registerUser, generateToken,getTotalUsersCount, sendSignupOtpService } from "../../services/authService.js";
import Otp from "../../models/otpModel.js";
import StudentProfile from '../../models/studentProfileModel.js';
import FresherProfile from '../../models/fresherProfileModel.js';
import CollegeProfile from '../../models/collegeDashboard/collegeProfileModel.js';
import Auth from "../../models/authModel.js";

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
        if (req.body.deviceToken) {
          await Auth.findByIdAndUpdate(newUser._id, { deviceToken: req.body.deviceToken });
        }

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

        if (req.body.deviceToken) {
          await Auth.findByIdAndUpdate(user._id, { deviceToken: req.body.deviceToken });
        }

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



export const deleteAccount = async (req, res) => {
  console.log('here')
    try {
   if (!req.user || !req.user._id) {
  return res.status(401).json({ message: "Session expired, please login again" });
}

    
   const userId = req.user._id;
    const { password } = req.body;

    const user = await Auth.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // password check only for manual users
    if (user.authProvider === "manual") {
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({
          message: "Invalid password"
        });
      }
    }

    await Promise.all([
      StudentProfile.deleteOne({ userId }),
      FresherProfile.deleteOne({ userId }),
      CollegeProfile.deleteOne({ userId })
    ]);

    await Auth.deleteOne({ _id: userId });

    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "none",
      secure: process.env.NODE_ENV === "production",
      path: "/"
    });

    res.status(200).json({
      message: "Account deleted successfully"
    });

  } catch (error) {
    console.error("Delete Account Error:", error);

    res.status(500).json({
      message: "Internal Server Error"
    });
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

export const getMe = async (req, res) => {
  try {
    // req.user is set by auth middleware
    const user = req.user;

    {/*if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }*/}
    if (!user) {
      return res.status(200).json({ user: null });
    }

    return res.status(200).json({
      user: {
        _id: user._id,
        email: user.email,
        userType: user.userType,
        onboardingCompleted: user.onboardingCompleted,
        authProvider: user.authProvider,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("getMe error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// controllers/authentication/manualAuthController.js - Update getUserById
export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // First, get the basic user info from Auth model
    const user = await Auth.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    let profileImage = null;
    let additionalData = {};
    let logoUrl = null; // Use consistent variable name
    
    // Try to fetch profile image based on user type
    switch (user.userType) {
      case 'student':
        const studentProfile = await StudentProfile.findOne({ userId });
        if (studentProfile) {
          // Try multiple possible image fields
          logoUrl = studentProfile.profileImageUrl || 
                    studentProfile.profileImage || 
                    studentProfile.avatar ||
                    studentProfile.profile?.profileImageUrl;
          additionalData = {
            profileCompleted: !!studentProfile,
            about: studentProfile.about,
            skills: studentProfile.skills
          };
        }
        break;
        
      case 'fresher':
        const fresherProfile = await FresherProfile.findOne({ userId });
        if (fresherProfile) {
          logoUrl = fresherProfile.profileImageUrl || 
                    fresherProfile.profileImage || 
                    fresherProfile.avatar ||
                    fresherProfile.profile?.profileImageUrl;
          additionalData = {
            profileCompleted: !!fresherProfile,
            about: fresherProfile.about,
            skills: fresherProfile.skills
          };
        }
        break;
        
      case 'college':
        const collegeProfile = await CollegeProfile.findOne({ userId });
        if (collegeProfile) {
          // College might store image differently
          logoUrl = collegeProfile.profileImage || 
                    collegeProfile.collegeDetails?.collegeImageUrl ||
                    collegeProfile.collegeLogo ||
                    collegeProfile.logo;
          additionalData = {
            profileCompleted: !!collegeProfile,
            collegeName: collegeProfile.collegeDetails?.collegeName
          };
        }
        break;
        
      case 'professional':
        // Add professional profile model if exists
        // const professionalProfile = await ProfessionalProfile.findOne({ userId });
        // if (professionalProfile) {
        //   logoUrl = professionalProfile.profileImageUrl || professionalProfile.avatar;
        // }
        break;
        
      case 'employer':
      case 'company':
        // These might use companyDashboard endpoints
        // Keep existing logic for these
        break;
        
      default:
        // For any other user type, try the default profileImage field
        logoUrl = user.profileImage;
    }
    
    // Also check if the user has a profileImage in the Auth model itself
    if (!logoUrl && user.profileImage) {
      logoUrl = user.profileImage;
    }
    
    // Prepare response
    const response = {
      success: true,
      data: {
        _id: user._id,
        name: user.name || user.fullname,
        email: user.email,
        userType: user.userType,
        profileImage: logoUrl, // Use consistent field name
        avatar: logoUrl, // Add avatar field for compatibility
        ...additionalData
      }
    };
    
    res.status(200).json(response);
    
  } catch (error) {
    console.error('Error in getUserById:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
};

