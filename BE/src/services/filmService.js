const Film = require("../models/film");

exports.createFilmService = async (
  name,
  description,
  small_image,
  large_image,
  trailer,
  movie,
  cast,
  director,
  genre,
  releaseYear,
  numberTitle = null,
  video = null
) => {
  try {
    let film;
    console.log(small_image, large_image);
    if (numberTitle && video) {
      // Nếu có `numberTitle` và `video`, tạo với episodes
      film = await Film.create({
        name,
        description,
        small_image,
        large_image,
        trailer,
        cast,
        director,
        genre,
        releaseYear,
        episodes: [
          {
            numberTitle: Number(numberTitle),
            video,
          },
        ],
      });
    } else {
      // Nếu không có `numberTitle`, lưu phim cơ bản
      film = await Film.create({
        name,
        description,
        small_image,
        large_image,
        trailer,
        movie, // Lưu trường `movie`
        cast,
        director,
        genre,
        releaseYear,
      });
    }

    if (!film) {
      throw new Error("Film not created");
    }

    return { success: true };
  } catch (error) {
    console.error("Error creating film:", error.message);
    return { success: false, error: error.message };
  }
};

exports.getAllFilmService = async (page, limit, typeFilm, category, sort) => {
  try {
    let films = [];
    let sortOption = {};
    switch (sort) {
      case "Trending":
        sortOption = { views: -1 };
        break;
      case "Top Rated":
        sortOption = { rating: -1 };
        break;
      case "Newest":
        sortOption = { releaseYear: -1 };
        break;
      case "Popular":
        sortOption = { countClick: -1 };
        break;
      default:
        sortOption = {};
        break;
    }
    if (typeFilm === "Movie") {
      films = await Film.find({
        episodes: { $exists: true, $size: 0 },
        genre: category,
      })
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit);
    } else if (typeFilm === "TV Shows") {
      films = await Film.find({
        episodes: { $exists: true, $not: { $size: 0 } },
        genre: category,
      })
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit);
    } else {
      films = await Film.find({
        genre: category,
      })
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit);
    }
    console.log(films);
    const total = await Film.countDocuments({ films });
    return {
      success: true,
      data: films,
      currentPage: page,
      totalPage: Math.ceil(total / limit),
      total,
    };
  } catch (error) {
    console.error("Error getting all films:", error.message);
    return { success: false, error: error.message };
  }
};

exports.getFilmByIdService = async (filmId) => {
  try {
    const film = await Film.findById(filmId);
    if (!film) {
      throw new Error("Film not found");
    }
    return { success: true, data: film };
  } catch (error) {
    console.error("Error getting film by ID:", error.message);
    return { success: false, error: error.message };
  }
};

exports.deleteFilmByIdService = async (filmId) => {
  try {
    const film = await Film.findByIdAndDelete(filmId);
    if (!film) {
      throw new Error("Film not found");
    }
    return { success: true };
  } catch (error) {
    console.error("Error deleting film by ID:", error.message);
    return { success: false, error: error.message };
  }
};

exports.updateFilmByIdService =  async (filmId, data) => {}

exports.updateStatusFilmByIdSerive = async (filmId, data) => {}
