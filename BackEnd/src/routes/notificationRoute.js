import express from 'express' ;
import secureRoute from '../middlewares/secureRouteMiddleware.js';
import { getNotifications, markAsRead } from '../controllers/teamMemberController.js';
import { getUnreadNotifications } from '../controllers/notificationController.js';
import {
    notificationLimiter,
    searchLimiter,
} from "../middlewares/ratelimiter/index.js";

const router = express.Router() ;

// ============================================================
// Notification Routes
// ============================================================

// GET all notifications - uses notificationLimiter (120 per minute)
router.get(
    '/',
    secureRoute,
    notificationLimiter,
    getNotifications
);

// PATCH mark notification as read - uses notificationLimiter (120 per minute)
router.patch(
    '/:id/read',
    secureRoute,
    notificationLimiter,
    markAsRead
);

// GET unread notifications - uses notificationLimiter (120 per minute)
router.get(
    '/unread',
    secureRoute,
    notificationLimiter,
    getUnreadNotifications
);

export default router;