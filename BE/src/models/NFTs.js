const mongoose = require("mongoose");

const NFTsSchema = new mongoose.Schema(
  {
    artistId:{type: mongoose.Schema.Types.ObjectId, ref: "ArtistNFT"},
    image:{type:String},
    price:{type:String},
    description:{type:String}
  },
  {
    timestamps: true,
  }
);

const NFTs = mongoose.model("NFTs", NFTsSchema);

module.exports = NFTs;
