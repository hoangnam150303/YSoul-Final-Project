const express = require("express");
const dashBoardsRoute = express.Router();
const dashboardController = require("../../controllers/DashBoardsController/DashBoardsController");
const auth = require("../../middlewares/auth");
dashBoardsRoute.put(
  "/increaseFavouriteCount",
  auth.isAuth,
  dashboardController.increaseFavouriteCount
);
dashBoardsRoute.get(
  "/getNumberOfTypeUser",
  auth.isAdmin,
  dashboardController.getNumberOfTypeUser
);
dashBoardsRoute.get(
  "/getFavouriteCount",
  auth.isAdmin,
  dashboardController.getFavouriteCount
);
dashBoardsRoute.get(
  "/getRevenue",
  auth.isAdmin,
  dashboardController.getRevenue
);
module.exports = dashBoardsRoute;
