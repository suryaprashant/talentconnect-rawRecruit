import express from "express";
import adminAuth from "../../middlewares/adminMiddleware.js";

const router = express.Router();

// Apply admin authentication 
// router.use(adminAuth); ---> commented for API testing purpose

// get reports of user status(active,pending,blocked)
router.get('/getOverView', getJobDriveOverView);

// get all users data 
// router.get('/getusers', getAllUsers);

export default router;
