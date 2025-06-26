const { conectPostgresDb } = require("../../configs/database");
const cloudinaryHelpers = require("../../helpers/cloudinaryHelpers");
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
    return { success: false, message: error.toString() };
  }
};

// this function is for admin, admin can update information of artist
exports.updateArtistService = async (id, name, avatar) => {
  try {
    // get id, name and avatar from controller

    // create 2 variables query and values
    let query, values;

    const validArtist = await conectPostgresDb.query(
      "SELECT * FROM artists where id = $1",
      [id]
    );
    if (avatar) {
      // if avatar is exist update name and avatar
      const result = await cloudinaryHelpers.removeFile(
        validArtist.rows[0].avatar
      );
      if (!result.success) {
        throw new Error("Error removing old avatar");
      } else {
        query = "UPDATE artists SET name = $1, avatar = $2 WHERE id = $3";
        values = [name, avatar, id];
      }
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
    return { success: false, message: error.toString() };
  }
};

// this function is for admin, admin can delete artist
exports.activeOrDeactiveArtistService = async (id) => {
  try {
    const artist = await conectPostgresDb.query(
      // get artist by id
      `SELECT * FROM artists WHERE id = ${id}`
    );
    if (!artist) {
      // if artist not found, return error message
      throw new Error("Error");
    }
    let query; // create variable query
    if (artist.rows[0].is_deleted === true) {
      // if artist is deleted
      query = `UPDATE artists SET is_deleted = false WHERE id = ${id}`; // set is_deleted to false
    } else {
      // if artist is not deleted
      query = `UPDATE artists SET is_deleted = true WHERE id = ${id}`; // set is_deleted to true
    }
    await conectPostgresDb.query(query); // update artist to database
    return { success: true };
  } catch (error) {
      return { success: false, message: error.toString() };
  }
};

// this function is for admin and user, admin and user can get all artists
exports.getAllArtistService = async (filter, search, typeUser) => {
  try {
    let filterOptions = ""; // set filterOptions to empty string
    let sortOrder = "DESC"; // set sortOrder to DESC
    const searchValue = search ? `%${search}%` : "%"; //  set searchValue to search or to empty string
    switch (
      filter // switch filter,
    ) {
      case "popular":
        filterOptions = "likes"; // if filter is popular, set filterOptions to likes
        break;
      case "isDeleted":
        filterOptions = "is_deleted = true"; // if filter is isDeleted, set filterOptions to is_deleted = true
        break;
        case "newest":
          filterOptions = "created_at"; // if filter is newest, set filterOptions to release_year
          break;
      case "Active":
        filterOptions = "is_deleted = false"; // if filter is Active, set filterOptions to is_deleted = false
        break;
      default:
        filterOptions = "id"; // if filter is not popular, isDeleted, Active, set filterOptions to id
    }
    let artists; // create variable artists
    if (typeUser === "admin") {
      // if typeUser is admin
      if (filter === "isDeleted") {
        artists = await conectPostgresDb.query(
          `SELECT * FROM artists WHERE name ILIKE  $1 AND is_deleted = true ORDER BY ${filterOptions} ${sortOrder}`, // get all artists from database
          [searchValue]
        );
      }else if(filter === "Active")
      {
        artists = await conectPostgresDb.query(
          `SELECT * FROM artists WHERE name ILIKE  $1 AND is_deleted = false ORDER BY ${filterOptions} ${sortOrder}`, // get all artists from database
          [searchValue]
        );
      }
      else{
        artists = await conectPostgresDb.query(
          `SELECT * FROM artists WHERE name ILIKE  $1 ORDER BY ${filterOptions} ${sortOrder}`, // get all artists from database
          [searchValue]
        );
      }
    } else if (typeUser === "user") {
      // if typeUser is user
      artists = await conectPostgresDb.query(
        // get all artists from database where is_deleted is false
        `SELECT * FROM artists WHERE name ILIKE  $1 AND is_deleted = false ORDER BY ${filterOptions} ${sortOrder}`,
        [searchValue]
      );
    }
    if (!artists) {
      // if artists not found, return error message
      throw new Error("No artists found");
    }
    return { success: true, artists: artists.rows }; // return success message and artists
  } catch (error) {
       return { success: false, message: error.toString() };
  }
};

// this function is for user, admin, user or admin can get artist by id
exports.getArtistByIdService = async (id) => {
  try {
    const artist = await conectPostgresDb.query(
      `SELECT * FROM artists WHERE id = $1`, [id]
    );
    const singles = await conectPostgresDb.query(
      `SELECT * FROM singles WHERE artist_id = $1`, [id]
    );
    const albums = await conectPostgresDb.query(
      `SELECT * FROM albums WHERE artist_id = $1`, [id]
    );

    if (!artist.rows.length) {
      throw new Error("No artist found");
    }

    return {
      success: true,
      artist: artist.rows[0],
      singles: singles.rows,
      albums: albums.rows,
    };
  } catch (error) {
    console.log("Error in getArtistByIdService:", error);
    return { success: false, message: error.toString() };
  }
};


// this function is for user, user can interact with artist
exports.interactArtistService = async (id, userId, type) => {
  try {
    const artistResult = await conectPostgresDb.query(
      // get artist by id
      "SELECT * FROM artists WHERE id = $1",
      [id]
    );

    if (artistResult.rowCount === 0) {
      // if artist not found, return error message
      throw new Error("Artist not found");
    }

    const artist = artistResult.rows[0];

    if (type === "follow") {
      // check if userId is in user_id_follow array or not
      if (artist.user_id_follow.includes(userId)) {
        // if userId is in user_id_follow array, remove userId from array and decrease follows by 1
        await conectPostgresDb.query(
          `UPDATE artists
           SET follows = follows - 1,
               user_id_follow = array_remove(user_id_follow, $1)
           WHERE id = $2`,
          [userId, id]
        );
      } else {
        // if userId is not in user_id_follow array, add userId to array and increase follows by 1
        await conectPostgresDb.query(
          `UPDATE artists
           SET follows = follows + 1,
               user_id_follow = array_append(user_id_follow, $1)
           WHERE id = $2`,
          [userId, id]
        );
      }
    } else if (type === "like") {
      // check if userId is in user_id_like array or not
      if (artist.user_id_like.includes(userId)) {
        // if userId is in user_id_like array, remove userId from array and decrease likes by 1
        await conectPostgresDb.query(
          `UPDATE artists
           SET likes = likes - 1,
               user_id_like = array_remove(user_id_like, $1)
           WHERE id = $2`,
          [userId, id]
        );
      } else {
        //  if userId is not in user_id_like array, add userId to array and increase likes by 1
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

       return { success: false, message: error.toString() };
  }
};
