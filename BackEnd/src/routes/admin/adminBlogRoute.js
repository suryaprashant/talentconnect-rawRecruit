import express from "express";
import {
  createBlog,
  updateBlog,
  deleteBlog,
  getUserBlogs,
} from "../../controllers/admin/adminBlogController.js";
import secureRoute from "../../middlewares/secureRouteMiddleware.js";
import upload from "../../utils/multer.js";
import {
  adminLimiter,
  deleteAccountLimiter,
  documentUploadLimiter,
} from "../../middlewares/ratelimiter/index.js";

const router = express.Router();

router.use(secureRoute);

// ============================================================
// Admin Blog Routes
// ============================================================

// POST create blog with image - uses documentUploadLimiter (20 per hour)
router.post("/", documentUploadLimiter, upload.single("image"), createBlog);

// PUT update blog with image - uses documentUploadLimiter (20 per hour)
router.put(
  "/:blogId",
  documentUploadLimiter,
  upload.single("image"),
  updateBlog,
);

router.get("/", adminLimiter, getUserBlogs);

router.delete("/:blogId", deleteAccountLimiter, deleteBlog);

export default router;
