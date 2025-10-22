import express from "express";
import adminAuth from "../../middlewares/adminMiddleware.js";
import {
    getUserBoardOverView,
    getAllUsers,
} from "../../controllers/admin/userManagementController.js"

const router = express.Router();

// Apply admin authentication 
// router.use(adminAuth); ---> commented for API testing purpose

// get reports of user status(active,pending,blocked)
router.get('/overviewdata', getUserBoardOverView);

// get all users data 
router.get('/getrelationdata', getAllUsers);

export default router;
