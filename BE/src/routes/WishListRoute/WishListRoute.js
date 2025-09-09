const express = require("express");
const wishListRoute = express.Router();
const WishListController = require("../../controllers/WishListController/WishListController");
const auth = require("../../middlewares/auth");
wishListRoute.post(
  "/addWishList/:type/:id",
  auth.isAuth,
  WishListController.addToWishList
);
wishListRoute.get("/getWishList", auth.isAuth, WishListController.getWishList);
wishListRoute.get(
  "/checkIsFavorite/:type/:id",
  auth.isAuth,
  WishListController.checkIsFavorite
);
wishListRoute.put(
  "/deleteWishList/:type/:id",
  auth.isAuth,
  WishListController.deleteItemFromWishList
);
module.exports = wishListRoute;
