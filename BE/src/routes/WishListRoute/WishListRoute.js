const express = require("express");
const wishListRoute = express.Router();
const WishListController = require("../../controllers/WishListController/WishListController");
const auth = require("../../middlewares/auth");
wishListRoute.post("/addWishList/:type/:id", auth.isVip, WishListController.addToWishList);
wishListRoute.get("/getWishList", auth.isVip, WishListController.getWishList);
wishListRoute.get("/checkIsFavorite/:type/:id", auth.isVip, WishListController.checkIsFavorite);
wishListRoute.delete("/deleteWishList/:type/:id", auth.isVip, WishListController.deleteItemFromWishList);
module.exports = wishListRoute;
