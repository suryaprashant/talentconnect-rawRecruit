import express from 'express'
const router = express.Router();
import * as metaController from '../controllers/metaController.js';

// GET /api/meta
router.get('/', metaController.getJobMetadata);

// POST /api/meta/add
router.post('/add', metaController.addMetadata);

export default router; 