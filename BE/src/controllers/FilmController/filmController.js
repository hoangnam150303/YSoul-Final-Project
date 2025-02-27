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
      rangeUser,
      age,
    } = req.body;
   
    
    const movieFiles = req.files?.movie.map((file) => file.path).join(", ");
    const smallImage = req.files?.small_image?.[0]?.path; // Lấy path của small_image
    const largeImage = req.files?.large_image?.[0]?.path;

    
    const response = await filmService.createFilmService(
        name,
        description,
        smallImage,
        largeImage,
        rangeUser,
        trailer,
        cast,
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
    const {typeFilm, category, sort, search } = req.query;
    const response = await filmService.getAllFilmService(
      typeFilm,
      category,
      sort,
      search
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
      rangeUser,
      age,
    } = req.body;
    const { id } = req.params;
  
    
    const smallImage = req.files?.small_image?.[0]?.path; // Lấy path của small_image
    const largeImage = req.files?.large_image?.[0]?.path;
    const movieFiles = req.files?.movie?.map((file) => file.path).join(", ");

      // Nếu có episode (phim nhiều tập)
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
        rangeUser,
        movieFiles,
        age,
      );
  
    if (!response.success) {
      return res.status(400).json({
        message: "Error creating film",
        error: response.error,
      });
    }

    return res.status(200).json({
      message: "Film updated successfully",
    });
  } catch (err) {
    console.error("Error in createFilm controller:", err.message);
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
