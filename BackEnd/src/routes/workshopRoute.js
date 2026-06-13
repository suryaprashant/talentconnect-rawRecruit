import express from "express";
import { 
    createWorkshop, 
    getWorkshops,
    getWorkshop,
    updateWorkshop,
    deleteWorkshop
} from "../controllers/workshopController.js";
import secureRoute from "../middlewares/secureRouteMiddleware.js";

const router = express.Router();

// Base route: '/api/hosting/workshop'
router.post('/create', secureRoute, createWorkshop);
router.get('/', getWorkshops);
router.get('/:id', getWorkshop);
router.put('/:id', secureRoute, updateWorkshop);
router.delete('/:id', secureRoute, deleteWorkshop);

export default router;
