const { conectPostgresDb } = require("../../configs/database");
const cloudinaryHelpers = require("../../helpers/cloudinaryHelpers");
// this function is for admin, admin can create new album
exports.createAlbumService = async (title, artistId, image, releaseYear) => {
  try {
    // Check if album already exists
    const validAlbum = await conectPostgresDb.query(
      `SELECT * FROM albums WHERE title = $1 AND artist_id = $2`,
      [title, artistId]
    );
    if (validAlbum.rows.length > 0) {
      throw new Error("Album already exists");
    }

    // Check if artist exists
    const validArtist = await conectPostgresDb.query(
      `SELECT * FROM artists WHERE id = $1`,
      [artistId]
    );
    if (validArtist.rows.length === 0) {
      throw new Error("Artist not exists");
    }

    // Insert album
    const insertedAlbum = await conectPostgresDb.query(
      `INSERT INTO albums (title, artist_id, image, release_year)
       VALUES ($1, $2, $3, $4)`,
      [title, artistId, image, releaseYear]
    );
    if (insertedAlbum.rowCount === 0) {
      throw new Error("Album not created");
    }

    return { success: true };
  } catch (error) {
    return { success: false, message: error.toString() };
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
      `SELECT * FROM albums WHERE id = $1`,
      [id]
    );
    let query;
    let queryValues;
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
        query = `UPDATE albums 
        SET title = $1, artist_id = $2, image = $3, release_year = $4 
        WHERE id = $5
      `;
        queryValues = [title, artistId, image, releaseYear, id];
      }
    } else {
      // if image not exists, update album without image
      query = `
        UPDATE albums 
        SET title = $1, artist_id = $2, release_year = $3 
        WHERE id = $4
      `;
      queryValues = [title, artistId, releaseYear, id];
    }

    validAlbum = await conectPostgresDb.query(
      // update album to database
      query,
      queryValues
    );
    return { success: true };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
};

// this function is for admin, admin can delete album
exports.activeOrDeactiveAlbumService = async (id) => {
  try {
    let validAlbum = await conectPostgresDb.query(
      // check if album exists, change is_deleted to true
      `SELECT * FROM albums WHERE id = $1`,
      [id]
    );
    if (!validAlbum.rowCount > 0) {
      // if album not deleted, return error message or if album not exists, return error message
      throw new Error("Album not found");
    }
    let query;
    let queryValues;
    if (validAlbum.rows[0].is_deleted === true) {
      // if album already deleted, return error message
      query = `UPDATE albums SET is_deleted = false WHERE id = $1`;
      queryValues = [id];
    } else {
      // if album not deleted, return success message
      query = `UPDATE albums SET is_deleted = true WHERE id = $1`;
      queryValues = [id];
    }
    await conectPostgresDb.query(
      // update album to database
      query,
      queryValues
    );
    return { success: true }; // return success message
  } catch (error) {
    console.log(error);
    return { success: false, message: error.toString() };
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
        filterOptions = "created_at"; // if filter is newest, set filterOptions to release_year
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
      if (filter === "isDeleted") {
        albums = await conectPostgresDb.query(
          // get all albums from database
          `SELECT * FROM albums WHERE title ILIKE  $1 AND is_deleted = true ORDER BY ${filterOptions}`,
          [searchValue]
        );
      } else if (filter === "Active") {
        albums = await conectPostgresDb.query(
          // get all albums from database
          `SELECT * FROM albums WHERE title ILIKE  $1 AND is_deleted = false ORDER BY ${filterOptions}`,
          [searchValue]
        );
      } else {
        albums = await conectPostgresDb.query(
          // get all albums from database
          `SELECT * FROM albums WHERE title ILIKE  $1 ORDER BY ${filterOptions}`,
          [searchValue]
        );
      }
    } else if (typeUser === "user") {
      // if typeUser is user
      albums = await conectPostgresDb.query(
        // get all albums from database where is_deleted is false
        `SELECT * FROM albums WHERE title ILIKE  $1 AND is_deleted = false ORDER BY ${filterOptions} ${sortOrder}`,
        [searchValue]
      );
    }
    if (!albums) {
      throw new Error("No albums found");
    }
    return { success: true, albums: albums.rows };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
};

// this function is for user, admin, user or admin can get album by id
exports.getAlbumByIdService = async (id) => {
  try {
    // Get album by id
    const validAlbum = await conectPostgresDb.query(
      `SELECT * FROM albums WHERE id = $1`,
      [id]
    );

    if (validAlbum.rows.length === 0) {
      throw new Error("Album not found");
    }

    const album = validAlbum.rows[0];

    // Get singles by album_id
    const singles = await conectPostgresDb.query(
      `SELECT * FROM singles WHERE album_id = $1`,
      [id]
    );

    // Get artist by artist_id
    const artist = await conectPostgresDb.query(
      `SELECT * FROM artists WHERE id = $1`,
      [album.artist_id]
    );

    return {
      success: true,
      album,
      singles: singles.rows,
      artist: artist.rows[0] || null,
    };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
};

// this function is for user ,user can interact with album
exports.interactAlbumService = async (id, type, userId) => {
  try {
    const validAlbum = await conectPostgresDb.query(
      // get album by id
      `SELECT * FROM albums WHERE id = $1`,
      [id]
    );
    if (!validAlbum.rows.length > 0) {
      // if album not found, return error message
      throw new Error("Album not found");
    }
    const album = validAlbum.rows[0]; // get album from validAlbum
    if (type === "like") {
      // if type is like
      const currentLikes = album.user_id_like || [];
      if (currentLikes.includes(userId)) {
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
    return { success: false, message: error.toString() };
  }
};
