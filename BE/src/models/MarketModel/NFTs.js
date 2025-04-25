const mongoose = require("mongoose");

const NFTsSchema = new mongoose.Schema(
  {
    artistId:{type: mongoose.Schema.Types.ObjectId, ref: "ArtistNFT"},
    name:{type:String},
    image:{type:String},
    price:{type:Number},
    description:{type:String},
    purchases:{type:Number,default:0},
    status:{type:Boolean,default:true},
    quantity:{type:Number,default:1},
  },
  {
    timestamps: true,
  }
);

const NFTs = mongoose.model("NFTs", NFTsSchema);

module.exports = NFTs;
