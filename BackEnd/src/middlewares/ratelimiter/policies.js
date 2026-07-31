/**
 * ===============================================================
 * Rate Limit Policies
 * ===============================================================
 *
 * Purpose
 * -------
 * This file contains ONLY configuration.
 *
 * No Express.
 * No Redis.
 * No Middleware.
 * No Controllers.
 *
 * Every API has its own policy.
 *
 * createLimiter() simply consumes these policies.
 *
 * ===============================================================
 */

import {
    MINUTE,
    FIVE_MINUTES,
    HOUR,
    DAY,
    PREFIX,
    DEFAULT_MESSAGES,
} from "./constants.js";

import {
    ipKey,
    userKey,
    emailIpKey,
    userIpKey,
} from "./keyGenerators.js";

/**
 * ===============================================================
 * AUTHENTICATION
 * ===============================================================
 */

export const LOGIN_POLICY = {
    policyName: "LOGIN",
    windowMs: MINUTE,
    max: 5,
    keyGenerator: emailIpKey(PREFIX.LOGIN),
    message: DEFAULT_MESSAGES.LOGIN,
};

export const SIGNUP_POLICY = {
    policyName: "SIGNUP",
    windowMs: HOUR,
    max: 5,
    keyGenerator: ipKey(PREFIX.SIGNUP),
    message: DEFAULT_MESSAGES.SIGNUP,
};

export const GOOGLE_LOGIN_POLICY = {
    policyName: "GOOGLE_LOGIN",
    windowMs: MINUTE,
    max: 15,
    keyGenerator: ipKey(PREFIX.GOOGLE_LOGIN),
    message: DEFAULT_MESSAGES.GOOGLE_LOGIN,
};

export const LINKEDIN_LOGIN_POLICY = {
    policyName: "LINKEDIN_LOGIN",
    windowMs: MINUTE,
    max: 15,
    keyGenerator: ipKey(PREFIX.LINKEDIN_LOGIN),
    message: DEFAULT_MESSAGES.LINKEDIN_LOGIN,
};

export const SEND_EMAIL_OTP_POLICY = {
    policyName: "SEND_EMAIL_OTP",
    windowMs: MINUTE,
    max: 3,
    keyGenerator: emailIpKey(PREFIX.OTP),
    message: DEFAULT_MESSAGES.OTP,
};

export const VERIFY_EMAIL_OTP_POLICY = {
    policyName: "VERIFY_EMAIL_OTP",
    windowMs: FIVE_MINUTES,
    max: 10,
    keyGenerator: emailIpKey(PREFIX.VERIFY_OTP),
    message: DEFAULT_MESSAGES.VERIFY_OTP,
};

export const FORGOT_PASSWORD_POLICY = {
    policyName: "FORGOT_PASSWORD",
    windowMs: HOUR,
    max: 5,
    keyGenerator: emailIpKey(PREFIX.RESET_PASSWORD),
    message: DEFAULT_MESSAGES.RESET_PASSWORD,
};

export const VALIDATE_RESET_TOKEN_POLICY = {
    policyName: "VALIDATE_RESET_TOKEN",
    windowMs: FIVE_MINUTES,
    max: 20,
    keyGenerator: ipKey(PREFIX.VALIDATE_RESET_TOKEN),
    message: DEFAULT_MESSAGES.VALIDATE_RESET_TOKEN,
};

export const RESET_PASSWORD_POLICY = {
    policyName: "RESET_PASSWORD",
    windowMs: HOUR,
    max: 5,
    keyGenerator: emailIpKey(PREFIX.RESET_PASSWORD),
    message: DEFAULT_MESSAGES.RESET_PASSWORD,
};

export const REFRESH_TOKEN_POLICY = {
    policyName: "REFRESH_TOKEN",
    windowMs: MINUTE,
    max: 30,
    keyGenerator: ipKey(PREFIX.REFRESH_TOKEN),
    message: "Too many refresh token requests.",
};

/**
 * ===============================================================
 * ACCOUNT
 * ===============================================================
 */

export const DELETE_ACCOUNT_POLICY = {
    policyName: "DELETE_ACCOUNT",
    windowMs: DAY,
    max: 2,
    keyGenerator: userKey(PREFIX.DELETE_ACCOUNT),
    message: DEFAULT_MESSAGES.DELETE_ACCOUNT,
};

export const DEVICE_TOKEN_POLICY = {
    policyName: "DEVICE_TOKEN",
    windowMs: FIVE_MINUTES,
    max: 10,
    keyGenerator: userKey(PREFIX.DEVICE_TOKEN),
    message: DEFAULT_MESSAGES.DEVICE_TOKEN,
};

/**
 * ===============================================================
 * USER PROFILE
 * ===============================================================
 */

export const PROFILE_UPDATE_POLICY = {
    policyName: "PROFILE_UPDATE",
    windowMs: HOUR,
    max: 30,
    keyGenerator: userKey(PREFIX.PROFILE),
    message: DEFAULT_MESSAGES.PROFILE,
};

/**
 * ===============================================================
 * RESUME
 * ===============================================================
 */

export const RESUME_UPLOAD_POLICY = {
    policyName: "RESUME_UPLOAD",
    windowMs: HOUR,
    max: 10,
    keyGenerator: userKey(PREFIX.RESUME),
    message: DEFAULT_MESSAGES.RESUME,
};

/**
 * ===============================================================
 * SEARCH
 * ===============================================================
 */

export const SEARCH_POLICY = {
    policyName: "SEARCH",
    windowMs: MINUTE,
    max: 500,
    keyGenerator: userKey(PREFIX.SEARCH),
    message: DEFAULT_MESSAGES.SEARCH,
};

/**
 * ===============================================================
 * CHAT
 * ===============================================================
 */

export const CHAT_POLICY = {
    policyName: "CHAT",
    windowMs: MINUTE,
    max: 60,
    keyGenerator: userIpKey(PREFIX.CHAT),
    message: DEFAULT_MESSAGES.CHAT,
};

/**
 * ===============================================================
 * UPLOADS
 * ===============================================================
 */

export const IMAGE_UPLOAD_POLICY = {
    policyName: "IMAGE_UPLOAD",
    windowMs: HOUR,
    max: 20,
    keyGenerator: userKey(PREFIX.IMAGE),
    message: DEFAULT_MESSAGES.IMAGE,
};

export const DOCUMENT_UPLOAD_POLICY = {
    policyName: "DOCUMENT_UPLOAD",
    windowMs: HOUR,
    max: 20,
    keyGenerator: userKey(PREFIX.DOCUMENT),
    message: DEFAULT_MESSAGES.DOCUMENT,
};

/**
 * ===============================================================
 * APPLICATIONS
 * ===============================================================
 */

export const APPLICATION_POLICY = {
    policyName: "APPLICATION",
    windowMs: HOUR,
    max: 30,
    keyGenerator: userKey(PREFIX.APPLICATION),
    message: DEFAULT_MESSAGES.APPLICATION,
};

/**
 * ===============================================================
 * SERVICE REQUESTS
 * ===============================================================
 */

export const SERVICE_REQUEST_POLICY = {
    policyName: "SERVICE_REQUEST",
    windowMs: HOUR,
    max: 10,
    keyGenerator: emailIpKey(PREFIX.SERVICE_REQUEST),
    message: DEFAULT_MESSAGES.SERVICE_REQUEST,
};

/**
 * ===============================================================
 * AI
 * ===============================================================
 */

export const AI_POLICY = {
    policyName: "AI",
    windowMs: MINUTE,
    max: 20,
    keyGenerator: userKey(PREFIX.AI),
    message: DEFAULT_MESSAGES.AI,
};

/**
 * ===============================================================
 * NOTIFICATIONS
 * ===============================================================
 */

export const NOTIFICATION_POLICY = {
    policyName: "NOTIFICATION",
    windowMs: MINUTE,
    max: 120,
    keyGenerator: userKey(PREFIX.NOTIFICATION),
    message: DEFAULT_MESSAGES.NOTIFICATION,
};

/**
 * ===============================================================
 * ADMIN
 * ===============================================================
 */

export const ADMIN_POLICY = {
    policyName: "ADMIN",
    windowMs: MINUTE,
    max: 300,
    keyGenerator: userKey(PREFIX.ADMIN),
    message: DEFAULT_MESSAGES.ADMIN,
};

export const MESSAGE_READ_POLICY = {
    policyName: "MESSAGE_READ",
    windowMs: MINUTE,
    max: 300,
    keyGenerator: userKey(PREFIX.MESSAGE),
    message: DEFAULT_MESSAGES.MESSAGE,
};

export const CHAT_SEND_POLICY = {
    policyName: "CHAT_SEND",
    windowMs: MINUTE,
    max: 60,
    keyGenerator: userIpKey(PREFIX.CHAT),
    message: "Too many messages sent. Please slow down.",
};

export const CONVERSATION_POLICY = {
    policyName: "CONVERSATION",
    windowMs: HOUR,
    max: 20,
    keyGenerator: userKey(PREFIX.CONVERSATION),
    message: DEFAULT_MESSAGES.CONVERSATION,
};

export const UNREAD_COUNT_POLICY = {
    policyName: "UNREAD_COUNT",
    windowMs: MINUTE,
    max: 120,
    keyGenerator: userKey(PREFIX.NOTIFICATION),
    message: DEFAULT_MESSAGES.UNREAD_COUNT,
};

export const USER_SEARCH_POLICY = {
    policyName: "USER_SEARCH",
    windowMs: MINUTE,
    max: 60,
    keyGenerator: userKey(PREFIX.SEARCH),
    message: DEFAULT_MESSAGES.USER_SEARCH,
};