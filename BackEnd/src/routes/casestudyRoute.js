import express from "express";
import { 
    createCasestudy, 
    getCasestudies,
    getCasestudy,
    updateCasestudy,
    deleteCasestudy
} from "../controllers/casestudyController.js";
import secureRoute from "../middlewares/secureRouteMiddleware.js";
import upload from "../utils/multer.js";

const router=express.Router();

// api '.../casestudy'
router.get('/',getCasestudies);
router.get('/:id',getCasestudy);
router.post('/create', secureRoute, upload.single('file'), createCasestudy);
router.put('/:id', secureRoute, upload.single('file'), updateCasestudy);
router.delete('/:id', secureRoute, deleteCasestudy);

export default router;
