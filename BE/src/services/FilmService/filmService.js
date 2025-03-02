const Film = require("../../models/film");
const wishList = require("../../models/wishList");
const Episode = require("../../models/episode");
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
      isForAllUsers:isForAll,
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

exports.getAllFilmService = async (type, category, sort, search,typeUser) => {
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
        sortOption = {createdAt: -1};
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
        films = await Film.find(query).sort( { ...sortOption}).where({ isDeleted: true });
      }else if (sort === "Active") {
        films = await Film.find(query).sort( { ...sortOption}).where({ isDeleted: false });
      }else{
        films = await Film.find(query).sort( { ...sortOption});
      }

    }
    else{
      films = await Film.find(query).sort( { ...sortOption}).where({ isDeleted: false });
     
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
    const film = await Film.findById(filmId).populate("video","urlVideo title")
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
  title,     // Dữ liệu title mới truyền dưới dạng JSON string (ví dụ: '["New Title 1", "New Title 2"]')
  isForAll,
  video,     // Dữ liệu video mới truyền dưới dạng chuỗi URL, phân cách bằng dấu phẩy
  age
) => {
  try {
    // Tìm film theo id và populate các episode hiện tại (nếu cần)
    const film = await Film.findById(id);
    if (!film) {
      throw new Error("Film not found");
    }
    
    // Lấy mảng episode hiện tại (đang lưu trong film.video)
    const existingEpisodes = film.video; // Đây là mảng ObjectId của Episode

    let newEpisodeIds = [];
    let parsedTitle = [];
    if (title && video) {
      try {
        parsedTitle = JSON.parse(title); // Chuyển sang mảng
      } catch (err) {
        parsedTitle = [];
      }
    }
    
    // Nếu có dữ liệu title mới, tạo các episode mới chỉ với những title không rỗng
    if (parsedTitle.length > 0) {
      const videoUrls = video.split(",").map((v) => v.trim());
      
      if (videoUrls.length !== parsedTitle.length) {
        throw new Error("Số lượng video và title không khớp");
      }
      
      for (let i = 0; i < parsedTitle.length; i++) {
        console.log(parsedTitle[i]);
        
        if (parsedTitle[i].trim() !== "") {
          const episode = await Episode.create({
            title: parsedTitle[i],
            urlVideo: videoUrls[i],
          });
          newEpisodeIds.push(episode._id);
        }
      }
      // Nếu sau khi lọc không có episode nào được tạo, tạo một episode mặc định
      if (newEpisodeIds.length === 0) {
        const episode = await Episode.create({ urlVideo: video });
        newEpisodeIds.push(episode._id);
      }
    } else if(video) {
      
      // Nếu không có title mới hợp lệ, tạo một episode mới với video
      const episode = await Episode.create({ urlVideo: video });
      newEpisodeIds.push(episode._id);
    }

    // Giữ lại các episode cũ và nối với các episode mới
    const updatedEpisodeIds = [...existingEpisodes, ...newEpisodeIds];

    
    // Cập nhật film với thông tin mới và danh sách episode mới được nối thêm
    const filmUpdate = await Film.findByIdAndUpdate(
      id,
      {
        name,
        description,
        small_image: smallImage,
        large_image: largeImage,
        trailer,
        cast,
        director,
        genre,
        releaseYear,
        isForAllUsers: isForAll,
        age,
      },
      { new: true }
    );
    if (filmUpdate.video.length !== updatedEpisodeIds.length) {
      filmUpdate.video = updatedEpisodeIds;
      await filmUpdate.save();
    }
    if (!filmUpdate) {
      throw new Error("Film update failed");
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
    } else if (type === "favourite") {
      await wishList.create({ user_id: data, film_id: filmId });
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating film status:", error);
    return { success: false, message: error.message };
  }
};
