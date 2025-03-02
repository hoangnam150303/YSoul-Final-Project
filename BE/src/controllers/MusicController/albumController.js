const albumService = require("../../services/MusicService/albumService");

// this function is for admin, admin can create new album
exports.createAlbum = async (req, res) => {
  try {
    const { title, artist_id, release_year } = req.body; // get title, artistId, releaseYear from request body

    if (!title || !artist_id || !release_year) {
      // if title, artistId, releaseYear is empty, return error message
      return res.status(401).json({ message: "All fields are required." });
    }
    const image = req.file.path; // get image path from request file

    const response = await albumService.createAlbumService(
      // call createAlbumService from albumService
      title,
      artist_id,
      image,
      release_year
    );
    if (!response.success) {
      // if response is not success, return error message
      return res.status(401).json({ message: "Error! Please try again." });
    }
    return res.status(200).json(response); // return response
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error! Please try again.", error });
  }
};

// this function is for admin, admin can update album
exports.updateAlbum = async (req, res) => {
  try {
    const { title,  artist_id, release_year } = req.body; // get title, artistId, releaseYear from request body

    const id = req.params.id; // get id from request params
    if (!id) {
      return res.status(401).json({ message: "Album id is required." });
    }
    const image = req.file?.path; // get image path from request file
    const response = await albumService.updateAlbumService(
      // call updateAlbumService from albumService
      id,
      title,
      artist_id,
      image,
      release_year
    );
    if (!response.success) {
      // if response is not success, return error message
      return res.status(401).json({ message: "Error! Please try again." });
    }
    return res.status(200).json(response); // return response
  } catch (error) {
    console.log(error);
  }
};

// this function is for admin, admin can delete album
exports.activeOrDeactiveAlbum = async (req, res) => {
  try {
    const id = req.params.id; // get id from request params
    if (!id) {
      return res.status(401).json({ message: "Album id is required." });
    }
    const response = await albumService.activeOrDeactiveAlbumService(id); // call deleteAlbumService from albumService
    if (!response.success) {
      // if response is not success, return error message
      return res.status(401).json({ message: "Error! Please try again." });
    }
    return res.status(200).json(response); // return response
  } catch (error) {
    return res.status(500).json({ message: "Error! Please try again." });
  }
};

// this function is for user, admin, user or admin can get all albums
exports.getAllAlbums = async (req, res) => {
  try {
    const { filter, search, typeUser } = req.query; // get filter and search from request query
    
    const response = await albumService.getAllAlbumService(
      filter,
      search,
      typeUser
    ); // call getAllAlbumService from albumService
    if (!response.success) {
      // if response is not success, return error message
      return res.status(401).json({ message: "Error! Please try again." });
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: "Error! Please try again." });
  }
};

// this function is for user, admin, user or admin can get album by id
exports.getAlbumById = async (req, res) => {
  try {
    const id = req.params.id; // get id from request params
    if (!id) {
      return res.status(401).json({ message: "Album id is required." });
    }
    const response = await albumService.getAlbumByIdService(id); // call getAlbumByIdService from albumService
    if (!response.success) {
      // if response is not success, return error message
      return res.status(401).json({ message: "Error! Please try again." });
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: "Error! Please try again." });
  }
};

// this function is for user, user can like or unlike album
exports.interactAlbum = async (req, res) => {
  try {
    const albumId = req.params.id; // get albumId from request params
    const type = req.query.type; // get type from request query
    const userId = req.user.id; // get userId from request user
    const response = await albumService.interactAlbumService(
      albumId,
      type,
      userId
    ); // call interactAlbumService from albumService
    if (!response.success) {
      // if response is not success, return error message
      return res.status(401).json({ message: "Error! Please try again." });
    }
    return res.status(200).json(response); // return response
  } catch (error) {
    return res.status(500).json({ message: "Error! Please try again." });
  }
};
