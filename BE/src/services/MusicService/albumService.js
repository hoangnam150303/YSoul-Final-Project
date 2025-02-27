const { conectPostgresDb } = require("../../configs/database");
const cloudinaryHelpers = require("../../helpers/cloudinaryHelpers");
// this function is for admin, admin can create new album
exports.createAlbumService = async (title, artistId, image, releaseYear) => {
  try {
    let validAlbum = await conectPostgresDb.query(
      // check if album already exists
      `SELECT * FROM albums WHERE title = '${title}' AND artist_id = ${artistId}`
    );
    if (validAlbum.rows.length > 0) {
      // if album already exists, return error message
      throw new Error("Album already exists");
    }
    const validArtitst = await conectPostgresDb.query(
      // check if artist already exists
      `SELECT * FROM artists WHERE id = ${artistId}`
    );
    if (validArtitst.rows.length === 0) {
      // if artist not exists, return error message
      throw new Error("Artist not exists");
    }
    validAlbum = await conectPostgresDb.query(
      // insert new album to database
      `INSERT INTO albums (title, artist_id, image, release_year) VALUES ('${title}', ${artistId}, '${image}', '${releaseYear}')`
    );
    if (!validAlbum.rowCount > 0) {
      // if album not created, return error message
      throw new Error("Album not created");
    }
    return { success: true };
  } catch (error) {
    console.log(error);
  }
};

// this function is for admin, admin can update album
exports.updateAlbumService = async (
  id,
  title,
  artistId,
  image,
  releaseYear
) => {
  try {
    let validAlbum = await conectPostgresDb.query(
      // check if album already exists
      `SELECT * FROM albums WHERE id = ${id}`
    );

    let query;
    if (validAlbum.rows.length === 0) {
      // if album not exists, return error message
      throw new Error("Album not exists");
    }
    if (image) {
      // if image exists, update album with image
      const result = await cloudinaryHelpers.removeFile(
        validAlbum.rows[0].image
      );
      if (!result.success) {
        throw new Error("Error removing old image");
      } else {
        query = `UPDATE albums SET title = '${title}', artist_id = ${artistId}, image = '${image}', release_year = '${releaseYear}' WHERE id = ${id}`;
      }
    } else {
      // if image not exists, update album without image
      query = `UPDATE albums SET title = '${title}', artist_id = ${artistId}, release_year = '${releaseYear}' WHERE id = ${id}`;
    }

    validAlbum = await conectPostgresDb.query(
      // update album to database
      query
    );
    return { success: true };
  } catch (error) {
    console.log(error);
  }
};

// this function is for admin, admin can delete album
exports.activeOrDeactiveAlbumService = async (id) => {
  try {
    let validAlbum = await conectPostgresDb.query(
      // check if album exists, change is_deleted to true
      `SELECT * FROM albums WHERE id = ${id}`
    );
    if (!validAlbum.rowCount > 0) {
      // if album not deleted, return error message or if album not exists, return error message
      throw new Error("Album not found");
    }
    let query;
    if (validAlbum.rows[0].is_deleted === true) {
      // if album already deleted, return error message
      query = `UPDATE albums SET is_deleted = false WHERE id = ${id}`;
    } else {
      // if album not deleted, return success message
      query = `UPDATE albums SET is_deleted = true WHERE id = ${id}`;
    }
    await conectPostgresDb.query(
      // update album to database
      query
    );
    return { success: true }; // return success message
  } catch (error) {
    console.log(error);
  }
};

// this function is for user, admin, user or admin can get all albums
exports.getAllAlbumService = async (filter, search, typeUser) => {
  try {
    let filterOptions = ""; // set filterOptions to empty string
    let sortOrder = "ASC"; // set sortOrder to DESC
    const searchValue = search ? `%${search}%` : "%"; // set searchValue to search or to empty string
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
        filterOptions = "release_year"; // if filter is newest, set filterOptions to release_year
        break;
      case "Active":
        filterOptions = "is_deleted = false"; // if filter is Active, set filterOptions to is_deleted = false
        break;
      default:
        filterOptions = "id"; // if filter is not popular, isDeleted, Active, set filterOptions to id
    }
    let albums;
    if (typeUser === "admin") {
      // if typeUser is admin
      albums = await conectPostgresDb.query(
        // get all albums from database
        `SELECT * FROM albums WHERE title LIKE $1 ORDER BY ${filterOptions} ${sortOrder}`,
        [searchValue]
      );
    } else if (typeUser === "user") {
      // if typeUser is user
      albums = await conectPostgresDb.query(
        // get all albums from database where is_deleted is false
        `SELECT * FROM albums WHERE title LIKE $1 AND is_deleted = false ORDER BY ${filterOptions} ${sortOrder}`,
        [searchValue]
      );
    }
    if (!albums) {
      throw new Error("No albums found");
    }
    return { success: true, albums: albums.rows };
  } catch (error) {
    console.log(error);
  }
};

// this function is for user, admin, user or admin can get album by id
exports.getAlbumByIdService = async (id) => {
  try {
    const validAlbum = await conectPostgresDb.query(
      `SELECT * FROM albums WHERE id = ${id}`
    ); // get album by id from database
    if (!validAlbum.rows.length > 0) {
      // if album not exists, return error message
      throw new Error("Album not found");
    }
    const singles = await conectPostgresDb.query(
      // find singles by album id
      `SELECT * FROM singles WHERE album_id = ${id}`
    );
    const artist = await conectPostgresDb.query(
      // find artist by album id
      `SELECT * FROM artists WHERE id = ${validAlbum.rows[0].artist_id}`
    );
    return {
      success: true,
      album: validAlbum.rows[0],
      singles: singles.rows,
      artist: artist.rows[0],
    };
  } catch (error) {
    console.log(error);
  }
};

// this function is for user ,user can interact with album
exports.interactAlbumService = async (id, type, userId) => {
  try {
    const validAlbum = await conectPostgresDb.query(
      // get album by id
      `SELECT * FROM albums WHERE id = ${id}`
    );
    if (!validAlbum.rows.length > 0) {
      // if album not found, return error message
      throw new Error("Album not found");
    }
    const album = validAlbum.rows[0]; // get album from validAlbum
    if (type === "like") {
      // if type is like
      if (album.user_id_like.includes(userId)) {
        // if user_id_like includes userId
        await conectPostgresDb.query(
          // update album likes and user_id_like, decrease likes and remove userId from user_id_like
          `UPDATE albums
                   SET likes = likes - 1,
                       user_id_like = array_remove(user_id_like, $1)
                   WHERE id = $2`,
          [userId, id]
        );
      } else {
        // if user_id_like not includes userId
        await conectPostgresDb.query(
          // update album likes and user_id_like, increase likes and add userId to user_id_like
          `UPDATE albums
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
  }
};
