const express = require("express");
const artistNFTRoute = express.Router();
const artistNFTController = require("../../controllers/NFTMarketController.js/artistNFTController");
const auth = require("../../middlewares/auth");
const upload = require("../../utils/multer");
artistNFTRoute.get("/getArtistNFT/:addressWallet",auth.isVip,artistNFTController.getArtistNFT );
artistNFTRoute.post("/registerArtist", upload.single("avatar"),auth.isVip,artistNFTController.createArtistNFT)
artistNFTRoute.get("/getAllArtistNFT",auth.isVip,artistNFTController.getAllArtistNFT );
module.exports = artistNFTRoute;
