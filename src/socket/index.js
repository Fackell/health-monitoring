
import { Server } from "socket.io";
import { verifyAccessToken } from "../utils/jwt.js";

export function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Потрібна авторизація"));
    }

    try {
      const decoded = verifyAccessToken(token);

      socket.user = {
        userId: decoded.userId,
        role: decoded.role,
      };

      next();
    } catch {
      next(new Error("Недійсний або прострочений токен"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(`user:${socket.user.userId}`);

    // Приєднання до додаткової кімнати
    socket.on("room:join", (roomId) => {
      if (typeof roomId !== "string" || !roomId.trim()) {
        return;
      }

      socket.join(`room:${roomId}`);
    });

    // Вихід із додаткової кімнати
    socket.on("room:leave", (roomId) => {
      if (typeof roomId !== "string" || !roomId.trim()) {
        return;
      }

      socket.leave(`room:${roomId}`);
    });

    console.log(`WebSocket connected: ${socket.user.userId}`);

    socket.on("disconnect", () => {
      console.log(`WebSocket disconnected: ${socket.user.userId}`);
    });
  });

  return io;
}
