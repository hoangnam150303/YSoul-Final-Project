const { connectPostgresDb } = require("../configs/database");

const createSingleTableQuery = `
 CREATE TABLE IF NOT EXISTS albums  (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    image VARCHAR(200),
    mp3 VARCHAR(200),
    release_date DATE,
     isdeleted BOOLEAN DEFAULT false,
    artist_id INTEGER REFERENCES artists(id) ON DELETE CASCADE,
    
)
`;

connectPostgresDb.query(createSingleTableQuery, (err, res) => {
  if (err) {
    console.error("Error creating single table:", err);
  } else {
    console.log("Single table created successfully");
  }
});
