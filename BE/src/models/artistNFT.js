const mongoose = require("mongoose");

const artistNFTSchema = new mongoose.Schema(
  {
    user_id: { type: String },
    addressWallet:{type:String},
    avatar:{type:String}
  },
  {
    timestamps: true,
  }
);

const ArtistNFT = mongoose.model("ArtistNFT", artistNFTSchema);

module.exports = ArtistNFT;
