import express from "express";
import { 
    // createHackathon, 
    getHackathons 
} from "../controllers/hackathon.controller.js";

const router=express.Router();

// api '.../hackathon'
router.get('/',getHackathons);
// router.post('/',createHackathon);

export default router;