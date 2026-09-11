import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URLS, "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const users = {};

// Get receiver's socket ID
export const getReceiverSocketId = (receiverId) => {
  return users[receiverId?.toString()];
};

// Emit currently online users
const emitOnlineUsers = () => {
  const onlineUserIds = Object.keys(users);

  console.log("Emitting Online Users:", onlineUserIds);

  io.emit("getOnlineUsers", onlineUserIds);
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId?.toString();

  console.log("Socket connected with userId:", userId);
  console.log("Socket ID:", socket.id);

  if (userId) {
    users[userId] = socket.id;

    
    socket.join(`user:${userId}`);
    console.log(`Socket ${socket.id} joined room user:${userId}`);
  }

  console.log("Updated users map:", users);

  
  emitOnlineUsers();

  // Connection success
  socket.emit("connection_success", {
    message: "Connected successfully",
    userId,
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", userId);

    // Only delete if this socket is still the user's active socket
    if (userId && users[userId] === socket.id) {
      delete users[userId];
    }

    console.log("Users after disconnect:", users);

    emitOnlineUsers();
  });
});

export { app, io, server };

// import { Server } from "socket.io";
// import http from "http";
// import express from "express";
// import dotenv from "dotenv";

// dotenv.config();

// const app = express();
// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: [process.env.FRONTEND_URLS, "http://localhost:5173"],
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// const users = {};

// // Get receiver's socket ID
// export const getReceiverSocketId = (receiverId) => {
//   return users[receiverId?.toString()];
// };

// // Emit currently online users
// const emitOnlineUsers = () => {
//   const onlineUserIds = Object.keys(users);

//   console.log("Emitting Online Users:", onlineUserIds);

//   io.emit("getOnlineUsers", onlineUserIds);
// };

// io.on("connection", (socket) => {
//   const userId = socket.handshake.query.userId?.toString();

//   console.log("Socket connected with userId:", userId);
//   console.log("Socket ID:", socket.id);

//   if (userId) {
//     users[userId] = socket.id;
//   }

//   console.log("Updated users map:", users);

//   // Notify everyone about online users
//   emitOnlineUsers();

//   // Connection success
//   socket.emit("connection_success", {
//     message: "Connected successfully",
//     userId,
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", userId);

//     // Only delete if this socket is still the user's active socket
//     if (userId && users[userId] === socket.id) {
//       delete users[userId];
//     }

//     console.log("Users after disconnect:", users);

//     emitOnlineUsers();
//   });
// });

// export { app, io, server };
