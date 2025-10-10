import express from "express";
import { 
    createHackathon, 
    getHackathons,
    getHackathon,
    updateHackathon,
    deleteHackathon
} from "../controllers/hackathonController.js";
import secureRoute from "../middlewares/secureRouteMiddleware.js";

const router=express.Router();

// api '.../hackathon'
router.get('/',getHackathons);
router.get('/:id',getHackathon);
router.post('/create', secureRoute, createHackathon);
router.put('/:id', secureRoute, updateHackathon);
router.delete('/:id', secureRoute, deleteHackathon);

export default router;