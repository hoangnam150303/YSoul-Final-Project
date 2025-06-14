const mongoose = require("mongoose");

const FavouriteEntertainmentSchema = new mongoose.Schema(
  {
    film: { type: Number, default: 0 },
    music: { type: Number, default: 0 },
    market: { type: Number, default: 0 },
    social: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const FavouriteEntertainment = mongoose.model(
  "FavouriteEntertainment",
  FavouriteEntertainmentSchema
);

module.exports = FavouriteEntertainment;
