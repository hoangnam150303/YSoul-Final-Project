const singleService = require("../../services/MusicService/singleService");

// this function is for admin, admin can create new single
exports.createSingle = async (req, res) => {
  try {
    const { title, release_year, artist_id, album_id } = req.body; // get title, release_year, artist_id, album_id from body

    if (!req.files || !req.files["image"] || !req.files["image"][0]) {
      return res.status(400).send("Image file is required");
    }
    if (!req.files || !req.files["mp3"] || !req.files["mp3"][0]) {
      return res.status(400).send("MP3 file is required");
    }
    const image = req.files["image"][0].path; // get image from files
    const mp3 = req.files["mp3"][0].path; // get mp3 from files
    console.log(mp3, image);
    if (!title || !release_year || !artist_id) {
      // if title, mp3, release_year, artist_id is not exist
      return res.status(400).send("Please provide all required fields");
    }
    const response = await singleService.createSingleService(
      // call createSingleService from singleService
      title,
      image,
      mp3,
      release_year,
      artist_id,
      album_id
    );
    if (!response.success) {
      // if create not success
      return res.status(400).send("Single not created");
    }
    return res.status(200).send("Single created successfully"); // if create success
  } catch (error) {
    console.error("Lỗi chi tiết:", error.message);

    // Cách 2: Log ra toàn bộ cấu trúc lỗi (dùng JSON.stringify)
    console.error("Full Error Stack:", JSON.stringify(error, null, 2));
    return res.status(500).send("Internal Server Error");
  }
};

// this function is for admin, admin can update single
exports.updateSingle = async (req, res) => {
  try {
    const { title, release_year, artist_id, album_id } = req.body; // get title, release_year, artist_id, album_id from body
    const { id } = req.params;

    const image = req.files?.["image"]?.[0]?.path;
    const mp3 = req.files?.["mp3"]?.[0]?.path;

    if (!title || !release_year || !artist_id) {
      // if title, mp3, release_year, artist_id is not exist
      return res.status(400).send("Please provide all required fields");
    }

    const response = await singleService.updateSingleService(
      // call createSingleService from singleService
      id,
      title,
      image,
      mp3,
      release_year,
      artist_id,
      album_id
    );
    if (!response.success) {
      // if create not success
      return res.status(400).send("Single not updated");
    }
    return res.status(200).json("Single updated successfully"); // if create success
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// this function is for admin, admin can delete single
exports.activeOrDeactiveSingle = async (req, res) => {
  try {
    const { id } = req.params; // get id single from params
    if (!id) {
      // if id is not exist, return status 401
      return res.status(401).json({ message: "Single id is required." });
    }
    const response = await singleService.activeOrDeactiveSingleService(id); // if id exist, call activeOrDeactiveSingleService from singleService
    if (!response.success) {
      // if response is not success, return error message
      return res.status(401).json({ message: "Error! Please try again." });
    }
    return res.status(200).json(response); // return response
  } catch (error) {
    return res.status(500).json({ message: "Error! Please try again." });
  }
};

// this function is for user, user can get single
exports.getSingleById = async (req, res) => {
  try {
    const { id } = req.params; // get id single from params
    if (!id || id === "undefined") {
      // if id is not exist, return status 401
      return res.status(401).json({ message: "Single id is required." });
    }

    const response = await singleService.getSingleByIdService(id); // if id exist, call getSingleByIdService from singleService
    if (!response.success) {
      // if response is not success, return error message
      return res.status(401).json({ message: "Error! Please try again." });
    }
    return res.status(200).json(response); // return response
  } catch (error) {
    return res.status(500).json({ message: "Error! Please try again." });
  }
};

// this function for user and admin, user and admin can get all single
exports.getAllSingle = async (req, res) => {
  try {
    const { filter, search, typeUser } = req.query; // get filter, search and typeUser from query
    const response = await singleService.getAllSingleService(
      // call function getAllSingleService from singleService
      filter,
      search,
      typeUser
    ); // call getAllSingleService from singleService
    if (!response.success) {
      // if response is not success, return error message
      return res.status(401).json({ message: "Error! Please try again." });
    }
    return res.status(200).json(response); // return response
  } catch (error) {
    return res.status(500).json("Internal sever");
  }
};

// this function for user, users can interact single they want
exports.interactSingle = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.query;
    const userId = req.user.id;
    // get id, status, userid
    if (!id) {
      // if id is not exist, return error
      return res.status(400).json("id field is required!");
    }
    const response = await singleService.interactSingleService(
      id,
      status,
      userId
    ); // call function interactSingleService from singleService
    if (!response.success) {
      // if response not success, return error
      return res.status(400).json("fail to interact single");
    }
    return res.status(200).json("success"); // return success
  } catch (error) {
    return res.status(500).json("fail");
  }
};

// this function is for user, user can forward to another song
exports.nextSingle = async (req, res) => {
  try {
    const { id } = req.params; // get current song id
    if (!id) {
      // if id not exist return error. In front-end I will handle if user does not play any song, they can not click button next song.
      return res.status(400).json("Id field is required");
    }
    const response = await singleService.nextSingleService(id); // call function nextSingleService
    if (!response.success) {
      // if response is not success, return error
      console.log(response);

      return res.status(400).json("fail to get next single");
    }
    return res.status(200).json(response); // return response if respone success
  } catch (error) {
    console.log(error);

    return res.status(500).json("fail");
  }
};
