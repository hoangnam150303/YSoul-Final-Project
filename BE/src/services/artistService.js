const { conectPostgresDb } = require("../configs/database");

// this function is for admin, admin can create new artist
exports.createArtistService = async (name, avatar) => {
  try {
    // get name and avatar from controller
    // create new artist
    const artist = await conectPostgresDb.query(
      "INSERT INTO artists (name, avatar) VALUES ($1, $2)",
      [name, avatar]
    );
    // if create not success return error
    if (!artist) {
      throw new Error("Error");
    }
    return { success: true };
  } catch (error) {
    console.log(error);
  }
};

// this function is for admin, admin can update information of artist
exports.updateArtistService = async (id, name, avatar) => {
  try {
    // get id, name and avatar from controller

    // create 2 variables query and values
    let query, values;

    if (avatar) {
      // if avatar is exist update name and avatar
      query = "UPDATE artists SET name = $1, avatar = $2 WHERE id = $3";
      values = [name, avatar, id];
    } else {
      // if avatar is not exist update name
      query = "UPDATE artists SET name = $1 WHERE id = $2";
      values = [name, id];
    }
    // create variable artist and it equal the result after update information
    const artist = await conectPostgresDb.query(query, values);
    // if update not success return error
    if (!artist) {
      throw new Error("Error");
    }
    return { success: true };
  } catch (error) {
    console.log(error);
  }
};

exports.activeOrDeactiveArtistService = async (id) => {
  try {
    const artist = await conectPostgresDb.query(
      `SELECT * FROM artists WHERE id = ${id}`
    );
    if (!artist) {
      throw new Error("Error");
    }
    let query;
    if (artist.rows[0].isdeleted === true) {
      query = `UPDATE artists SET isdeleted = false WHERE id = ${id}`;
    } else {
      query = `UPDATE artists SET isdeleted = true WHERE id = ${id}`;
    }
    await conectPostgresDb.query(query);
    return { success: true };
  } catch (error) {
    console.log(error);
  }
};

exports.getAllArtistService = async (filter, search) => {
  try {
    let filterOptions = "";
    let sortOrder = "DESC";
    const searchValue = search ? `%${search}%` : "%";
    switch (filter) {
      case "Popular":
        filterOptions = "likes";
        break;
      case "Favorites":
        filterOptions = "follows";
        break;
      case "isDeleted":
        filterOptions = "isdeleted = true";
        break;
      case "Active":
        filterOptions = "isdeleted = false";
        break;
      default:
        filterOptions = "id";
    }
    const artists = await conectPostgresDb.query(
      `SELECT * FROM artists WHERE name LIKE $1 ORDER BY ${filterOptions} ${sortOrder}`,
      [searchValue]
    );
    if (!artists) {
      throw new Error("No artists found");
    }
    return { success: true, artists: artists.rows };
  } catch (error) {
    console.log(error);
  }
};

exports.getArtistByIdService = async (id) => {
  try {
    const artist = await conectPostgresDb.query(
      `SELECT * FROM artists WHERE id = ${id}`
    );
    const singles = await conectPostgresDb.query(
      `SELECT * FROM singles WHERE artist_id = ${id}`
    );
    const albums = await conectPostgresDb.query(
      `SELECT * FROM albums WHERE artist_id = ${id}`
    );
    if (!artist) {
      throw new Error("No artist found");
    }
    return {
      success: true,
      artist: artist.rows[0],
      singles: singles.rows,
      albums: albums.rows,
    };
  } catch (error) {
    console.log(error);
  }
};

exports.interactArtistService = async (id, userId, type) => {
  try {
    const artist = await conectPostgresDb.query(
      "SELECT * FROM artists WHERE id = $1"
    );
    if (!artist) {
      throw new Error("Error");
    }
    let query;
    if (type === "follow") {
      query = `UPDATE artists SET follows = follows + 1 WHERE id = ${id}`;
    } else if (type === "unfollow") {
      query = `UPDATE artists SET follows = follows - 1 WHERE id = ${id}`;
    } else if (type === "like") {
      query = `UPDATE artists SET likes = likes + 1 WHERE id = ${id}`;
    } else if (type === "unlike") {
      query = `UPDATE artists SET likes = likes - 1 WHERE id = ${id}`;
    }
    
    await conectPostgresDb.query(query);
    return { success: true };
  } catch (error) {
    console.log(error);
  }
};
