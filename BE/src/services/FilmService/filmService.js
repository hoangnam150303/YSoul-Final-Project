const Film = require("../../models/FilmModel/film");
const Episode = require("../../models/FilmModel/episode");
const cloudinaryHelpers = require("../../helpers/cloudinaryHelpers");
const HistoryFilm = require("../../models/FilmModel/historyFilm");
exports.createFilmService = async (
  name,
  description,
  small_image,
  large_image,
  isForAll,
  trailer,
  cast,
  director,
  genre,
  releaseYear,
  title,
  video,
  age
) => {
  try {
    let resultVideo = [];
    let parsedTitle = [];

    if (title) {
      try {
        parsedTitle = JSON.parse(title);
      } catch (err) {
        parsedTitle = [];
      }
    }

    if (parsedTitle && parsedTitle.length > 0) {
      const videoUrls = video.split(",").map((v) => v.trim());

      if (videoUrls.length !== parsedTitle.length) {
        throw new Error("Số lượng video và title không khớp");
      }

      for (let i = 0; i < parsedTitle.length; i++) {
        let result = await Episode.create({
          title: parsedTitle[i],
          urlVideo: videoUrls[i],
        });
        resultVideo.push(result._id);
      }
    } else {
      let result = await Episode.create({
        urlVideo: video,
      });
      resultVideo.push(result._id);
    }

    const film = await Film.create({
      name,
      description,
      small_image,
      large_image,
      trailer,
      cast,
      director,
      genre,
      releaseYear,
      isForAllUsers: isForAll,
      isDeleted: false,
      video: resultVideo,
      age: age,
    });

    if (!film) {
      throw new Error("Film not created");
    }
    return { success: true };
  } catch (error) {
    console.error("Error creating film:", error.message);
    return { success: false, error: error.message };
  }
};

exports.getAllFilmService = async (type, category, sort, search, typeUser) => {
  try {
    let sortOption = {};
    switch (sort) {
      case "Trending":
        sortOption = { views: -1 };
        break;
      case "Top Rated":
        sortOption = { totalRating: -1 };
        break;
      case "Newest":
        sortOption = { createdAt: -1 };
        break;
      case "Popular":
        sortOption = { countClick: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
        break;
    }

    // Xây dựng query object chung
    let query = {};

    // Kiểm tra category trước khi thêm vào query
    if (category && category !== "undefined") {
      query.genre = category;
    }

    // Kiểm tra search trước khi thêm vào query
    if (search && search !== "undefined") {
      if (type === "Person") {
        query.cast = { $regex: search, $options: "i" };
      } else {
        query.name = { $regex: search, $options: "i" };
      }
    }

    // Kiểm tra type, nếu tồn tại và khác "undefined" thì áp dụng điều kiện về video
    if (type && type !== "undefined") {
      if (type === "Movie") {
        query.$expr = { $eq: [{ $size: { $ifNull: ["$video", []] } }, 1] };
      } else if (type === "TV Shows") {
        query.$expr = { $gt: [{ $size: { $ifNull: ["$video", []] } }, 1] };
      } else if (type === "All") {
        // Không thêm điều kiện nào về video
      } else if (type === "Person") {
        // Đã xử lý phần tìm kiếm cast ở trên
      }
    }
    let films;
    if (typeUser === "admin") {
      if (sort === "IsDeleted") {
        films = await Film.find(query)
          .sort({ ...sortOption })
          .where({ isDeleted: true });
      } else if (sort === "Active") {
        films = await Film.find(query)
          .sort({ ...sortOption })
          .where({ isDeleted: false });
      } else {
        films = await Film.find(query).sort({ ...sortOption });
      }
    } else {
      films = await Film.find(query)
        .sort({ ...sortOption })
        .where({ isDeleted: false });
    }

    return {
      success: true,
      data: films,
    };
  } catch (error) {
    console.error("Error getting all films:", error.message);
    return { success: false, error: error.message };
  }
};

exports.getFilmByIdService = async (filmId) => {
  try {
    const film = await Film.findById(filmId).populate(
      "video",
      "urlVideo title"
    );
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
  id,
  name,
  description,
  smallImage,
  largeImage,
  trailer,
  cast,
  director,
  genre,
  releaseYear,
  title,
  isForAll,
  video,
  age,
  isSeries
) => {
  try {
    const film = await Film.findById(id);
    if (!film) throw new Error("Film not found");

    // Chuẩn hóa input thành mảng
    let videoUrls = [];
    if (Array.isArray(video)) {
      videoUrls = video;
    } else if (typeof video === "string") {
      videoUrls = [video];
    }

    let newEpisodeIds = [];

    if (isSeries) {
      let parsedTitle;
      try {
        parsedTitle = JSON.parse(title || "[]");
      } catch (err) {
        throw new Error("Title error");
      }

      if (videoUrls.length > 0 && parsedTitle.length === videoUrls.length) {
        // Logic cũ của bạn push thêm tập mới
        for (let i = 0; i < parsedTitle.length; i++) {
          const ep = await Episode.create({
            title: parsedTitle[i],
            urlVideo: videoUrls[i],
          });
          newEpisodeIds.push(ep._id);
        }
        film.video = [...(film.video || []), ...newEpisodeIds];
      }
    } else {
      const inputData = videoUrls[0]; // Có thể là File Path mới HOẶC ID cũ
      if (!inputData) throw new Error("Phim lẻ cần ít nhất một video.");

      let needUpdate = true;

      if (film.video && film.video.length > 0) {
        const currentEpId = film.video[0];

        if (inputData === currentEpId.toString()) {
          needUpdate = false; // Không làm gì cả
        } else {
          const currentEp = await Episode.findById(currentEpId);
          if (currentEp && currentEp.urlVideo === inputData) {
            needUpdate = false;
          }
        }
      }

      if (needUpdate) {
        if (film.video && film.video.length > 0) {
          await Episode.deleteMany({ _id: { $in: film.video } });
        }

        const episode = await Episode.create({ urlVideo: inputData });
        film.video = [episode._id];
      }
    }

    film.name = name;
    film.description = description;
    film.trailer = trailer;
    film.cast = cast;
    film.director = director;
    film.genre = genre;
    film.releaseYear = releaseYear;
    film.isForAllUsers = isForAll;
    film.age = age;
    film.isSeries = isSeries;

    if (smallImage) film.small_image = smallImage;
    if (largeImage) film.large_image = largeImage;

    await film.save();
    return { success: true, data: film };
  } catch (error) {
    console.error("Update Error:", error.message);
    return { success: false, error: error.message };
  }
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
        userFeedback.rating = data;
      } else {
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
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating film status:", error);
    return { success: false, message: error.message };
  }
};

exports.addHistoryFilmService = async (filmId, userId) => {
  try {
    const history = await HistoryFilm.findOne({
      user_id: userId,
      film_id: filmId,
    });
    if (history) {
      return { success: true };
    }
    await HistoryFilm.create({ user_id: userId, film_id: filmId });
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

exports.getHistoryFilmService = async (userId) => {
  try {
    const historyFilms = await HistoryFilm.find({ user_id: userId }).populate({
      path: "film_id",
      select: "name small_image",
    });
    return { success: true, data: historyFilms };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
