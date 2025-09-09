const express = require("express");
const notificationRoute = express.Router();
const notificationController = require("../../controllers/SocialMediaController.js/notificationController");
const auth = require("../../middlewares/auth");

notificationRoute.get("/getNotificationByUser", auth.isAuth,notificationController.getNotificationByUser); 
notificationRoute.put("/updateNotification/:id", auth.isAuth,notificationController.updateNotificationStatus);
notificationRoute.put("/deleteNotification/:id", auth.isAuth,notificationController.deleteNotification);
notificationRoute.put("/readNotification/:id", auth.isAuth,notificationController.readNotification);
module.exports = notificationRoute;
