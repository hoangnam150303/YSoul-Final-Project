const Film = require("../models/film");
const HistoryFilm = require("../models/historyFilm");
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
        isDeleted: true,
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
        isDeleted: true,
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

exports.getAllFilmService = async (
  page,
  limit,
  type,
  category,
  sort,
  search
) => {
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

    if (type === "Movie") {
      films = await Film.find({
        episodes: { $exists: true, $size: 0 },
        ...(category && { genre: category }),
        isDeleted: false,
        ...(search && { name: { $regex: search, $options: "i" } }),
      })
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit);
    } else if (type === "TV Shows") {
      films = await Film.find({
        episodes: { $exists: true, $not: { $size: 0 } },
        ...(category && { genre: category }),
        isDeleted: false,
        ...(search && { name: { $regex: search, $options: "i" } }),
      })
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit);
    } else if (type === "All") {
      films = await Film.find({
        ...(category && { genre: category }),
        isDeleted: false,
        ...(search && { name: { $regex: search, $options: "i" } }),
      })
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit);
    } else if (type === "Person") {
      films = await Film.find({
        isDeleted: false,
        ...(search && { cast: { $regex: search, $options: "i" } }),
      }).sort(sortOption);
    } else {
      films = await Film.find({
        isDeleted: false,
      }).sort(sortOption);
    }

    const total = await Film.countDocuments(films);

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

exports.activeOrDeactiveFilmByIdService = async (filmId) => {
  try {
    const film = await Film.findById(filmId);
    if (!film) {
      throw new Error("Film not found");
    }
    await Film.findByIdAndUpdate(filmId, {
      isDeleted: !film.isDeleted,
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting film by ID:", error.message);
    return { success: false, error: error.message };
  }
};

exports.updateFilmByIdService = async (
  filmId,
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
    const film = await Film.findById(filmId);
    if (!film) {
      throw new Error("Film not found");
    }
    let filmUpdate = "";
    if (numberTitle && video) {
      filmUpdate = await Film.findByIdAndUpdate(
        filmId,
        {
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
        },
        { new: true }
      );
    } else {
      filmUpdate = await Film.findByIdAndUpdate(
        filmId,
        {
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
        },
        { new: true }
      );
    }
    return { success: true };
  } catch (error) {}
};

exports.updateStatusFilmByIdSerive = async (filmId, data) => {};
