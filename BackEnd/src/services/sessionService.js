import crypto from "crypto";

import RefreshToken from "../models/refreshTokenModel.js";

import jwt from "jsonwebtoken";
import Auth from "../models/authModel.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "./authService.js";

import {
  setAccessTokenCookie,
  setRefreshTokenCookie,
  clearAuthCookies
} from "../utils/cookieUtils.js";

export const createUserSession = async ({
  user,
  req,
  res,
}) => {
  // Generate tokens
  const accessToken = generateAccessToken({
    userId: user._id,
    email: user.email,
    userType: user.userType,
  });

  

  const refreshToken = generateRefreshToken({
    userId: user._id,
  });

  // Hash refresh token before storing
  const tokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  // Save refresh session
  await RefreshToken.create({
    userId: user._id,
    tokenHash,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    userAgent: req.get("user-agent"),
    ipAddress: req.ip,
  });

  // Set cookies
  setAccessTokenCookie(res, accessToken);
  setRefreshTokenCookie(res, refreshToken);

  return {
    accessToken,
    refreshToken,
  };
};

export const refreshUserSession = async ({ req, res }) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    throw new Error("Refresh token missing");
  }

 

  // Verify refresh token
  const decoded = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
  );

  // Hash incoming refresh token
  const tokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  // Find refresh session
  const storedToken = await RefreshToken.findOne({
    tokenHash,
    userId: decoded.userId,
  });

  if (!storedToken) {
    throw new Error("Refresh token not found");
  }

  // Fetch user
  const user = await Auth.findById(decoded.userId).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  // Rotation
  await RefreshToken.deleteOne({
    _id: storedToken._id,
  });

  // Create completely new session
  return await createUserSession({
    user,
    req,
    res,
  });
};

export const destroyUserSession = async ({ req, res }) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    // If refresh cookie exists, delete only that session
    if (refreshToken) {
      try {
        const decoded = jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
        );

        const tokenHash = crypto
          .createHash("sha256")
          .update(refreshToken)
          .digest("hex");

        await RefreshToken.deleteOne({
          userId: decoded.userId,
          tokenHash,
        });
      } catch (err) {
        // Ignore invalid/expired refresh token.
        // We still want to clear cookies.
        console.warn("Refresh token cleanup skipped:", err.message);
      }
    }

    clearAuthCookies(res);

    return {
      success: true,
    };
  } catch (error) {
    throw error;
  }
};