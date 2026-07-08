import bcrypt from "bcryptjs";

import Otp from "../../models/otpModel.js";
import StudentProfile from "../../models/studentProfileModel.js";
import FresherProfile from "../../models/fresherProfileModel.js";
import CollegeProfile from "../../models/collegeDashboard/collegeProfileModel.js";
import Auth from "../../models/authModel.js";
import RefreshToken from "../../models/refreshTokenModel.js";

import {
  loginUser,
  registerUser,
  getTotalUsersCount,
  sendSignupOtpService,
} from "../../services/authService.js";

import {
  createUserSession,
  refreshUserSession,
  destroyUserSession,
} from "../../services/sessionService.js";

import { clearAuthCookies } from "../../utils/cookieUtils.js";

const buildUserResponse = (user) => {
  const safeUser = user?.toObject ? user.toObject() : user;

  if (safeUser?.password) {
    delete safeUser.password;
  }

  return {
    _id: safeUser._id,
    email: safeUser.email,
    userType: safeUser.userType,
    name: safeUser.name,
    fullname: safeUser.fullname,
    authProvider: safeUser.authProvider,
    status: safeUser.status,
    onboardingCompleted: safeUser.onboardingCompleted,
  };
};

export const signup = async (req, res) => {
  try {
    const { email, password, userType, otp, deviceToken } = req.body;

    if (!email || !password || !userType || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email, password, userType and OTP are required",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const validOtp = await Otp.findOne({
      email: normalizedEmail,
      otp,
    });

    if (!validOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    const newUser = await registerUser({
      email: normalizedEmail,
      password,
      userType,
    });

    if (deviceToken) {
      await Auth.findByIdAndUpdate(newUser._id, {
        deviceToken,
      });
    }

    await Otp.deleteOne({
      _id: validOtp._id,
    });

    const session = await createUserSession({
      user: newUser,
      req,
      res,
    });

    return res.status(201).json({
      success: true,
      message: "Signup successful",
      token: session.accessToken,
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      user: buildUserResponse(newUser),
    });
  } catch (error) {
    console.error("Signup Error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const sendSignupOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const response = await sendSignupOtpService({
      email: String(email).trim().toLowerCase(),
    });

    return res.status(200).json(response);
  } catch (error) {
    console.error("Send Signup OTP Error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, deviceToken } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await loginUser({
      email: String(email).trim().toLowerCase(),
      password,
    });

    if (deviceToken) {
      await Auth.findByIdAndUpdate(user._id, {
        deviceToken,
      });
    }

    /**
     * IMPORTANT:
     * Only create session here.
     * Do NOT call refreshUserSession() immediately after login.
     */
    const session = await createUserSession({
      user,
      req,
      res,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: session.accessToken,
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      user: {
        ...buildUserResponse(user),
        basicDetails: buildUserResponse(user),
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const logout = async (req, res) => {
  try {
    if (req.user?._id) {
      await Auth.findByIdAndUpdate(req.user._id, {
        $unset: {
          deviceToken: 1,
        },
      });
    }

    await destroyUserSession({
      req,
      res,
    });

    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error("Logout Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const session = await refreshUserSession({
      req,
      res,
    });

    return res.status(200).json({
      success: true,
      message: "Session refreshed successfully",
      token: session.accessToken,
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    });
  } catch (error) {
    console.error("Refresh Token Error:", error);

    return res.status(401).json({
      success: false,
      code: "INVALID_REFRESH_TOKEN",
      message: error.message || "Invalid refresh token",
    });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Session expired, please login again",
      });
    }

    const userId = req.user._id;
    const { password } = req.body;

    const user = await Auth.findById(userId);

    if (!user) {
      clearAuthCookies(res);

      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.authProvider === "manual") {
      if (!password) {
        return res.status(400).json({
          success: false,
          message: "Password is required",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid password",
        });
      }
    }

    await Promise.all([
      StudentProfile.deleteOne({ userId }),
      FresherProfile.deleteOne({ userId }),
      CollegeProfile.deleteOne({ userId }),
      RefreshToken.deleteMany({ userId }),
      Auth.deleteOne({ _id: userId }),
    ]);

    clearAuthCookies(res);

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete Account Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getCountOfTotalUsers = async (req, res) => {
  try {
    const { userType } = req.query;

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
};

export const getMe = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(200).json({
        success: true,
        user: null,
      });
    }

    return res.status(200).json({
      success: true,
      user: buildUserResponse(user),
    });
  } catch (error) {
    console.error("getMe error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await Auth.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let logoUrl = null;
    let additionalData = {};

    switch (user.userType) {
      case "student": {
        const studentProfile = await StudentProfile.findOne({ userId });

        if (studentProfile) {
          logoUrl =
            studentProfile.profileImageUrl ||
            studentProfile.profileImage ||
            studentProfile.avatar ||
            studentProfile.profile?.profileImageUrl ||
            null;

          additionalData = {
            profileCompleted: true,
            about: studentProfile.about,
            skills: studentProfile.skills,
          };
        }

        break;
      }

      case "fresher": {
        const fresherProfile = await FresherProfile.findOne({ userId });

        if (fresherProfile) {
          logoUrl =
            fresherProfile.profileImageUrl ||
            fresherProfile.profileImage ||
            fresherProfile.avatar ||
            fresherProfile.profile?.profileImageUrl ||
            null;

          additionalData = {
            profileCompleted: true,
            about: fresherProfile.about,
            skills: fresherProfile.skills,
          };
        }

        break;
      }

      case "college": {
        const collegeProfile = await CollegeProfile.findOne({ userId });

        if (collegeProfile) {
          logoUrl =
            collegeProfile.profileImage ||
            collegeProfile.collegeDetails?.collegeImageUrl ||
            collegeProfile.collegeLogo ||
            collegeProfile.logo ||
            null;

          additionalData = {
            profileCompleted: true,
            collegeName: collegeProfile.collegeDetails?.collegeName,
          };
        }

        break;
      }

      default: {
        logoUrl = user.profileImage || null;
        break;
      }
    }

    if (!logoUrl && user.profileImage) {
      logoUrl = user.profileImage;
    }

    return res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name || user.fullname,
        email: user.email,
        userType: user.userType,
        profileImage: logoUrl,
        avatar: logoUrl,
        ...additionalData,
      },
    });
  } catch (error) {
    console.error("Error in getUserById:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};