import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from 'dotenv';
dotenv.config();

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

// realtime message code goes here
export const getReceiverSocketId = (receiverId) => {
  console.log("Users inside getReceiverSocketId:", users);
  return users[receiverId];
};

const users = {};

// used to listen events on server side.
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  console.log("Socket connected with userId:", userId);
  console.log("Socket ID:", socket.id);

  if (userId) {
    users[userId] = socket.id;
  }

  console.log("Updated users map:", users);

  socket.on("disconnect", () => {
    console.log("User disconnected:", userId);
    delete users[userId];
    console.log("Users after disconnect:", users);
  });
});

export { app, io, server };