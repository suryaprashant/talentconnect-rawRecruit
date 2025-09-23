import express from "express";
import { 
    createWorkshop, 
    getWorkshops,
    getWorkshop,
    updateWorkshop,
    deleteWorkshop
} from "../controllers/workshopController.js";

const router = express.Router();

// Base route: '/workshop'
router.post('/create', createWorkshop);
router.get('/', getWorkshops);
router.get('/:id', getWorkshop);
router.put('/:id', updateWorkshop);
router.delete('/:id', deleteWorkshop);

export default router;
