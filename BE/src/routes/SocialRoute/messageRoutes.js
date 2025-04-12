const express = require("express");
const messageRoute = express.Router();
const auth = require("../../middlewares/auth");
const messageController = require("../../controllers/SocialMediaController.js/messageController");
const upload = require("../../utils/multer");

messageRoute.get("/getAllConversation",auth.isVip,messageController.getAllConversation)
messageRoute.post("/createConversation/:receiverId",auth.isVip, messageController.createConversation)
messageRoute.get("/getDetailConversation/:id",auth.isVip,messageController.getDetailConversation)
messageRoute.put("/sendMessage/:id",upload.single("image"),auth.isVip,messageController.sendMessage)
messageRoute.put("/updateMessage/:conversationId/:messageId",upload.single("image"),auth.isVip,messageController.updateMessage)
messageRoute.delete("/deleteConversation/:id",auth.isVip,messageController.deleteConversation)
messageRoute.delete("/deleteMessage/:conversationId/:messageId",auth.isVip,messageController.deleteMessage)
module.exports = messageRoute;
