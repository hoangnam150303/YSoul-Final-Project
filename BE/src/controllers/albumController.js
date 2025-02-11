const albumService = require("../services/albumService");
exports.createAlbum = async (req, res) => {
  try {
    const { title, artistId, releaseDate } = req.body;
    if (!title || !artistId) {
      return res
        .status(401)
        .json({ message: "All fields are required.", error });
    }
    const image = req.file.image.path;
    const mp3 = req.files.mp3.path;
    const response = await albumService.createAlbumService(
      title,
      artistId,
      image,
      mp3,
      releaseDate
    );
    if (!response.success) {
      return res
        .status(401)
        .json({ message: "Error! Please try again.", error });
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: "Error! Please try again.", error });
  }
};

