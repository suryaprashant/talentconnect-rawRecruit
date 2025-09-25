import express from 'express';
import secureRoute from '../middlewares/secureRouteMiddleware.js';
import {
  registerParticipant,
  getAllParticipants,
  getParticipantsByEvent,
  updateParticipant,
  deleteParticipant
} from '../controllers/eventParticipationController.js';

const router = express.Router();

// @desc    Get all participants
// @route   GET /eventParticipation
router.get('/', getAllParticipants);

// @desc    Get participants by event ID
// GET /eventParticipation/:eventID
router.get('/:eventID', getParticipantsByEvent);

// @desc    Register a new participant
// @route   POST /eventParticipation/register
router.post('/register',secureRoute, registerParticipant);

// @desc    Update participant by ID
// @route   PUT /eventParticipation/update/:id
router.put('/update/:id', updateParticipant);

// @desc    Delete participant by ID
// @route   DELETE /eventParticipation/delete/:id
router.delete('/delete/:id', deleteParticipant);

export default router;
