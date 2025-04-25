const express = require("express");
const nftRoute = express.Router();
const nftController = require("../../controllers/NFTMarketController.js/nftController");
const auth = require("../../middlewares/auth");
const upload = require("../../utils/multer");

nftRoute.post("/createNFT", upload.single("image"), auth.isAuth, nftController.createNFT);
nftRoute.get("/getAllNFTs",auth.isAuth, nftController.getAllNFTs);
nftRoute.get("/getNFTByArtist",auth.isAuth, nftController.getNFTByArtist);
nftRoute.get("/getNFTById/:id", auth.isAuth, nftController.getNFTById);  
nftRoute.put("/updateNFT/:id", upload.single("image"), auth.isAuth, nftController.updateNFT); 
nftRoute.put("/updateStatus/:id", auth.isAuth, nftController.updateStatusNFt);
nftRoute.put("/buyNFT/:id", auth.isAuth, nftController.buyNFT);
module.exports = nftRoute;
