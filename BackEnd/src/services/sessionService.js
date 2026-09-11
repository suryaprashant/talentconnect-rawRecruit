import crypto from "crypto";
import jwt from "jsonwebtoken";

import RefreshToken from "../models/refreshTokenModel.js";
import Auth from "../models/authModel.js";
import mongoose from "mongoose";

import { generateAccessToken, generateRefreshToken } from "./authService.js";

import {
  setAccessTokenCookie,
  setRefreshTokenCookie,
  clearAuthCookies,
} from "../utils/cookieUtils.js";

const isAppRequest = (req) => {
  return (
    req.body?.isApp === true ||
    req.body?.isApp === "true" ||
    req.headers["x-client-type"] === "app"
  );
};

const getRefreshTokenFromRequest = (req) => {
  if (req.cookies?.refreshToken) {
    return req.cookies.refreshToken;
  }

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }

  // App: body refresh token
  if (req.body?.refreshToken) {
    return req.body.refreshToken;
  }

  return null;
};

const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const verifyRefreshToken = (refreshToken) => {
  return jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
  );
};

export const createUserSession = async ({ user, req, res, session = null }) => {
  const isApp = isAppRequest(req);

  const accessToken = generateAccessToken({
    userId: user._id,
    email: user.email,
    userType: user.userType,
  });

  const refreshToken = generateRefreshToken({
    userId: user._id,
  });

  const tokenHash = hashToken(refreshToken);

  const tokenData = {
    userId: user._id,
    tokenHash,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    userAgent: req.get("user-agent") || "",
    ipAddress: req.ip,
  };

  // Create refresh token inside transaction
  if (session) {
    const tokens = await RefreshToken.create([tokenData], { session });
  } else {
    // Normal usage without transaction
    await RefreshToken.create(tokenData);
  }

  // Cookies are NOT part of MongoDB transaction
  if (!isApp) {
    setAccessTokenCookie(res, accessToken);
    setRefreshTokenCookie(res, refreshToken);
  }

  return {
    success: true,
    accessToken,
    refreshToken: isApp ? refreshToken : undefined,
  };
};

export const refreshUserSession = async ({ req, res }) => {
  const refreshToken = getRefreshTokenFromRequest(req);

  if (!refreshToken) {
    throw new Error("Refresh token missing");
  }

  let decoded;

  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw new Error("Invalid or expired refresh token");
  }

  const tokenHash = hashToken(refreshToken);

  // ==========================================
  // 1. FIND OLD REFRESH TOKEN
  // ==========================================

  const storedToken = await RefreshToken.findOne({
    tokenHash,
    userId: decoded.userId,
  });

  if (!storedToken) {
    throw new Error("Refresh token not found");
  }

  // ==========================================
  // 2. CHECK EXPIRATION
  // ==========================================

  if (storedToken.expiresAt && storedToken.expiresAt < new Date()) {
    await RefreshToken.deleteOne({
      _id: storedToken._id,
    });

    throw new Error("Refresh token expired");
  }

  // ==========================================
  // 3. FIND USER
  // ==========================================

  const user = await Auth.findById(decoded.userId).select("-password");

  if (!user) {
    await RefreshToken.deleteOne({
      _id: storedToken._id,
    });

    throw new Error("User not found");
  }

  // ==========================================
  // 4. START MONGODB TRANSACTION
  // ==========================================

  const dbSession = await mongoose.startSession();

  let newSession;

  try {
    await dbSession.withTransaction(async () => {
      // ========================================
      // 5. DELETE OLD REFRESH TOKEN
      // ========================================

      await RefreshToken.deleteOne(
        {
          _id: storedToken._id,
        },
        {
          session: dbSession,
        },
      );

      // ========================================
      // 6. CREATE NEW REFRESH TOKEN
      // ========================================

      newSession = await createUserSession({
        user,
        req,
        res,
        session: dbSession,
      });
    });

    // ==========================================
    // 7. TRANSACTION COMMITTED
    // ==========================================

    return newSession;
  } finally {
    // ==========================================
    // 8. CLOSE SESSION
    // ==========================================

    await dbSession.endSession();
  }
};

export const destroyUserSession = async ({ req, res }) => {
  const refreshToken = getRefreshTokenFromRequest(req);

  if (refreshToken) {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      const tokenHash = hashToken(refreshToken);

      await RefreshToken.deleteOne({
        userId: decoded.userId,
        tokenHash,
      });
    } catch (err) {
      console.warn("Refresh token cleanup skipped:", err.message);
    }
  }

  /**
   * Safe for both web and app.
   * For app, cookies may not exist, but clearing is harmless.
   */
  clearAuthCookies(res);

  return {
    success: true,
  };
};
