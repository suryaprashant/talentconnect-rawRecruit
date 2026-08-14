import bcrypt from "bcryptjs";

import Otp from "../../models/otpModel.js";
import StudentProfile from "../../models/studentProfileModel.js";
import FresherProfile from "../../models/fresherProfileModel.js";
import CollegeProfile from "../../models/collegeDashboard/collegeProfileModel.js";
import Auth from "../../models/authModel.js";
import { JobPostingTable } from "../../models/jobPostingsModel.js";
import Onboarding from "../../models/studentonboardingModel.js";
import RefreshToken from "../../models/refreshTokenModel.js";
import { welcomeEmailQueue } from "../../queue/welcomeEmailQueue.js";
import mongoose from "mongoose";

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
  let dbSession = null;

  let newUser = null;
  let userSession = null;

  try {
    const { email, password, userType, otp, deviceToken } = req.body;

    // ==========================================
    // 1. BASIC VALIDATION
    // ==========================================

    if (!email || !password || !userType || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email, password, userType and OTP are required",
      });
    }

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      typeof userType !== "string" ||
      typeof otp !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data.",
      });
    }

    // ==========================================
    // 2. NORMALIZE DATA
    // ==========================================

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();
    const normalizedUserType = userType.trim().toLowerCase();
    const normalizedOtp = otp.trim();

    // ==========================================
    // 3. LENGTH VALIDATION
    // ==========================================

    if (
      normalizedEmail.length > 254 ||
      normalizedPassword.length < 8 ||
      normalizedPassword.length > 128 ||
      normalizedUserType.length > 30 ||
      normalizedOtp.length !== 6
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data.",
      });
    }

    // ==========================================
    // 4. EMAIL VALIDATION
    // ==========================================

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data.",
      });
    }

    // ==========================================
    // 5. PASSWORD VALIDATION
    // ==========================================

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=])[A-Za-z\d@$!%*?&^#()_\-+=]{8,128}$/;

    if (!passwordRegex.test(normalizedPassword)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be 8-128 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }

    // ==========================================
    // 6. USER TYPE VALIDATION
    // ==========================================

    const allowedUserTypes = Object.freeze([
      "college",
      "company",
      "student",
      "fresher",
      "professional",
      "employer",
      "admin",
    ]);

    if (!allowedUserTypes.includes(normalizedUserType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data.",
      });
    }

    // ==========================================
    // 7. DEVICE TOKEN VALIDATION
    // IMPORTANT:
    // Do this BEFORE starting transaction
    // ==========================================

    if (
      deviceToken &&
      (typeof deviceToken !== "string" || deviceToken.length > 500)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data.",
      });
    }

    // ==========================================
    // 8. START MONGODB SESSION
    // ==========================================

    dbSession = await mongoose.startSession();

    // ==========================================
    // 9. START TRANSACTION
    // ==========================================

    await dbSession.withTransaction(async () => {
      const validOtp = await Otp.findOne({
        email: normalizedEmail,
        otp: normalizedOtp,
      }).session(dbSession);

      if (!validOtp) {
        const error = new Error("Invalid or expired OTP");

        error.statusCode = 400;

        throw error;
      }

      // ------------------------------------------
      // STEP 2: CREATE USER
      // ------------------------------------------

      newUser = await registerUser({
        email: normalizedEmail,
        password: normalizedPassword,
        userType: normalizedUserType,
        session: dbSession,
      });

      // ------------------------------------------
      // STEP 3: UPDATE DEVICE TOKEN
      // ------------------------------------------

      if (deviceToken) {
        await Auth.findByIdAndUpdate(
          newUser._id,
          {
            deviceToken,
          },
          {
            session: dbSession,
            new: true,
          },
        );
      }

      // ------------------------------------------
      // STEP 4: DELETE OTP
      // ------------------------------------------

      await Otp.deleteOne(
        {
          _id: validOtp._id,
        },
        {
          session: dbSession,
        },
      );

      userSession = await createUserSession({
        user: newUser,
        req,
        res,
        session: dbSession,
      });

      // ------------------------------------------
      // DO NOT SEND EMAIL HERE
      // DO NOT RETURN RESPONSE HERE
      // ------------------------------------------
    });

    // ==========================================
    // TRANSACTION SUCCESSFULLY COMMITTED
    // ==========================================

    console.log("✅ Signup transaction committed successfully");

    // ==========================================
    // 10. SEND WELCOME EMAIL
    // OUTSIDE TRANSACTION
    // ==========================================

    await welcomeEmailQueue.add(
      "send-welcome-email",
      {
        email: newUser.email,
        usertype: newUser.userType,
      },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 5000,
        },
        removeOnComplete: 100,
        removeOnFail: 50,
      },
    );

    console.log("✅ Welcome email job added");

    // ==========================================
    // 11. SEND RESPONSE
    // ==========================================

    return res.status(201).json({
      success: true,
      message: "Signup successful",

      token: userSession.accessToken,

      accessToken: userSession.accessToken,

      refreshToken: userSession.refreshToken,

      user: buildUserResponse(newUser),
    });
  } catch (error) {
    console.error("Signup Error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  } finally {
    // ==========================================
    // END SESSION
    // ==========================================

    if (dbSession) {
      await dbSession.endSession();
    }
  }
};

export const verifyotp = async (req, res) => {
  const { userId } = req.user;
};

export const sendSignupOtp = async (req, res) => {
  try {
    const { email, usertype } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }
    let response;

    if (usertype === "admin") {
      response = await sendSignupOtpService({
        email: process.env.EMAIL,
      });
    } else {
      response = await sendSignupOtpService({
        email: String(email).trim().toLowerCase(),
      });
    }

    return res.status(200).json(response);

    return res.status(200).json(response);
  } catch (error) {
    console.error("Send Signup OTP Error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const verifyBackupOtp = async (req, res) => {
  try {
    const userId = req.user._id;

    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is required",
      });
    }

    const admin = await Auth.findById(userId);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const normalizedEmail = String(process.env.EMAIL || "")
      .trim()
      .toLowerCase();
    const normalizedOtp = String(otp).trim();

    const validOtp = await Otp.findOne({
      email: normalizedEmail,
      otp: normalizedOtp,
    });

    if (!validOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // OTP can only be used once
    await Otp.deleteOne({
      _id: validOtp._id,
    });

    return res.status(200).json({
      success: true,
      message: "Backup access verified successfully",
    });
  } catch (error) {
    console.error("Verify backup OTP error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to verify OTP",
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

    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    if (normalizedEmail.length > 254) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (normalizedPassword.length < 8 || normalizedPassword.length > 128) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
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
  let dbSession = null;

  try {
    // ==========================================
    // 1. CHECK AUTHENTICATED USER
    // ==========================================

    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Session expired, please login again",
      });
    }

    const userId = req.user._id;
    const { password } = req.body;

    // ==========================================
    // 2. FIND USER FROM AUTH
    // ==========================================

    const user = await Auth.findById(userId);

    if (!user) {
      clearAuthCookies(res);

      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ==========================================
    // 3. GET AUTH PROVIDER FROM DATABASE
    // ==========================================

    const authProvider = user.authProvider;

    console.log(
      `Delete account request: userId=${userId}, authProvider=${authProvider}`
    );

    // ==========================================
    // 4. PASSWORD VALIDATION
    // ==========================================

    // Only manual accounts require password
    if (authProvider === "manual") {
      if (!password) {
        return res.status(400).json({
          success: false,
          message: "Password is required",
        });
      }

      if (!user.password) {
        return res.status(400).json({
          success: false,
          message: "Password is not configured for this account",
        });
      }

      const isMatch = await bcrypt.compare(
        password,
        user.password
      );

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid password",
        });
      }
    }

    // ==========================================
    // 5. START MONGODB SESSION
    // ==========================================

    dbSession = await mongoose.startSession();

    // ==========================================
    // 6. START TRANSACTION
    // ==========================================

    await dbSession.withTransaction(async () => {

      // Student Profile
      await StudentProfile.deleteOne(
        { userId },
        { session: dbSession }
      );

      // Onboarding
      await Onboarding.deleteOne(
        { userId },
        { session: dbSession }
      );

      // Jobs posted by user
      await JobPostingTable.deleteMany(
        { postedByUser: userId },
        { session: dbSession }
      );

      // Fresher Profile
      await FresherProfile.deleteOne(
        { userId },
        { session: dbSession }
      );

      // College Profile
      await CollegeProfile.deleteOne(
        { userId },
        { session: dbSession }
      );

      // Refresh Tokens
      await RefreshToken.deleteMany(
        { userId },
        { session: dbSession }
      );

      // Finally delete Auth user
      const deletedUser = await Auth.deleteOne(
        { _id: userId },
        { session: dbSession }
      );

      if (deletedUser.deletedCount === 0) {
        const error = new Error(
          "User could not be deleted"
        );

        error.statusCode = 404;

        throw error;
      }
    });

    // ==========================================
    // 7. TRANSACTION SUCCESS
    // ==========================================

    console.log(
      `✅ Account deletion transaction committed for ${userId}`
    );

    // ==========================================
    // 8. CLEAR AUTH COOKIES
    // ==========================================

    clearAuthCookies(res);

    // ==========================================
    // 9. SUCCESS RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });

  } catch (error) {

    console.error(
      "❌ Delete Account Error:",
      error
    );

    return res.status(
      error.statusCode || 500
    ).json({
      success: false,
      message:
        error.message ||
        "Internal Server Error",
    });

  } finally {

    // ==========================================
    // 10. END MONGODB SESSION
    // ==========================================

    if (dbSession) {
      await dbSession.endSession();
    }
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
