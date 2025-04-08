const express = require("express");
const notificationRoute = express.Router();
const notificationController = require("../../controllers/SocialMediaController.js/notificationController");
const auth = require("../../middlewares/auth");

notificationRoute.get("/getNotificationByUser", auth.isVip,notificationController.getNotificationByUser); 
notificationRoute.put("/updateNotification/:id", auth.isVip,notificationController.updateNotificationStatus);
notificationRoute.put("/deleteNotification/:id", auth.isVip,notificationController.deleteNotification);
notificationRoute.put("/readNotification/:id", auth.isVip,notificationController.readNotification);
module.exports = notificationRoute;
