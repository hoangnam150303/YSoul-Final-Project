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
    // Lấy dữ liệu artist theo id
    const artistResult = await conectPostgresDb.query(
      "SELECT * FROM artists WHERE id = $1",
      [id]
    );
    
    if (artistResult.rowCount === 0) {
      throw new Error("Artist not found");
    }
    
    const artist = artistResult.rows[0];

    if (type === "follow") {
      // Kiểm tra nếu userId đã có trong mảng user_id_follow hay chưa
      if (artist.user_id_follow.includes(userId)) {
        // Nếu đã follow, tiến hành xóa userId khỏi mảng và giảm follows đi 1
        await conectPostgresDb.query(
          `UPDATE artists
           SET follows = follows - 1,
               user_id_follow = array_remove(user_id_follow, $1)
           WHERE id = $2`,
          [userId, id]
        );
      } else {
        // Nếu chưa follow, thêm userId vào mảng và tăng follows lên 1
        await conectPostgresDb.query(
          `UPDATE artists
           SET follows = follows + 1,
               user_id_follow = array_append(user_id_follow, $1)
           WHERE id = $2`,
          [userId, id]
        );
      }
    } else if (type === "like") {
      // Kiểm tra nếu userId đã có trong mảng user_id_like hay chưa
      if (artist.user_id_like.includes(userId)) {
        // Nếu đã like, tiến hành xóa userId khỏi mảng và giảm likes đi 1
        await conectPostgresDb.query(
          `UPDATE artists
           SET likes = likes - 1,
               user_id_like = array_remove(user_id_like, $1)
           WHERE id = $2`,
          [userId, id]
        );
      } else {
        // Nếu chưa like, thêm userId vào mảng và tăng likes lên 1
        await conectPostgresDb.query(
          `UPDATE artists
           SET likes = likes + 1,
               user_id_like = array_append(user_id_like, $1)
           WHERE id = $2`,
          [userId, id]
        );
      }
    }
    return { success: true };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

