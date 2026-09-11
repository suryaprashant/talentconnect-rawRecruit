/**
 * ===============================================================
 * Rate Limit Logger
 * ===============================================================
 *
 * Purpose
 * -------
 * Logs every blocked request.
 *
 * Initially this logs to console.
 *
 * Later you can replace console.log with:
 *
 * • Winston
 * • Pino
 * • CloudWatch
 * • Grafana Loki
 * • ELK Stack
 * • Datadog
 *
 * without changing createLimiter.js
 *
 * ===============================================================
 */

export const logRateLimit = ({
    req,
    policyName = "UNKNOWN",
    retryAfter = null,
}) => {

    const log = {

        timestamp: new Date().toISOString(),

        policy: policyName,

        method: req.method,

        route: req.originalUrl,

        ip:
            req.ip ||
            req.socket?.remoteAddress ||
            "unknown-ip",

        userId:
            req.user?.id ||
            req.user?._id ||
            "guest",

        userAgent:
            req.get("user-agent"),

        retryAfter,

    };

    console.warn(
        "[RATE LIMIT]",
        JSON.stringify(log, null, 2)
    );

};