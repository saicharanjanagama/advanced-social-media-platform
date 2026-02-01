import { socketAuth } from "../middleware/authMiddleware.js";

/*
  Track active sockets per user
  This avoids marking a user offline
  if they still have another tab open
*/
const onlineUsers = new Map();

const socketHandler = (io) => {
  io.use(socketAuth);

  io.on("connection", (socket) => {
    const userId = socket.user.id;

    console.log(
      "🟢 SOCKET CONNECTED | USER:",
      userId,
      "| SOCKET:",
      socket.id
    );

    /* ======================
       🟢 ONLINE PRESENCE
    ====================== */

    const count = onlineUsers.get(userId) || 0;
    onlineUsers.set(userId, count + 1);

    // emit only when user becomes online first time
    if (count === 0) {
      io.emit("user-online", userId);
      console.log("🟢 USER ONLINE:", userId);
    }

    /* 🔥 AUTO JOIN FEED */
    socket.join("feed");
    console.log(
      `📡 USER ${userId} joined FEED (socket ${socket.id})`
    );

    /* 👤 PERSONAL ROOM */
    socket.join(`user-${userId}`);

    /* ======================
       🔁 RESYNC HANDLER
    ====================== */
    socket.on("resync-feed", () => {
      console.log(
        "🔁 RESYNC REQUEST FROM USER:",
        userId,
        "| SOCKET:",
        socket.id
      );

      socket.emit("resync-required");
    });

    /* ======================
       💬 CHAT
    ====================== */
    socket.on("join-chat", (chatId) => {
      socket.join(`chat-${chatId}`);
    });

    socket.on("typing", ({ chatId, isTyping }) => {
      socket.to(`chat-${chatId}`).emit("user-typing", {
        userId,
        isTyping
      });
    });

    /* ======================
       🔴 DISCONNECT
    ====================== */
    socket.on("disconnect", () => {
      console.log(
        "🔴 SOCKET DISCONNECTED | USER:",
        userId,
        "| SOCKET:",
        socket.id
      );

      const remaining = (onlineUsers.get(userId) || 1) - 1;

      if (remaining <= 0) {
        onlineUsers.delete(userId);
        io.emit("user-offline", userId);
        console.log("🔴 USER OFFLINE:", userId);
      } else {
        onlineUsers.set(userId, remaining);
      }
    });
  });
};

export default socketHandler;
