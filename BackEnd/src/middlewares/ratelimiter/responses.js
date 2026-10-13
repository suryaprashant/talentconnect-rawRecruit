

import {
    RATE_LIMIT_ERROR_CODE,
    RATE_LIMIT_STATUS,
} from "./constants.js";

/**
 * ===============================================================
 * Create Rate Limit Handler
 * ===============================================================
 *
 * @param {Object} options
 * @param {string} options.message
 *
 * Returns Express middleware handler used by express-rate-limit.
 */

export const createRateLimitHandler = ({ message }) => {

    return (req, res) => {

        
        const retryAfter = Number(res.getHeader("Retry-After")) || null;

        return res.status(RATE_LIMIT_STATUS).json({

            success: false,

            error: RATE_LIMIT_ERROR_CODE,

            message,

            retryAfter,

            timestamp: new Date().toISOString(),

        });

    };

};



export const defaultRateLimitHandler =
    createRateLimitHandler({
        message: "Too many requests. Please try again later.",
    });