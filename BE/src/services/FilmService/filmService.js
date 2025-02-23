const Film = require("../../models/film");
const wishList = require("../../models/wishList");
exports.createFilmService = async (
  name,
  description,
  small_image,
  large_image,
  rangeUser,
  trailer,
  movieFiles,
  cast,
  director,
  genre,
  releaseYear,
  title = null,
  video = null,
  age
) => {
  try {
    let film;
    console.log(rangeUser);
    let episodes = [];
    let videoArr = [];
    if (title && video) {
      const videoUrls = video.split(",").map((v) => v.trim()); // Tách chuỗi video thành mảng và loại bỏ khoảng trắng thừa
      const parsedTitle = JSON.parse(title);
      videoUrls.forEach((video) => {
        videoArr.push(video);
      });

      // Kiểm tra nếu numberTitle và video có cùng số lượng phần tử

      // Duyệt qua từng phần tử của numberTitle và video
      for (let i = 0; i < parsedTitle.length; i++) {
        episodes.push({
          title: parsedTitle[i],
          video: videoArr[i],
        });
      }

      
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
        rangeUser: rangeUser,
        isDeleted: false,
        episodes: episodes,
        age: age,
      });
    } else {
      // Nếu không có `numberTitle`, lưu phim cơ bản
      film = await Film.create({
        name,
        description,
        small_image,
        large_image,
        trailer,
        movie: movieFiles, // Lưu trường `movie`
        cast,
        director,
        genre,
        isDeleted: false,
        releaseYear,
        rangeUser: rangeUser,
        age: age,
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
      case "IsDeleted":
        sortOption = { isDeleted: true };
        break;
      case "Active":
        sortOption = { isDeleted: false };
        break;
      default:
        sortOption = {};
        break;
    }

    if (type === "Movie") {
      films = await Film.find({
        episodes: { $exists: true, $size: 0 },
        ...(category && { genre: category }),
        ...(search && { name: { $regex: search, $options: "i" } }),
      })
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit);
    } else if (type === "TV Shows") {
      films = await Film.find({
        episodes: { $exists: true, $not: { $size: 0 } },
        ...(category && { genre: category }),
        ...(search && { name: { $regex: search, $options: "i" } }),
      })
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit);
    } else if (type === "All") {
      films = await Film.find({
        ...(category && { genre: category }),
        ...(search && { name: { $regex: search, $options: "i" } }),
      })
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit);
    } else if (type === "Person") {
      films = await Film.find({
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
    let filmUpdate;
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

exports.updateStatusFilmByIdService = async (filmId, type, data, userId) => {
  try {
    const film = await Film.findById(filmId);
    if (!film) {
      throw new Error("Film not found");
    }

    if (type === "rating") {
      let userFeedback = film.feedback.find((item) => item.user_id === userId);

      if (userFeedback) {
        // Nếu user đã đánh giá trước đó, cập nhật rating
        userFeedback.rating = data;
      } else {
        // Nếu user chưa đánh giá, thêm mới
        film.feedback.push({
          user_id: userId,
          rating: (film.feedback.rating || 0) + data,
        });
      }
      film.totalRating =
        film.feedback.reduce((sum, item) => sum + (item.rating || 0), 0) /
        (film.feedback.length || 1);

      await film.save();
    } else if (type === "click") {
      film.countClick = (film.countClick || 0) + 1;
      await film.save();
    } else if (type === "favourite") {
      await wishList.create({ user_id: data, film_id: filmId });
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating film status:", error);
    return { success: false, message: error.message };
  }
};
