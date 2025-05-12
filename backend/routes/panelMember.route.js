import express from 'express';
import {
  getPanelMembers,
  getPanelMember,
  createPanelMember,
  updatePanelMember,
  deletePanelMember
} from '../controllers/panelMember.js';

import upload from '../middlewares/upload.js';

// Here We have to use the middleware for the admin when signup part will  be done 


const router = express.Router();

// GET all panel members
router.get('/panel-members', getPanelMembers);

// GET a specific panel member by ID
router.get('/panel-members/:id', getPanelMember);

// POST a new panel member (with profile image upload)
router.post('/createPanel-member', upload.single('profileImage'), createPanelMember);

// PUT to update a specific panel member (with optional new profile image)
router.patch('/panel-members/:id', upload.single('profileImage'), updatePanelMember);

// DELETE a specific panel member
router.delete('/panel-members/:id', deletePanelMember);

export default router;
