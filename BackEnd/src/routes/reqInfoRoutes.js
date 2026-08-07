import express from 'express';
import reqInfoController from '../controllers/reqInfoController.js';
import { searchLimiter } from '../middlewares/ratelimiter/index.js';
import  adminAuth  from '../middlewares/adminMiddleware.js';

const router = express.Router();

router.post('/reqinfo', searchLimiter, reqInfoController.createRequest);

router.get('/all', adminAuth,  searchLimiter , reqInfoController.getAllRequests);
router.get('/stats', adminAuth,  searchLimiter , reqInfoController.getStats);
router.get('/:id', adminAuth,  searchLimiter , reqInfoController.getRequestById);
router.put('/:id/reject', adminAuth,  searchLimiter , reqInfoController.rejectRequest);
router.put('/:id/resolve', adminAuth,  searchLimiter , reqInfoController.resolveRequest);
router.delete('/:id', adminAuth,  searchLimiter , reqInfoController.deleteRequest);

export default router;