import express from "express";
import { 
    createCasestudy, 
    getCasestudies,
    getCasestudy,
    updateCasestudy,
    deleteCasestudy
} from "../controllers/casestudyController.js";

const router=express.Router();

// api '.../casestudy'
router.get('/',getCasestudies);
router.get('/:id',getCasestudy);
router.post('/create', createCasestudy);
router.put('/:id', updateCasestudy);
router.delete('/:id', deleteCasestudy);

export default router;
