import createLimiter from "./createLimiter.js";

import {
  // Authentication
  LOGIN_POLICY,
  SIGNUP_POLICY,
  GOOGLE_LOGIN_POLICY,
  LINKEDIN_LOGIN_POLICY,
  SEND_EMAIL_OTP_POLICY,
  VERIFY_EMAIL_OTP_POLICY,
  FORGOT_PASSWORD_POLICY,
  VALIDATE_RESET_TOKEN_POLICY,
  RESET_PASSWORD_POLICY,
  REFRESH_TOKEN_POLICY,

  // Account
  DELETE_ACCOUNT_POLICY,
  DEVICE_TOKEN_POLICY,

  // User
  PROFILE_UPDATE_POLICY,

  // Resume
  RESUME_UPLOAD_POLICY,

  // Search
  SEARCH_POLICY,

  // Chat
  CHAT_POLICY,

  // Upload
  IMAGE_UPLOAD_POLICY,
  DOCUMENT_UPLOAD_POLICY,

  // Applications
  APPLICATION_POLICY,

  // Service Requests
  SERVICE_REQUEST_POLICY,

  // AI
  AI_POLICY,

  // Notification
  NOTIFICATION_POLICY,

  // Admin
  ADMIN_POLICY,
  MESSAGE_READ_POLICY,
  CHAT_SEND_POLICY,
  CONVERSATION_POLICY,
  UNREAD_COUNT_POLICY,
  USER_SEARCH_POLICY,
} from "./policies.js";

/* ===============================================================
 * Authentication
 * =============================================================== */

export const loginLimiter = createLimiter(LOGIN_POLICY);

export const signupLimiter = createLimiter(SIGNUP_POLICY);

export const googleLoginLimiter = createLimiter(GOOGLE_LOGIN_POLICY);

export const linkedInLoginLimiter = createLimiter(LINKEDIN_LOGIN_POLICY);

export const sendEmailOtpLimiter = createLimiter(SEND_EMAIL_OTP_POLICY);

export const verifyEmailOtpLimiter = createLimiter(VERIFY_EMAIL_OTP_POLICY);

export const forgotPasswordLimiter = createLimiter(FORGOT_PASSWORD_POLICY);

export const validateResetTokenLimiter = createLimiter(
  VALIDATE_RESET_TOKEN_POLICY,
);

export const resetPasswordLimiter = createLimiter(RESET_PASSWORD_POLICY);

export const refreshTokenLimiter = createLimiter(REFRESH_TOKEN_POLICY);

/* ===============================================================
 * Account
 * =============================================================== */

export const deleteAccountLimiter = createLimiter(DELETE_ACCOUNT_POLICY);

export const deviceTokenLimiter = createLimiter(DEVICE_TOKEN_POLICY);

/* ===============================================================
 * User
 * =============================================================== */

export const profileUpdateLimiter = createLimiter(PROFILE_UPDATE_POLICY);

/* ===============================================================
 * Resume
 * =============================================================== */

export const resumeUploadLimiter = createLimiter(RESUME_UPLOAD_POLICY);

/* ===============================================================
 * Search
 * =============================================================== */

export const searchLimiter = createLimiter(SEARCH_POLICY);

/* ===============================================================
 * Chat
 * =============================================================== */

export const chatLimiter = createLimiter(CHAT_POLICY);

/* ===============================================================
 * Uploads
 * =============================================================== */

export const imageUploadLimiter = createLimiter(IMAGE_UPLOAD_POLICY);

export const documentUploadLimiter = createLimiter(DOCUMENT_UPLOAD_POLICY);

/* ===============================================================
 * Applications
 * =============================================================== */

export const applicationLimiter = createLimiter(APPLICATION_POLICY);

/* ===============================================================
 * Service Requests
 * =============================================================== */

export const serviceRequestLimiter = createLimiter(SERVICE_REQUEST_POLICY);

/* ===============================================================
 * AI
 * =============================================================== */

export const aiLimiter = createLimiter(AI_POLICY);

/* ===============================================================
 * Notifications
 * =============================================================== */

export const notificationLimiter = createLimiter(NOTIFICATION_POLICY);

/* ===============================================================
 * Admin
 * =============================================================== */

export const adminLimiter = createLimiter(ADMIN_POLICY);

export const messageReadLimiter = createLimiter(MESSAGE_READ_POLICY);

export const chatSendLimiter = createLimiter(CHAT_SEND_POLICY);

export const conversationLimiter = createLimiter(CONVERSATION_POLICY);

export const unreadCountLimiter = createLimiter(UNREAD_COUNT_POLICY);

export const userSearchLimiter = createLimiter(USER_SEARCH_POLICY);

/* ===============================================================
 * Default Export
 * =============================================================== */

export default {
  // Authentication
  loginLimiter,
  signupLimiter,
  googleLoginLimiter,
  linkedInLoginLimiter,
  sendEmailOtpLimiter,
  verifyEmailOtpLimiter,
  forgotPasswordLimiter,
  validateResetTokenLimiter,
  resetPasswordLimiter,
  refreshTokenLimiter,

  // Account
  deleteAccountLimiter,
  deviceTokenLimiter,

  // User
  profileUpdateLimiter,

  // Resume
  resumeUploadLimiter,

  // Search
  searchLimiter,

  // Chat
  chatLimiter,

  // Uploads
  imageUploadLimiter,
  documentUploadLimiter,

  // Applications
  applicationLimiter,

  // Service Requests
  serviceRequestLimiter,

  // AI
  aiLimiter,

  // Notifications
  notificationLimiter,

  // Admin
  adminLimiter,

  //message
  messageReadLimiter,

  chatSendLimiter,

  conversationLimiter,

  unreadCountLimiter,

  userSearchLimiter,
};
