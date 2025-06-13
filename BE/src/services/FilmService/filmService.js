const Film = require("../../models/FilmModel/film");
const Episode = require("../../models/FilmModel/episode");
const cloudinaryHelpers = require("../../helpers/cloudinaryHelpers");
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

    // Parse title nếu có
    if (title) {
      try {
        parsedTitle = JSON.parse(title);
      } catch (err) {
        parsedTitle = [];
      }
    }

    // Nếu parsedTitle có phần tử (không rỗng) thì xử lý tạo Episode có title
    if (parsedTitle && parsedTitle.length > 0) {
      const videoUrls = video.split(",").map((v) => v.trim());

      // Nếu số lượng video không khớp với số lượng title, có thể ném lỗi hoặc xử lý khác
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
      // Nếu title rỗng hoặc không hợp lệ, chỉ tạo Episode với trường urlVideo
      let result = await Episode.create({
        urlVideo: video,
      });
      resultVideo.push(result._id);
    }

    // Tạo film với các thông tin nhận được, bao gồm cả danh sách Episode vừa tạo
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
  title, // JSON string
  isForAll,
  video, // String hoặc comma-separated
  age,
  isSeries // 👈 THÊM dòng này để phân biệt Movie vs Series
) => {
  try {
    const film = await Film.findById(id);
    if (!film) {
      throw new Error("Film not found");
    }

    const existingEpisodes = film.video || [];
    let newEpisodeIds = [];

    // === SERIES ===
    if (isSeries && title && video) {
      let parsedTitle = [];
      try {
        parsedTitle = JSON.parse(title);
      } catch (err) {
        throw new Error("Title must be a valid JSON array.");
      }

      const videoUrls = video.split(",").map((v) => v.trim());

      if (videoUrls.length !== parsedTitle.length) {
        throw new Error("Số lượng video và title không khớp.");
      }

      for (let i = 0; i < parsedTitle.length; i++) {
        if (parsedTitle[i].trim() !== "") {
          const episode = await Episode.create({
            title: parsedTitle[i],
            urlVideo: videoUrls[i],
          });
          newEpisodeIds.push(episode._id);
        }
      }

      // === MOVIE ===
    } else if (!isSeries && video) {
      const episode = await Episode.create({
        urlVideo: video,
      });
      newEpisodeIds.push(episode._id);
    }

    const updatedEpisodeIds = [...existingEpisodes, ...newEpisodeIds];

    // ===== Chuẩn bị dữ liệu cập nhật =====
    const updateData = {
      name,
      description,
      trailer,
      cast,
      director,
      genre,
      releaseYear,
      isForAllUsers: isForAll,
      age,
      isSeries, // 👈 Cập nhật vào DB nếu có trường
    };

    // ===== Xử lý ảnh nhỏ =====
    if (smallImage && film.small_image) {
      await cloudinaryHelpers.removeFile(film.small_image);
      updateData.small_image = smallImage;
    } else if (smallImage) {
      updateData.small_image = smallImage;
    }

    // ===== Xử lý ảnh lớn =====
    if (largeImage && film.large_image) {
      await cloudinaryHelpers.removeFile(film.large_image);
      updateData.large_image = largeImage;
    } else if (largeImage) {
      updateData.large_image = largeImage;
    }

    // ===== Cập nhật phim =====
    const filmUpdate = await Film.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!filmUpdate) {
      throw new Error("Film update failed");
    }

    // ===== Gán danh sách episode mới nếu khác cũ =====
    if (newEpisodeIds.length > 0) {
      filmUpdate.video = [...existingEpisodes, ...newEpisodeIds];
      await filmUpdate.save();
    }

    return { success: true, data: filmUpdate };
  } catch (error) {
    console.error("Error updating film:", error.message);
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
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating film status:", error);
    return { success: false, message: error.message };
  }
};
