const express = require("express");
const reviewerRoute = express.Router();
const reviewerController = require("../../controllers/SocialMediaController.js/reviewerController");
const auth = require("../../middlewares/auth");

reviewerRoute.get(
  "/getAllReviewer",
  auth.isAuth,
  reviewerController.getAllReviewer
);
reviewerRoute.put(
  "/followUser/:id",
  auth.isAuth,
  reviewerController.followUser
);

module.exports = reviewerRoute;
