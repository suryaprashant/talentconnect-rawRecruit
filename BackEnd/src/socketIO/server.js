import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URLS, "http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

// realtime message code goes here
export const getReceiverSocketId = (receiverId) => {
  console.log("Users inside getReceiverSocketId:", users);
  return users[receiverId];
};

const users = {};

//new: Function to emit online users
const emitOnlineUsers = () => {
  const onlineUserIds = Object.keys(users);
  console.log("Emitting Online Users:", onlineUserIds); // ✅ NEW LOG
  io.emit("getOnlineUsers", onlineUserIds);
};

// used to listen events on server side.
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  console.log("Socket connected with userId:", userId);
  console.log("Socket ID:", socket.id);

  if (userId) {
    users[userId] = socket.id;
  }

  console.log("Updated users map:", users);

  //new: Emit online users when someone connects
  emitOnlineUsers();

  //new: Send welcome message to the connected client
  socket.emit("connection_success", { 
    message: "Connected successfully", 
    userId: userId 
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", userId);
    delete users[userId];
    console.log("Users after disconnect:", users);
    
    //new: Emit online users when someone disconnects
    emitOnlineUsers();
  });
});

export { app, io, server };