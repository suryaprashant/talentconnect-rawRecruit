import express from 'express';
import {
  getHackathons,
  getHackathon,
  createHackathon,
  updateHackathon,
  deleteHackathon,
  addPanelMember
} from '../controllers/hackathon.controller.js';

import upload from '../middlewares/upload.js';

// Here We have to use the middleware for the admin 

const router = express.Router();

// GET all hackathons
router.get('/gethackathons', getHackathons);

// GET a specific hackathon by ID
router.get('/hackathons/:id', getHackathon);

// POST a new hackathon (with banner image upload)
router.post('/createhackathons', upload.single('bannerImage'), createHackathon);

// PUT to update a specific hackathon by ID (with optional new banner image)
router.patch('/updatehackathons/:id', upload.single('bannerImage'), updateHackathon);

// DELETE a specific hackathon by ID
router.delete('/hackathons/:id', deleteHackathon);

// PUT to add a panel member to a specific hackathon
router.put('/hackathons/:id/panel-members/:memberId', addPanelMember);

export default router;
