// --------------------
// Load env early
// --------------------
import dotenv from "dotenv";
dotenv.config();

// --------------------
// Imports
// --------------------
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

// --------------------
// App
// --------------------
const app = express();

// --------------------
// Core middlewares
// --------------------
app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  })
);

// --------------------
// 🔥 SOCKET IO BRIDGE (CRITICAL)
// This MUST run before routes
// --------------------
app.use((req, res, next) => {
  req.io = req.app.get("io");
  next();
});

// --------------------
// Security (disable in tests)
// --------------------
if (process.env.NODE_ENV !== "test") {
  app.use(helmet());

  app.use(
    "/api",
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      standardHeaders: true,
      legacyHeaders: false
    })
  );
}

// --------------------
// Health check
// --------------------
app.get("/", (req, res) => {
  res.status(200).send("🚀 Advanced Social Media API is running");
});

// --------------------
// Routes
// --------------------
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

// --------------------
// Global error handler
// --------------------
app.use((err, req, res, next) => {
  console.error("❌ GLOBAL ERROR:", err.message);

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error"
  });
});

export default app;
