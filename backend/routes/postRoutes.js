import express from "express";
import {
  createPost,
  getPosts,
  toggleLike,
  editPost,
  deletePost,
  addComment
} from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";
import { postUpload } from "../middleware/uploadMiddleware.js"; // ✅ FIX

const router = express.Router();

/* ======================
   POSTS
====================== */

// Create post with image/video/pdf
router.post(
  "/",
  protect,
  postUpload.single("image"), // ✅ CORRECT MULTER
  createPost
);

// Get feed posts
router.get("/", protect, getPosts);

// Like / unlike
router.put("/:id/like", protect, toggleLike);

// Edit post
router.put("/:id", protect, editPost);

// Delete post
router.delete("/:id", protect, deletePost);

// Add comment
router.post("/:id/comments", protect, addComment);

export default router;
