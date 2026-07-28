import express from 'express';
import secureRoute from '../middlewares/secureRouteMiddleware.js';
import {
  registerParticipant,
  getAllParticipants,
  getParticipantsByEvent,
  updateParticipant,
  deleteParticipant,
  getByParticipantId,
  updateInputType
} from '../controllers/eventParticipationController.js';
import {
    searchLimiter,
    applicationLimiter,
    profileUpdateLimiter,
    deleteAccountLimiter,
} from "../middlewares/ratelimiter/index.js";

const router = express.Router();

// ============================================================
// Event Participation Routes
// ============================================================

// @desc    Get all participants
// @route   GET /eventParticipation
router.get(
    '/',
    searchLimiter,
    getAllParticipants
);

// GET participant by ID - uses searchLimiter (60 per minute)
router.get(
    '/byParticipent',
    secureRoute,
    searchLimiter,
    getByParticipantId
);

// @desc    Get participants by event ID
// GET /eventParticipation/:eventID
router.get(
    '/:eventID',
    searchLimiter,
    getParticipantsByEvent
);

// POST register participant - uses applicationLimiter (30 per hour)
router.post(
    '/register',
    secureRoute,
    applicationLimiter,
    registerParticipant
);

// POST update input type - uses profileUpdateLimiter (30 per hour)
router.post(
    '/updateInputType',
    profileUpdateLimiter,
    updateInputType
);

// PUT update participant - uses profileUpdateLimiter (30 per hour)
router.put(
    '/update/:id',
    profileUpdateLimiter,
    updateParticipant
);

// DELETE participant - uses deleteAccountLimiter (2 per day)
router.delete(
    '/delete/:id',
    deleteAccountLimiter,
    deleteParticipant
);

export default router;