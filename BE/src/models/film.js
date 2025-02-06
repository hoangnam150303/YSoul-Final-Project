const mongoose = require("mongoose");

const filmSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    small_image: {
      type: String,
      required: true,
    },
    large_image: {
      type: String,
      required: true,
    },
    trailer: {
      type: String,
    },
    movie: {
      type: String,
    },
    cast: [{ type: String, required: true }],
    director: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    releaseYear: {
      type: String,
      required: true,
    },
    feedback: [
      {
        user_id: {
          type: String,
        },
        rating: {
          type: Number,
        },
      },
    ],
    totalRating: {
      type: Number,
    },
    countClick: {
      type: Number,
    },
    views: {
      type: Number,
    },
    episodes: [
      {
        title: {
          type: String,
        },
        video: {
          type: String,
        },
      },
    ],
    rangeUser: [{ type: String }],
    isDeleted: { type: Boolean },
    age: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Film = mongoose.model("Film", filmSchema);

module.exports = Film;
