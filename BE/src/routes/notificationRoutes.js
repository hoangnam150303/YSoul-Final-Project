const express = require("express");
const notificationRoute = express.Router();
const notificationController = require("../controllers/SocialMediaController.js/notificationController");
const auth = require("../middlewares/auth");

notificationRoute.get("/getNotificationByUser", auth.isVip,notificationController.getNotificationByUser); 
notificationRoute.put("/updateNotification/:id", auth.isVip,notificationController.updateNotificationStatus);
module.exports = notificationRoute;
