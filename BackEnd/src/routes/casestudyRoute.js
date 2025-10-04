import express from "express";
import { 
    createCasestudy, 
    getCasestudies,
    getCasestudy,
    updateCasestudy,
    deleteCasestudy
} from "../controllers/casestudyController.js";
import secureRoute from "../middlewares/secureRouteMiddleware.js";

const router=express.Router();

// api '.../casestudy'
router.get('/',getCasestudies);
router.get('/:id',getCasestudy);
router.post('/create', secureRoute, createCasestudy);
router.put('/:id', secureRoute, updateCasestudy);
router.delete('/:id', secureRoute, deleteCasestudy);

export default router;
