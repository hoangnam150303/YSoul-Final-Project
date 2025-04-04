const { connectPostgresDb } = require("../../configs/database");

const createAlbumTableQuery = `
 CREATE TABLE IF NOT EXISTS albums  (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    image VARCHAR(200),
    release_year VARCHAR(10),
    is_deleted BOOLEAN DEFAULT false,
    artist_id INTEGER REFERENCES artists(id) ON DELETE CASCADE,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id_like INTEGER[] DEFAULT '{}'
)
`;

connectPostgresDb.query(createAlbumTableQuery, (err, res) => {
  if (err) {
    console.error("Error creating single table:", err);
  } else {
    console.log("Single table created successfully");
  }
});
