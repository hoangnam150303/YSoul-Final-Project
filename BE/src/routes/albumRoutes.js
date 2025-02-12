const express = require("express");
const albumRoute = express.Router();
const auth = require("../middlewares/auth");
const upload = require("../utils/multer");
const albumController = require("../controllers/albumController");
albumRoute.post(
  "/createAlbum",
  auth.isAdmin,
  upload.single("image"),
  albumController.createAlbum
);

albumRoute.put(
  "/updateAlbum/:id",
  auth.isAdmin,
  upload.single("image"),
  albumController.updateAlbum
);

albumRoute.put(
  "/activeOrDeactive/:id",
  auth.isAdmin,
  albumController.activeOrDeactiveAlbum
);
albumRoute.put("/interactAlbum/:id", auth.isVip, albumController.interactAlbum);
albumRoute.get("/getAllAlbums", auth.isVip, albumController.getAllAlbums);
albumRoute.get("/getAlbumById/:id", auth.isVip, albumController.getAlbumById);
module.exports = albumRoute;
