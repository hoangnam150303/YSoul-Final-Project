const mongoose = require("mongoose");

const wishListSchema = new mongoose.Schema(
  {
    user_id: { type: String },
    film_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "Film" }],
    single: [
      {
        single_id: { type: String },
        title: { type: String },
        image: { type: String },
        mp3: { type: String },
      },
    ],
    NFT_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "NFTs" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("WishList", wishListSchema);
