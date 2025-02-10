const artistService = require("../services/artistService");

// this function is for admin, admin can create new artist
exports.createArtist = async (req, res) => {
  try {
    // get name and avatar from body and req.file
    const { name } = req.body;
    const avatar = req.file.path;
    if (!name || !avatar) {
      // check if name or avatar is empty return status 401
      return res
        .status(401)
        .json({ message: "Error! Please try again.", error });
    }
    // if name or avatar is not empty call createArtistService
    const response = await artistService.createArtistService(name, avatar);
    if (!response.success) {
      // if response is not success return status 401
      return res
        .status(401)
        .json({ message: "Error! Please try again.", error });
    }
    // if response is success return status 200
    res.status(200).json(response);
  } catch (error) {
    // catch error and return it
    return res.status(401).json({ message: "Error! Please try again.", error });
  }
};

// this function is for admin, admin can update information of artist
exports.updateArtist = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const avatar = req.file?.path;
    if (!id) {
      return res
        .status(401)
        .json({ message: "Id fields are required.", error });
    }
    const response = await artistService.updateArtistService(id, name, avatar);
    if (!response.success) {
      return res
        .status(401)
        .json({ message: "Error! Please try again.", error });
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(401).json({ message: "Error! Please try again.", error });
  }
};

exports.activeOrDeactiveArtist = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(401)
        .json({ message: "Id fields are required.", error });
    }
    const response = await artistService.activeOrDeactiveArtistService(id);
    if (!response.success) {
      return res
        .status(401)
        .json({ message: "Error! Please try again.", error });
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(401).json({ message: "Error! Please try again.", error });
  }
};

exports.getAllArtist = async (req, res) => {
  try {
    const { filter, search } = req.query;
    const response = await artistService.getAllArtistService(filter, search);
    if (!response.success) {
      return res
        .status(401)
        .json({ message: "Error! Please try again.", error });
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(401).json({ message: "Error! Please try again.", error });
  }
};

exports.getArtistById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(401)
        .json({ message: "Id fields are required.", error });
    }
    const response = await artistService.getArtistByIdService(id);
    if (!response.success) {
      return res
        .status(401)
        .json({ message: "Error! Please try again.", error });
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(401).json({ message: "Error! Please try again.", error });
  }
};

exports.interactArtist = async (req, res) => {
  try {
    const { id, userId, type } = req.params;
    if (!id) {
      return res
        .status(401)
        .json({ message: "Id fields are required.", error });
    }
    const response = await artistService.interactArtistService(
      id,
      userId,
      type
    );
    if (!response.success) {
      return res
        .status(401)
        .json({ message: "Error! Please try again.", error });
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(401).json({ message: "Error! Please try again.", error });
  }
};
