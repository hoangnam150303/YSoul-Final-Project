const mongoose = require("mongoose");

const wishListSchema = new mongoose.Schema(
  {
    user_id: { type: String },
    film_id: { type: mongoose.Schema.Types.ObjectId, ref: "Film" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("WishList", wishListSchema);
