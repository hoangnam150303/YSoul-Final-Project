const { conectPostgresDb } = require("../configs/database");
exports.createAlbumService = async (title, artistId, image, mp3,releaseDate) => {
    try {
        let validAlbum = await conectPostgresDb.query(
            `SELECT * FROM albums WHERE title = '${title}' AND artist_id = ${artistId}`
        )
        if (validAlbum.rows.length > 0) {
            throw new Error("Album already exists")
        }
        validAlbum =  await conectPostgresDb.query(
            `INSERT INTO albums (title, artist_id, image, mp3, release_date) VALUES ('${title}', ${artistId}, '${image}', '${mp3}', '${releaseDate}')`
        )
        if (!validAlbum.rowCount > 0) {
            throw new Error("Album not created")
        }
        return { success: true }
    } catch (error) {
        console.log(error);
    }
};