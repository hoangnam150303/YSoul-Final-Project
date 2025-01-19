const mongoose = require("mongoose");

const historyFilmSchema = new mongoose.Schema(
  {
    user_id: { type: String },
    film_id: { type: mongoose.Schema.Types.ObjectId, ref: "Film" },
  },
  {
    timestamps: true,
  }
);

const HistoryFilm = mongoose.model("HistoryFilm", historyFilmSchema);

module.exports = HistoryFilm;
