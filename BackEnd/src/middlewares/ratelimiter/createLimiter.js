import rateLimit from "express-rate-limit";

import { createRedisStore } from "./redisStore.js";

import { createRateLimitHandler } from "./responses.js";

import { logRateLimit } from "./logger.js";

import { DEFAULT_LIMIT, RATE_LIMIT_HEADERS } from "./constants.js";

export const createLimiter = (policy = {}) => {
  const {
    policyName = "UNKNOWN",

    windowMs = DEFAULT_LIMIT.windowMs,

    max = DEFAULT_LIMIT.max,

    keyGenerator,

    message = "Too many requests.",

    skipSuccessfulRequests = false,

    skipFailedRequests = false,
  } = policy;

  return rateLimit({
    windowMs,

    max,

    store: createRedisStore(policyName.toLowerCase()),

    standardHeaders: RATE_LIMIT_HEADERS.standardHeaders,

    legacyHeaders: RATE_LIMIT_HEADERS.legacyHeaders,

    keyGenerator,

    skipSuccessfulRequests,

    skipFailedRequests,

    handler: (req, res) => {
      const retryAfter = Number(res.getHeader("Retry-After")) || null;

      logRateLimit({
        req,

        policyName,

        retryAfter,
      });

      return createRateLimitHandler({
        message,
      })(req, res);
    },
  });
};

export default createLimiter;
