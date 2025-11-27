const filmService = require("../../services/FilmService/filmService");

// this function is for admin, admin can create new film
exports.createFilm = async (req, res) => {
  try {
    const {
      name,
      description,
      trailer,
      cast,
      director,
      genre,
      releaseYear,
      title,
      isForAll,
      age,
    } = req.body;
    if (!req.files || !req.files.movie) {
      return res.status(400).json({ message: "Please upload a movie file" });
    }
    const movieFiles = req.files.movie.map((file) => file.path).join(", ");
    const smallImage = req.files?.small_image?.[0]?.path;
    const largeImage = req.files?.large_image?.[0]?.path;
    let parsedCast = [];
    try {
      parsedCast = typeof cast === "string" ? JSON.parse(cast) : cast;
    } catch (e) {
      parsedCast = [cast];
    }
    const response = await filmService.createFilmService(
      name,
      description,
      smallImage,
      largeImage,
      isForAll,
      trailer,
      parsedCast,
      director,
      genre,
      releaseYear,
      title,
      movieFiles,
      age
    );

    if (!response.success) {
      return res.status(400).json({
        message: "Error creating film",
        error: response.error,
      });
    }

    return res.status(200).json({
      message: "Film created successfully",
    });
  } catch (err) {
    console.error("Error in createFilm controller:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// this function can use in many situation, search film, sort film, get all film and Front end can use this function many time with many page.
exports.getAllFilm = async (req, res) => {
  try {
    const { typeFilm, category, sort, search, typeUser } = req.query;

    const response = await filmService.getAllFilmService(
      typeFilm,
      category,
      sort,
      search,
      typeUser
    );
    if (!response.success) {
      return res.status(400).json({
        message: "Error get all film",
        error: response.error,
      });
    }
    return res.status(200).json({
      message: "Get all film successfully",
      data: response,
    });
  } catch (error) {}
};

// this function will get film by id, it will use when user click to the film and it will display information of that film
exports.getFilmById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await filmService.getFilmByIdService(id);
    if (!response.success) {
      return res.status(400).json({
        message: "Error get film",
      });
    }
    return res.status(200).json({
      data: response.data,
      resultRating: response.resultRating,
      success: true,
    });
  } catch (error) {}
};

// this function is for admin, admin can delete film
exports.activeOrDeactiveFilmById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await filmService.activeOrDeactiveFilmByIdService(id);
    if (!response.success) {
      return res.status(400).json({
        message: "Error delete film",
      });
    }
    return res.status(200).json({
      response,
      success: true,
    });
  } catch (error) {}
};

// this function is for admin, admin can update information of film
exports.updateFilmById = async (req, res) => {
  try {
    const {
      name,
      description,
      trailer,
      cast,
      director,
      genre,
      releaseYear,
      title,
      isForAll,
      age,
      isSeries,
    } = req.body;
    const { id } = req.params;

    // 1. Lấy ảnh (ưu tiên file mới, fallback về body cũ)
    const smallImage =
      req.files?.small_image?.[0]?.path || req.body.small_image;
    const largeImage =
      req.files?.large_image?.[0]?.path || req.body.large_image;

    // 2. FIX LỖI: Lấy video
    // Mặc định lấy chuỗi cũ từ body (ví dụ: "http://..." hoặc ID cũ)
    let movieFiles = req.body.movie;

    // Nếu có file upload mới thì ghi đè
    if (req.files?.movie && req.files.movie.length > 0) {
      movieFiles = req.files.movie.map((file) => file.path);
    }

    // Ép kiểu isSeries
    const isSeriesBool =
      req.body.isSeries === "true" || req.body.isSeries === true;

    const response = await filmService.updateFilmByIdService(
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
      movieFiles, // Biến này giờ đã chứa đúng dữ liệu (File Path hoặc String cũ)
      age,
      isSeriesBool
    );

    if (!response.success) {
      return res
        .status(400)
        .json({ message: "Error updating film", error: response.error });
    }
    return res
      .status(200)
      .json({ message: "Film updated successfully", data: response.data });
  } catch (err) {
    console.error("Error in updateFilm controller:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// this funtion will update film when user play video or click to the film, get that film into favourite list.
exports.updateStatusFilmById = async (req, res) => {
  try {
    const { id, type, userId } = req.params;

    const { data } = req.body;

    const response = await filmService.updateStatusFilmByIdService(
      id,
      type,
      data,
      userId
    );
    if (!response.success) {
      return res.status(400).json({
        message: "Error update status film",
      });
    }
    return res.status(200).json("Update successfully");
  } catch (error) {
    return res.status(400).json({
      message: "Error update status film",
    });
  }
};

exports.addHistoryFilm = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const response = await filmService.addHistoryFilmService(id, userId);
    if (!response.success) {
      return res.status(400).json({
        message: "Error add history film",
      });
    }
    return res.status(200).json("Add Successfully!");
  } catch (error) {
    return res.status(500).json({
      message: "Error add history film" + error,
    });
  }
};

exports.getHistoryFilm = async (req, res) => {
  try {
    const userId = req.user.id;
    const response = await filmService.getHistoryFilmService(userId);
    if (!response.success) {
      return res.status(400).json({
        message: "Error get history film",
      });
    }
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({
      message: "Error get history film" + error,
    });
  }
};
