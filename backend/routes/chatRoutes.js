import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  accessChat,
  fetchChats
} from "../controllers/chatController.js";

const router = express.Router();

// Create or get 1-to-1 chat
router.post("/", protect, accessChat);

// Get all chats for user
router.get("/", protect, fetchChats);

export default router;
