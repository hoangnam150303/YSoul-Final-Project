const mongoose = require("mongoose");

const episodeSchema = new mongoose.Schema(
  {
   title: { type: String },
   urlVideo: { type: String },
  },
  {
    timestamps: true,
  }
);

const Episode = mongoose.model("Episode", episodeSchema);

module.exports = Episode;
