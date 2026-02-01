import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";

const SOCKET_URL = import.meta.env.VITE_API_URL;

// 🔒 SINGLE GLOBAL SOCKET INSTANCE
let socketInstance = null;

export const useSocket = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user) return;

    if (!socketInstance) {
      socketInstance = io(SOCKET_URL, {
        auth: {
          token: localStorage.getItem("token")
        },
        withCredentials: true, // ✅ REQUIRED for CORS
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000
      });

      socketInstance.on("connect", () => {
        console.log("🟢 Socket connected:", socketInstance.id);

        /* 🔔 NOTIFICATION LISTENER (GLOBAL) */
        socketInstance.on("notification", (data) => {
          console.log("🔔 Notification:", data);
          addNotification(data);
        });

        /* 🔎 LOG ALL SOCKET EVENTS (DEBUG) */
        socketInstance.onAny((event, data) => {
          console.log("📡 SOCKET EVENT:", event, data);
        });

        setSocket(socketInstance);
      });

      socketInstance.on("disconnect", (reason) => {
        console.log("🔴 Socket disconnected:", reason);
      });

      /* 🔁 AUTO RESYNC AFTER RECONNECT */
      socketInstance.on("reconnect", (attempt) => {
        console.log("🔁 Socket reconnected after", attempt, "tries");
        socketInstance.emit("resync-feed");
      });
    } else {
      setSocket(socketInstance);
    }

    return () => {};
  }, [user, addNotification]);

  return socket;
};
