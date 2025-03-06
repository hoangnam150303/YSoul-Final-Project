const express = require("express");
const artistNFTRoute = express.Router();
const artistNFTController = require("../controllers/NFTMarketController.js/artistNFTController");
const auth = require("../middlewares/auth");
const upload = require("../utils/multer");
artistNFTRoute.get("/getArtistNFT/:addressWallet",auth.isAuth,artistNFTController.getArtistNFT );
artistNFTRoute.post("/registerArtist", upload.single("avatar"),auth.isAuth,artistNFTController.createArtistNFT)
module.exports = artistNFTRoute;
