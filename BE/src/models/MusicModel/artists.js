const { connectPostgresDb } = require("../../configs/database");

const createArtistTableQuery = `
 CREATE TABLE IF NOT EXISTS artists  (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    avatar VARCHAR(200),
    is_deleted BOOLEAN DEFAULT false,
    likes INTEGER DEFAULT 0,
    follows INTEGER DEFAULT 0,
    user_id_like UUID[] DEFAULT '{}',
    user_id_follow UUID[] DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
)
`;

connectPostgresDb.query(createArtistTableQuery, (err, res) => {
  if (err) {
    console.error("Error creating artist table:", err);
  } else {
    console.log("Artist table created successfully");
  }
});
