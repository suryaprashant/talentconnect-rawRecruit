export const SECOND = 1000;
export const MINUTE = 60 * SECOND;
export const FIVE_MINUTES = 5 * MINUTE;
export const FIFTEEN_MINUTES = 15 * MINUTE;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;

export const RATE_LIMIT_HEADERS = {
  standardHeaders: true,
  legacyHeaders: false,
};

export const RATE_LIMIT_STATUS = 429;
export const RATE_LIMIT_ERROR_CODE = "RATE_LIMIT_EXCEEDED";

export const PREFIX = {
  LOGIN: "login",
  SIGNUP: "signup",
  OTP: "otp",
  VERIFY_OTP: "verify-otp",
  REFRESH_TOKEN: "refresh-token",
  RESET_PASSWORD: "reset-password",
  PROFILE: "profile",
  SEARCH: "search",
  CHAT: "chat",
  RESUME: "resume",
  IMAGE: "image",
  DOCUMENT: "document",
  ADMIN: "admin",
  GOOGLE_LOGIN: "google-login",
  LINKEDIN_LOGIN: "linkedin-login",
  VALIDATE_RESET_TOKEN: "validate-reset-token",
  DELETE_ACCOUNT: "delete-account",
  DEVICE_TOKEN: "device-token",
  APPLICATION: "application",
  SERVICE_REQUEST: "service-request",
  AI: "ai",
  NOTIFICATION: "notification",
  MESSAGE: "message",
  CONVERSATION: "conversation",
  UNREAD_COUNT: "unread-count",
  USER_SEARCH: "user-search",
};

export const DEFAULT_MESSAGES = {
  LOGIN: "Too many login attempts. Please try again later.",
  SIGNUP: "Too many signup attempts. Please try again later.",
  OTP: "Too many OTP requests. Please wait before requesting another OTP.",
  VERIFY_OTP: "Too many OTP verification attempts.",
  RESET_PASSWORD: "Too many password reset attempts.",
  PROFILE: "Too many profile update requests.",
  SEARCH: "Search limit exceeded.",
  CHAT: "Message rate limit exceeded.",
  RESUME: "Resume upload limit exceeded.",
  IMAGE: "Image upload limit exceeded.",
  DOCUMENT: "Document upload limit exceeded.",
  ADMIN: "Too many admin requests.",
  GOOGLE_LOGIN: "Too many Google login requests. Please try again later.",
  LINKEDIN_LOGIN: "Too many LinkedIn login requests. Please try again later.",
  VALIDATE_RESET_TOKEN: "Too many token validation requests.",
  DELETE_ACCOUNT: "Delete account request limit exceeded.",
  DEVICE_TOKEN: "Too many device token update requests.",
  APPLICATION: "Too many application requests. Please try again later.",
  SERVICE_REQUEST: "Too many service requests. Please try again later.",
  AI: "Too many AI requests. Please try again later.",
  NOTIFICATION: "Too many notification requests. Please try again later.",
  MESSAGE: "Too many message fetch requests. Please slow down.",
  CONVERSATION: "Too many conversation creation requests. Please try again later.",
  UNREAD_COUNT: "Too many unread count requests. Please slow down.",
  USER_SEARCH: "Too many user search requests. Please slow down.",
};

export const DEFAULT_LIMIT = {
  windowMs: MINUTE,
  max: 100,
};

export const REDIS_NAMESPACE = "rl";