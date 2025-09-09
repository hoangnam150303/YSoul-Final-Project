const express = require("express");
const messageRoute = express.Router();
const auth = require("../../middlewares/auth");
const messageController = require("../../controllers/SocialMediaController.js/messageController");
const upload = require("../../utils/multer");

messageRoute.get(
  "/getAllConversation",
  auth.isAuth,
  messageController.getAllConversation
);
messageRoute.post(
  "/createConversation/:receiverId",
  auth.isAuth,
  messageController.createConversation
);
messageRoute.get(
  "/getDetailConversation/:id",
  auth.isAuth,
  messageController.getDetailConversation
);
messageRoute.put(
  "/sendMessage/:id",
  upload.single("image"),
  auth.isAuth,
  messageController.sendMessage
);
messageRoute.put(
  "/updateMessage/:conversationId/:messageId",
  upload.single("image"),
  auth.isAuth,
  messageController.updateMessage
);
messageRoute.delete(
  "/deleteConversation/:id",
  auth.isAuth,
  messageController.deleteConversation
);
messageRoute.delete(
  "/deleteMessage/:conversationId/:messageId",
  auth.isAuth,
  messageController.deleteMessage
);
module.exports = messageRoute;
