const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});
function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}
const userSocketMap = {};
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  socket.on("callUser", (data) => {
    const receiverId = getReceiverSocketId(data.userToCall);
    io.to(receiverId).emit("callUser", {
      signal: data.signal,
      from: data.from,
      name: data.name,
    });
  });
  socket.on("answerCall", (data) => {
    const receiverId = getReceiverSocketId(data.to);
    io.to(receiverId).emit("callAccepted", data.signal);
  });
  // Emit the updated list of connected users
  io.emit("user-connected", Object.keys(userSocketMap));
  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId]; // Remove the user from the map on disconnect
    }
    io.emit("user-disconnected", Object.keys(userSocketMap)); // Emit updated list
  });
});

module.exports = { io, server, app, getReceiverSocketId };
