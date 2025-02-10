const mongoose = require("mongoose");

const wishListSchema = new mongoose.Schema(
  {
    user_id: { type: String },
    film_id: { type: mongoose.Schema.Types.ObjectId, ref: "Film" },
    single_id: { type: String},
    album_id: { type: String},
    NFT_id: { type: String},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("WishList", wishListSchema);
