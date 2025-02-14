const { connectPostgresDb } = require("../configs/database");

const createSingleTableQuery = `
 CREATE TABLE IF NOT EXISTS singles  (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    image VARCHAR(200),
    mp3 VARCHAR(200),
    release_year DATE,
    is_deleted BOOLEAN DEFAULT false,
    count_listen INTEGER DEFAULT 0,
    artist_id INTEGER REFERENCES artists(id) ON DELETE CASCADE,
    album_id INTEGER REFERENCES albums(id) ON DELETE CASCADE,
    likes INTEGER DEFAULT 0,
    user_id_like INTEGER[] DEFAULT '{}';
)
`;

connectPostgresDb.query(createSingleTableQuery, (err, res) => {
  if (err) {
    console.error("Error creating single table:", err);
  } else {
    console.log("Single table created successfully");
  }
});
