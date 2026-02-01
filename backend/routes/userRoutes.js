import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { avatarUpload } from "../middleware/uploadMiddleware.js"; // ✅ FIX
import { uploadAvatar } from "../controllers/userController.js";

const router = express.Router();

router.put(
  "/avatar",
  protect,
  avatarUpload.single("avatar"), // ✅ CORRECT
  uploadAvatar
);

export default router;
