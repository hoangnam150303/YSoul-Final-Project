const { conectPostgresDb } = require("../../configs/database");
const cloudinaryHelpers = require("../../helpers/cloudinaryHelpers");
// this function is for admin, admin can create new single
exports.createSingleService = async (
  title,
  image,
  mp3,
  release_year,
  artist_id,
  album_id
) => {
  try {
    if (!album_id || album_id === "null" || album_id === "") {
      album_id = null;
    }

    const validSingle = await conectPostgresDb.query(
      "SELECT * FROM singles WHERE title = $1 AND artist_id = $2",
      [title, artist_id]
    );

    if (validSingle.rows.length > 0) {
      throw new Error("Single already exists");
    }

    let query, values;

    if (album_id) {
      query = `
        INSERT INTO singles (title, image, mp3, release_year, artist_id, album_id)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
      values = [title, image, mp3, release_year, artist_id, album_id];
    } else {
      query = `
        INSERT INTO singles (title, image, mp3, release_year, artist_id)
        VALUES ($1, $2, $3, $4, $5)
      `;
      values = [title, image, mp3, release_year, artist_id];
    }

    const result = await conectPostgresDb.query(query, values);

    if (result.rowCount <= 0) {
      throw new Error("Single not created");
    }

    return { success: true };
  } catch (error) {
    console.log("Error in createSingleService:", error);
    return {
      success: false,
      message: error.toString(),
    };
  }
};

// this function is for admin, admin can update single
exports.updateSingleService = async (
  id,
  title,
  image,
  mp3,
  release_year,
  artist_id,
  album_id
) => {
  try {
    let validSingle = await conectPostgresDb.query(
      // get single by id
      `SELECT * FROM singles WHERE id = $1`,
      [id]
    );
    if (validSingle.rows.length === 0) {
      // if single not exists, return error message
      throw new Error("Single not found");
    }
    let query, values; // create 2 variables query and values
    if (image) {
      // remove old image
      const result = await cloudinaryHelpers.removeFile(
        // call function removeFile from cloudinaryHelpers
        validSingle.rows[0].image
      );
      if (!result.success) {
        // if remove not success
        throw new Error("Error removing old image");
      } else {
        await conectPostgresDb.query(
          // update image
          `UPDATE singles SET image = $1 WHERE id = $2`,
          [image, id] // use parameterized query
        );
      }
    }

    if (mp3) {
      // remove old mp3

      await conectPostgresDb.query(
        `UPDATE singles SET mp3 = $1 WHERE id = $2`,
        [mp3, id] // use parameterized query
      );
    }
    if (album_id) {
      // if album_id is exist
      query = `update singles set title = $1, release_year = $2, artist_id = $3, album_id = $4 where id = $5`; // create single with album_id
      values = [title, release_year, artist_id, album_id, id]; // create single with album_id
    } else {
      query = `update singles set title = $1, release_year = $2, artist_id = $3 where id = $4`; // create single without album_id
      values = [title, release_year, artist_id, id];
    }
    validSingle = await conectPostgresDb.query(query, values); // update single

    return { success: true }; // if single created, return success message
  } catch (error) {
    console.log(error);
    return { success: false, message: error.message };
  }
};

// this function is for admin, admin can delete single
exports.activeOrDeactiveSingleService = async (id) => {
  try {
    let singleValid = await conectPostgresDb.query(
      // get single by id
      `SELECT * FROM singles WHERE id = $1`,
      [id]
    );

    if (singleValid.rows.length === 0) {
      // if single not exists return error message
      throw new Error("Single not found");
    }
    let query; // create variable query
    let queryValues;
    if (singleValid.rows[0].is_deleted === true) {
      // if single is deleted, query will equal sql query and set is_deleted to false
      query = `UPDATE singles SET is_deleted = false WHERE id = $1`;
      queryValues = [id];
    } else if (singleValid.rows[0].is_deleted === false) {
      // if single is not deleted, query will equal sql query and set is_deleted to true
      query = `UPDATE singles SET is_deleted = true WHERE id = $1 `;
      queryValues = [id];
    }

    singleValid = await conectPostgresDb.query(query, queryValues); // update single to database

    if (singleValid.rowCount === 0) {
      // if single not updated, return error message
      throw new Error("Single not updated");
    }
    return { success: true }; // if single updated, return success message
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

// this function is for user, user can get single
exports.getSingleByIdService = async (id) => {
  try {
    const singleResult = await conectPostgresDb.query(
      "SELECT * FROM singles WHERE id = $1",
      [id]
    );

    if (singleResult.rows.length === 0) {
      throw new Error("Single not found");
    }

    const single = singleResult.rows[0];

    const artistResult = await conectPostgresDb.query(
      "SELECT name FROM artists WHERE id = $1",
      [single.artist_id] // ✅ dùng placeholder an toàn
    );

    const artistName =
      artistResult.rows.length > 0
        ? artistResult.rows[0].name
        : "Unknown Artist";

    return {
      success: true,
      data: single,
      artistName,
    };
  } catch (error) {
    console.log("Error in getSingleByIdService:", error);
    return { success: false, message: error.toString() };
  }
};

// this function is for user and admin, user and admin can get all single
exports.getAllSingleService = async (filter, search, typeUser) => {
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
      case "favourite":
        filterOptions = "count_listen"; // if filter is favourite, set filterOptions to count_linsten
        break;
      case "newest":
        filterOptions = "created_at"; // if filter is newest, set filterOptions to release_year
        break;
      case "isDeleted":
        filterOptions = "is_deleted = true"; // if filter is isDeleted, set filterOptions to is_deleted = true
        break;
      case "Active":
        filterOptions = "is_deleted = false"; // if filter is Active, set filterOptions to is_deleted = false
        break;
      default:
        filterOptions = "id"; // if filter is not popular, isDeleted, Active, set filterOptions to id
    }
    let singles; // create variable singles
    if (typeUser === "admin") {
      // if typeUser is admin
      if (filter === "isDeleted") {
        singles = await conectPostgresDb.query(
          `SELECT * FROM singles WHERE title ILIKE  $1 AND is_deleted = true ORDER BY ${filterOptions} ${sortOrder}`, // get all artists from database
          [searchValue]
        );
      } else if (filter === "Active") {
        singles = await conectPostgresDb.query(
          `SELECT * FROM singles WHERE title ILIKE  $1 AND is_deleted = false ORDER BY ${filterOptions} ${sortOrder}`, // get all artists from database
          [searchValue]
        );
      } else {
        singles = await conectPostgresDb.query(
          `SELECT * FROM singles WHERE title ILIKE  $1 ORDER BY ${filterOptions} ${sortOrder}`, // get all artists from database
          [searchValue]
        );
      }
    } else if (typeUser === "user") {
      // if typeUser is user
      singles = await conectPostgresDb.query(
        // get all singles from database where is_deleted is false
        `SELECT * FROM singles WHERE title ILIKE  $1 AND is_deleted = false ORDER BY ${filterOptions} ${sortOrder}`,
        [searchValue]
      );
    }
    if (!singles) {
      // if artists not found, return error message
      throw new Error("No artists found");
    }
    return { success: true, singles: singles.rows }; // return success message and artists
  } catch (error) {
    throw new Error("Error get all single");
  }
};

// this function is for user, users can interact with single they want
exports.interactSingleService = async (id, status, userId) => {
  try {
    let validSingle = await conectPostgresDb.query(
      // get validSingle where id = id get from controller
      `SELECT * FROM singles WHERE id = $1`,
      [id]
    );
    if (validSingle.rows.length === 0) {
      // if validSingle is not exist, return error
      throw new Error("Single not found");
    }
    let query; // create query variable
    let queryValues;
    let single = validSingle.rows[0]; // create single and it equal validSingle
    const currentLikes = single.user_id_like || [];
    if (status === "listen") {
      // if status is listen
      query = `UPDATE singles SET count_listen = count_listen + 1 WHERE id = $1 `; // set query equal sql query, set count_listen of that single increase
      queryValues = [id];
    } else if (status === "like") {
      if (currentLikes.includes(userId)) {
        // if status is like and includes userId, remove userId in array user_id_like and decrease likes

        query = `UPDATE singles SET likes = likes - 1, user_id_like = array_remove(user_id_like, $1) WHERE id = $2 `;
        queryValues = [userId, id];
      } else {
        // if status is like and not includes userId, append userId in array user_id_like and increase likes
        query = `UPDATE singles SET likes = likes + 1, user_id_like = array_append(user_id_like, $1) WHERE id = $2 `;
        queryValues = [userId, id];
      }
    }

    validSingle = await conectPostgresDb.query(query, queryValues); // set validSingle agian and equal result get from database return

    if (validSingle.rowCount === 0) {
      // if rowcount === 0, return error
      throw new Error("Can not interact single success");
    }
    return { success: true }; // return success
  } catch (error) {
    console.log(error);
    return { success: false, message: error.toString() }; // return error
  }
};

// this function is for user,  user can forward to another song
exports.nextSingleService = async (id) => {
  try {
    const currentSingle = await conectPostgresDb.query(
      "SELECT * FROM singles WHERE id = $1",
      [id]
    );
    if (currentSingle.rows.length === 0) {
      throw new Error("Single not found");
    }

    const singles = await conectPostgresDb.query(
      "SELECT * FROM singles WHERE id != $1",
      [id]
    );
    if (singles.rows.length === 0) {
      throw new Error("No other singles available");
    }

    const randomIndex = Math.floor(Math.random() * singles.rows.length);
    const randomSingle = singles.rows[randomIndex];

    const artistName = await conectPostgresDb.query(
      "SELECT name FROM artists WHERE id = $1",
      [randomSingle.artist_id]
    );

    return {
      success: true,
      data: randomSingle,
      artistName: artistName.rows[0]?.name || "Unknown",
    };
  } catch (error) {
    console.log("Error in nextSingleService:", error);
    return { success: false, message: error.toString() };
  }
};
