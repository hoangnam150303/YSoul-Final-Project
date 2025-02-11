const { connectPostgresDb } = require("../configs/database");

const createArtistTableQuery = `
 CREATE TABLE IF NOT EXISTS artists  (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    avatar VARCHAR(200),
    isdeleted BOOLEAN DEFAULT false,
    likes INTEGER DEFAULT 0,
    follows INTEGER DEFAULT 0,
    user_id_like INTEGER[] DEFAULT '{}',
    user_id_follow INTEGER[] DEFAULT '{}'

)
`;

connectPostgresDb.query(createArtistTableQuery, (err, res) => {
  if (err) {
    console.error("Error creating artist table:", err);
  } else {
    console.log("Artist table created successfully");
  }
});
