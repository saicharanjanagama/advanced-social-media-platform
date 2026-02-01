// --------------------
// Load env early
// --------------------
import dotenv from "dotenv";
dotenv.config();

// --------------------
// Imports
// --------------------
import http from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";

import app from "./app.js";
import socketHandler from "./sockets/index.js";

// --------------------
// Create HTTP server
// --------------------
const server = http.createServer(app);

// --------------------
// Socket.IO instance
// --------------------
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true
  }
});

// 🔥 MAKE IO AVAILABLE TO EXPRESS
app.set("io", io);

// --------------------
// Socket handlers
// --------------------
socketHandler(io);

// --------------------
// MongoDB + Server start
// --------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    server.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
