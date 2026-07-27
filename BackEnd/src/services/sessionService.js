import crypto from "crypto";
import jwt from "jsonwebtoken";

import RefreshToken from "../models/refreshTokenModel.js";
import Auth from "../models/authModel.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "./authService.js";

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
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
  );
};

export const createUserSession = async ({ user, req, res }) => {
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

  await RefreshToken.create({
    userId: user._id,
    tokenHash,
    expiresAt: new Date(Date.now() + 3 * 60 * 1000),
    userAgent: req.get("user-agent") || "",
    ipAddress: req.ip,
  });

  
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

  const storedToken = await RefreshToken.findOne({
    tokenHash,
    userId: decoded.userId,
  });

  if (!storedToken) {
    throw new Error("Refresh token not found");
  }

  if (storedToken.expiresAt && storedToken.expiresAt < new Date()) {
    await RefreshToken.deleteOne({
      _id: storedToken._id,
    });

    throw new Error("Refresh token expired");
  }

  const user = await Auth.findById(decoded.userId).select("-password");

  if (!user) {
    await RefreshToken.deleteOne({
      _id: storedToken._id,
    });

    throw new Error("User not found");
  }

  /**
   * Refresh token rotation:
   * Delete old refresh token session and create a new one.
   */
  await RefreshToken.deleteOne({
    _id: storedToken._id,
  });

  return await createUserSession({
    user,
    req,
    res,
  });
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