const { connectPostgresDb } = require("../../configs/database");

const createSingleTableQuery = `
 CREATE TABLE IF NOT EXISTS singles  (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(100) NOT NULL,
    image VARCHAR(200),
    mp3 VARCHAR(200),
    release_year VARCHAR(10),,
    is_deleted BOOLEAN DEFAULT false,
    count_listen INTEGER DEFAULT 0,
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    album_id UUID REFERENCES albums(id) ON DELETE CASCADE,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
