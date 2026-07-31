/**
 * ===============================================================
 * Rate Limit Key Generators
 * ===============================================================
 *
 * Purpose:
 * --------
 * Every API should identify the client differently.
 *
 * Examples:
 *
 * Login
 * ------
 * Key = IP Address
 *
 * OTP
 * ----
 * Key = Email + IP
 *
 * Chat
 * -----
 * Key = User ID
 *
 * Resume Upload
 * -------------
 * Key = User ID
 *
 * Admin APIs
 * ----------
 * Key = Admin User ID
 *
 * Search
 * -------
 * Key = User ID
 *
 * Why?
 *
 * We don't want createLimiter() to know
 * HOW keys are generated.
 *
 * It only receives a function.
 *
 * ===============================================================
 */

import { PREFIX, REDIS_NAMESPACE } from "./constants.js";

/**
 * ===============================================================
 * Safely extract client IP
 * ===============================================================
 *
 * app.set("trust proxy", 1)
 *
 * Express automatically fills req.ip.
 */

const getIp = (req) => {
  return req.ip || req.socket?.remoteAddress || "unknown-ip";
};

/**
 * ===============================================================
 * IP Based
 * ===============================================================
 *
 * Used For:
 *
 * Login
 * Signup
 * Public APIs
 *
 * Example Redis Key
 *
 * rl:login:103.25.10.5
 */

export const ipKey = (prefix = PREFIX.PUBLIC) => {
  return (req) => {
    return `${REDIS_NAMESPACE}:${prefix}:${getIp(req)}`;
  };
};

/**
 * ===============================================================
 * User Based
 * ===============================================================
 *
 * Used After Authentication
 *
 * Example
 *
 * rl:profile:64ab812
 */

export const userKey = (prefix) => {
  return (req) => {
    const userId = req.user?.id || req.user?._id;

    return `${REDIS_NAMESPACE}:${prefix}:${userId || getIp(req)}`;
  };
};

/**
 * ===============================================================
 * Email Based
 * ===============================================================
 *
 * Used For:
 *
 * OTP
 * Forgot Password
 *
 * Example
 *
 * rl:otp:test@gmail.com
 */

export const emailKey = (prefix) => {
  return (req) => {
    const email = req.body?.email?.trim()?.toLowerCase();

    return `${REDIS_NAMESPACE}:${prefix}:${email || getIp(req)}`;
  };
};

// /**
//  * ===============================================================
//  * Phone Based
//  * ===============================================================
//  *
//  * Used when OTP is mobile based.
//  *
//  * Example
//  *
//  * rl:otp:9876543210
//  */

// export const phoneKey = (prefix) => {

//     return (req) => {

//         const phone = req.body?.phone;

//         return `${REDIS_NAMESPACE}:${prefix}:${phone || getIp(req)}`;

//     };

// };

/**
 * ===============================================================
 * Email + IP
 * ===============================================================
 *
 * Recommended For
 *
 * OTP APIs
 *
 * Example
 *
 * rl:otp:test@gmail.com:103.12.11.4
 */

export const emailIpKey = (prefix) => {
  return (req) => {
    const email =
      typeof req.body?.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "unknown-email";

    return `${REDIS_NAMESPACE}:${prefix}:${email}:${getIp(req)}`;
  };
};

/**
 * ===============================================================
 * User + IP
 * ===============================================================
 *
 * Recommended For
 *
 * Chat
 *
 * Prevents abuse if JWT is leaked.
 *
 * Example
 *
 * rl:chat:64ab812:103.25.12.1
 */

export const userIpKey = (prefix) => {
  return (req) => {
    const userId = req.user?.id || req.user?._id || "guest";

    return `${REDIS_NAMESPACE}:${prefix}:${userId}:${getIp(req)}`;
  };
};

/**
 * ===============================================================
 * Admin
 * ===============================================================
 *
 * Used For
 *
 * Admin Dashboard APIs
 */

export const adminKey = (prefix = PREFIX.ADMIN) => {
  return (req) => {
    const adminId = req.user?.id || req.user?._id || "admin";

    return `${REDIS_NAMESPACE}:${prefix}:${adminId}`;
  };
};

/**
 * ===============================================================
 * Company Based
 * ===============================================================
 *
 * Future Ready
 *
 * Employer Dashboard
 */

export const companyKey = (prefix) => {
  return (req) => {
    const companyId =
      req.user?.companyId || req.body?.companyId || "unknown-company";

    return `${REDIS_NAMESPACE}:${prefix}:${companyId}`;
  };
};

/**
 * ===============================================================
 * Custom Key Generator
 * ===============================================================
 *
 * Useful when APIs require custom logic.
 *
 * Example
 *
 * createLimiter({
 *
 * keyGenerator:
 * customKey(prefix,(req)=>req.body.slug)
 *
 * })
 */

export const customKey = (prefix, callback) => {
  return (req) => {
    const key = callback(req);

    return `${REDIS_NAMESPACE}:${prefix}:${key}`;
  };
};
