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

const router = express.Router();

// @desc    Get all participants
// @route   GET /eventParticipation
router.get('/', getAllParticipants);

router.get('/byParticipent',secureRoute, getByParticipantId);

// @desc    Get participants by event ID
// GET /eventParticipation/:eventID
router.get('/:eventID', getParticipantsByEvent);

router.post('/register',secureRoute, registerParticipant);
router.post('/updateInputType',updateInputType)

router.put('/update/:id', updateParticipant);


router.delete('/delete/:id', deleteParticipant);

export default router;
