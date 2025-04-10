const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const { conectPostgresDb } = require("../configs/database");
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_URL],
  },
});


function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}
const userSocketMap = {};
io.on("connection", async (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    try {
      await conectPostgresDb.query(
        "UPDATE users SET is_online = true WHERE id = $1",
        [userId]
      );
      
      
    } catch (error) {
      console.error("Failed to update user online status:", err);
    }
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
  socket.on("disconnect", async() => {
    if (userId) {
      delete userSocketMap[userId]; // Remove the user from the map on disconnect
      try {
        await conectPostgresDb.query(
          "UPDATE users SET is_online = false WHERE id = $1",
          [userId]
        );
      } catch (error) {
        console.log("Failed to update user offline status:", error);
        
      }
    }
    io.emit("user-disconnected", Object.keys(userSocketMap)); // Emit updated list
  });
});

module.exports = { io, server, app, getReceiverSocketId };
