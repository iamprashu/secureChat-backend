import { Server } from "socket.io";

// Create socket.io server with the HTTP server passed from index.js
let userSocketMap = {};

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

export function createSocketServer(server) {
  const io = new Server(server, {
    cors: {
      origin:
        process.env.NODE_ENV === "production"
          ? ["https://secure-chat-ecru.vercel.app"]
          : ["http://localhost:5173", "http://192.168.0.101:5173"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      console.log("A user disconnected", socket.id);
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });

  return io;
}
