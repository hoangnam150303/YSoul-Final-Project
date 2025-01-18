const filmService = require("../services/filmService");
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
      numberTitle,
      episode,
    } = req.body;
    console.log(req.files);
    const smallImage = req.files?.small_image?.[0]?.path; // Lấy path của small_image
    const largeImage = req.files?.large_image?.[0]?.path;
    const movieFile = req.files?.movie?.[0]?.path;
    let response;
    if (episode) {
      // Nếu có episode (phim nhiều tập)
      response = await filmService.createFilmService(
        name,
        description,
        smallImage,
        largeImage,
        trailer,
        null, // Không truyền movie khi tạo episodes
        cast,
        director,
        genre,
        releaseYear,
        numberTitle,
        movieFile // Truyền video (tập)
      );
    } else {
      // Nếu là phim đơn lẻ
      response = await filmService.createFilmService(
        name,
        description,
        smallImage,
        largeImage,
        trailer,
        movieFile, // Truyền file phim
        cast,
        director,
        genre,
        releaseYear
      );
    }
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

exports.getAllFilm = async (req, res) => {
  try {
    const { page, limit, typeFilm, category, sort } = req.query;
    console.log(page, limit, typeFilm, category, sort);
    const response = await filmService.getAllFilmService(
      page,
      limit,
      typeFilm,
      category,
      sort
    );
    if (!response.success) {
      return res.status(400).json({
        message: "Error get all film",
        error: response.error,
      });
    }
    return res.status(200).json({
      message: "Get all film successfully",
      data: response.data,
    });
  } catch (error) {}
};
