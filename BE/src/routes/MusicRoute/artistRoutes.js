const express = require("express");
const artistRoute = express.Router();
const auth = require("../../middlewares/auth");
const upload = require("../../utils/multer");
const artistController = require("../../controllers/MusicController/artistController");

artistRoute.post(
  "/createArtist",
  auth.isAdmin,
  upload.single("avatar"),
  artistController.createArtist
);
artistRoute.put(
  "/updateArtist/:id",
  auth.isAdmin,
  upload.single("avatar"),
  artistController.updateArtist
);
artistRoute.put(
  "/activeOrDeactiveArtist/:id",
  auth.isAdmin,
  artistController.activeOrDeactiveArtist
);

artistRoute.get("/getArtistById/:id", artistController.getArtistById);
artistRoute.get("/getAllArtist", artistController.getAllArtist);
module.exports = artistRoute;
