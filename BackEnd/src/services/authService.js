import Auth from "../models/authModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";
import axios from "axios";
import { sendOtpEmail } from "../utils/sendOtpEmail.js";
import OtpModel from "../models/otpModel.js";

import { sendPasswordResetEmail , sendPasswordChangedConfirmation } from "../utils/sendPasswordResetEmail.js";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET;

const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET;
// Total number of all users
export const getUserCount = async () => {
  return await Auth.countDocuments();
};

// Total number of companies
export const getCompanyCount = async () => {
  return await Auth.countDocuments({ userType: "company" });
};

// Total number of colleges
export const getCollegeCount = async () => {
  return await Auth.countDocuments({ userType: "college" });
};

// Total number of candidates (students / freshers / professionals etc.)
{/*export const getCandidateCount = async () => {
  return await Auth.countDocuments({
    userType: {
      $in: ["candidate", "student", "fresher", "professional", "employer"],
    },
  });
};*/}

//v2 release changes
export const getCandidateCount = async () => {
  return await Auth.countDocuments({
    userType: {
      $in: [ "student", "fresher", "professional", "employer"],
    },
  });
};

// Get user count by status and type
export const getStatusCountByUserType = async (userType = null) => {
  try {
    const validUserTypes = [
      
      "student",
      "fresher",
      "professional",
      "employer",
      "company",
      "college",
    ];
    if (userType && !validUserTypes.includes(userType)) {
      throw new Error("Invalid userType");
    }
    const baseFilter = userType ? { userType } : {};

    const [total, active, pending, blocked] = await Promise.all([
      Auth.countDocuments(baseFilter),
      Auth.countDocuments({ ...baseFilter, status: "active" }),
      Auth.countDocuments({ ...baseFilter, status: "pending" }),
      Auth.countDocuments({ ...baseFilter, status: "blocked" }),
    ]);

    return { total, active, pending, blocked };
  } catch (error) {
    console.error(
      `Error getting status counts for ${userType || "all"}:`,
      error.message
    );
    throw new Error("Failed to get status counts");
  }
};

// Get all users data
export const getAll = async () => {
  try {
    const users = await Auth.find()
      .select(
        "status _id name email profileImage isNewUser onboardingCompleted onboardingStep userType activeCompanyId lastActivity createdAt"
      )
      .sort({ createdAt: -1 })
      .lean();

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
};

export async function getAuthUser(email) {
  try {
    const user = await Auth.findOne({ email });
    return { success: true, data: user };
  } catch (error) {
    console.log("Error:", error.message);
    throw new Error("Failed to fetch");
  }
}

export async function updateAuthUserService(userId, data) {
  try {
    const user = await Auth.findByIdAndUpdate(userId, data, {
      new: true,
    }).select("-password");
    return user;
  } catch (error) {
    console.log("Error:", error.message);
    throw new Error("Failed to fetch");
  }
}

export const upsertLinkedInAuthUser = async ({
  linkedinId,
  email,
  name,
  profileImage,
  userType,
}) => {
  let user = await Auth.findOne({ linkedinId });
  let isNewUser = false;

  if (!user) {
    const result = await getAuthUser(email);
    user = result?.data;

    if (user) {
      user.linkedinId = linkedinId;
      user.name = user.name || name;
      user.profileImage = user.profileImage || profileImage;
      user.authProvider = "linkedin";
      if (!user.userType) {
        user.userType = userType;
      }
      await user.save();
      isNewUser = false;
    } else {
      user = new Auth({
        linkedinId,
        email,
        name,
        profileImage,
        userType,
        authProvider: "linkedin",
        isNewUser: true,
      });
      await user.save();
      isNewUser = true;
    }
  } else {
    isNewUser = false;
  }

  return { user, isNewUser };
};

// Signup service
export const registerUser = async ({ email, password, userType }) => {
  const existingUser = await Auth.findOne({ email });
  if (existingUser) {
    const error = new Error("Email already registered");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await Auth.create({
    email,
    password: hashedPassword,
    userType,
    authProvider: 'manual',
  });

  return newUser;
};


export const sendSignupOtpService = async ({ email }) => {

  if (!email) {
    const error = new Error("Email is required");
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await Auth.findOne({ email });
  if (existingUser) {
    const error = new Error("Email already registered");
    error.statusCode = 409;
    throw error;
  }
  const otpCode = crypto.randomInt(100000, 999999).toString(); 
  await OtpModel.findOneAndUpdate(
    { email },
    { otp: otpCode, createdAt: new Date() }, 
    { upsert: true, new: true, setDefaultsOnInsert: true }  
  );
  await sendOtpEmail(email, otpCode);
  //console.log("OTP (DEV ONLY):", otpCode);

  return { success: true, msg: "OTP sent successfully" };
}

// Login service
/*export const loginUser = async ({ email, password }) => {
  const user = await Auth.findOne({ email });

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }
  return user;
};*/

//login Prathmesh 
export const loginUser = async ({ email, password }) => {
  const user = await Auth.findOne({ email });

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  // 🔥 IMPORTANT FIX
  if (user.authProvider !== 'manual') {
    const error = new Error(
      `This account was created using ${user.authProvider}. Please login using ${user.authProvider}.`
    );
    error.statusCode = 400;
    throw error;
  }

  if (!user.password) {
    const error = new Error("Password not set for this account");
    error.statusCode = 400;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  return user;
};


export const generateToken = ({ userId, email, userType }) => {
  return jwt.sign({ userId, email, userType }, JWT_SECRET, { expiresIn: "7d" });
};
export const generateAccessToken = ({ userId, email, userType }) => {
  return jwt.sign(
    { userId, email, userType },
    JWT_ACCESS_SECRET,
    {
      expiresIn: "15m",
    }
  );
};

export const generateRefreshToken = ({ userId }) => {
  return jwt.sign(
    { userId },
    JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
    }
  );
};
const generateRandomString = (length) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () =>
    characters.charAt(Math.floor(Math.random() * characters.length))
  ).join("");
};

export const generateLinkedInAuthUrl = ({ userType }) => {
  const validUserTypes = [
    "student",
    "fresher",
    "professional",
    "company",
    "college",
    "employer",
  ];
  if (!validUserTypes.includes(userType)) {
    throw new Error("Invalid userType");
  }

  const state = generateRandomString(16);
  const combinedState = `${state}_${userType}`;
  const linkedInAuthUrl =
    `https://www.linkedin.com/oauth/v2/authorization` +
    `?response_type=code` +
    `&client_id=${process.env.LINKEDIN_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(process.env.LINKEDIN_REDIRECT_URI)}` +
    `&state=${combinedState}` +
    `&scope=openid%20profile%20email`;

  return linkedInAuthUrl;
};

export const handleLinkedInLogin = async ({ code, state }) => {
  try {
    const stateParts = state.split("_");
    if (stateParts.length < 2) {
      throw new Error("Invalid state parameter");
    }

    const [originalState, userType, isApp = "false"] = stateParts;

    const tokenResponse = await axios.post(process.env.LINKEDIN_URL, null, {
      params: {
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const accessToken = tokenResponse.data.access_token;

    const profileResponse = await axios.get(
      "https://api.linkedin.com/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const profile = profileResponse.data;

    const linkedinId = profile.sub;
    const email = profile.email;
    const name =
      profile.name ||
      `${profile.given_name || ""} ${profile.family_name || ""}`.trim();
    const profileImage = profile.picture;

    const { user, isNewUser } = await upsertLinkedInAuthUser({
      linkedinId,
      email,
      name,
      profileImage,
      userType,
    });

    return { user, isNewUser, isApp };
  } catch (error) {
    console.error(
      "LinkedIn login error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

const resetTokens = {};

// export const requestPasswordReset = async ({ email }) => {
//   const user = await Auth.findOne({ email });
//   if (!user) {
//     const error = new Error("User with that email does not exist.");
//     error.statusCode = 404;
//     throw error;
//   }
//   const token = crypto.randomBytes(32).toString("hex");

//   resetTokens[token] = { email, expires: Date.now() + 15 * 60 * 1000 };

//   const resetLink = `${process.env.Frontend_URL}/reset-password/${token}`;

//   await sendEmail(
//     email,
//     "Password Reset Link",
//     `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 15 minutes.</p>`
//   );
// };

// export const performPasswordReset = async ({ token, newPassword }) => {
//   const tokenData = resetTokens[token];
//   if (!tokenData || tokenData.expires < Date.now()) {
//     const error = new Error("Token is invalid or has expired.");
//     error.statusCode = 400;
//     throw error;
//   }
//   const hashedPassword = await bcrypt.hash(newPassword, 10);
//   await Auth.findOneAndUpdate(
//     { email: tokenData.email },
//     { password: hashedPassword }
//   );

//   delete resetTokens[token];
// };

export const getTotalUsersCount = async (filter = {}) => {
  try {
    const count = await Auth.countDocuments(filter);
    return { success: true, count };
  } catch (error) {
    console.error("Error in getTotalUsersCount:", error.message);
    throw new Error("Failed to get total users count");
  }
};



export const requestPasswordResetService = async ({ email }) => {
  try {
    const user = await Auth.findOne({ email });
    
    if (!user) {
   
      return { 
        success: true, 
        message: "If an account exists with this email, you will receive a reset link." 
      };
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');

   
   

 
    user.resetToken = hashedToken; 
    user.resetTokenExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const frontendUrl = process.env.Frontend_URL || 'http://localhost:3000';
    const resetLink = `${frontendUrl}/reset-password/${rawToken}`;

    // Send email
    await sendPasswordResetEmail(email, resetLink, user.name);

    return { 
      success: true, 
      message: "If an account exists with this email, you will receive a reset link." 
    };
  } catch (error) {
    console.error("Password reset request error:", error);
    throw new Error("Failed to process password reset request");
  }
};


export const validateResetTokenService = async ({ token }) => {
  try {
    if (!token) {
      return { valid: false, message: "Invalid or expired reset token" };
    }


    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');


    const user = await Auth.findOne({
      resetToken: hashedToken,
      resetTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return { valid: false, message: "Invalid or expired reset token" };
    }

    return { 
      valid: true, 
      message: "Token is valid",
      email: user.email 
    };
  } catch (error) {
    console.error("Token validation error:", error);
    throw new Error("Failed to validate reset token");
  }
};


export const resetPasswordService = async ({ token, newPassword }) => {
  try {
    if (!token || !newPassword) {
      throw new Error("Token and new password are required");
    }

    if (newPassword.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

 
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await Auth.findOne({
      resetToken: hashedToken,
      resetTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      throw new Error("Invalid or expired reset token");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

   user.password = hashedPassword;
    
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    user.lastActivity = Date.now();
    await user.save();

 
    sendPasswordChangedConfirmation(user.email, user.name).catch(console.error);

    return { 
      success: true, 
      message: "Password has been reset successfully" 
    };
  } catch (error) {
    console.error("Password reset error:", error);
    throw error;
  }
};


