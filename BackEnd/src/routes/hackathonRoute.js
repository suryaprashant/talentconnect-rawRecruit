import express from "express";
import { 
    createHackathon, 
    getHackathons,
    getHackathon,
    updateHackathon,
    deleteHackathon
} from "../controllers/hackathonController.js";

const router=express.Router();

// api '.../hackathon'
router.get('/',getHackathons);
router.get('/:id',getHackathon);
router.post('/create', createHackathon);
router.put('/:id', updateHackathon);
router.delete('/:id', deleteHackathon);

export default router;