import express from "express";
import {
  createBlog,
  updateBlog,
  deleteBlog
} from "../../controllers/admin/adminBlogController.js";
import adminAuth from "../../middlewares/adminMiddleware.js";
import upload from "../../utils/multer.js";

const router = express.Router();

router.use(adminAuth);

// Admin APIs
router.post("/", upload.single("image"), createBlog);
router.put("/:blogId", upload.single("image"), updateBlog);
router.delete("/:blogId", deleteBlog);

export default router;