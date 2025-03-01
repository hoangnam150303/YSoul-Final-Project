const { connectPostgresDb } = require("../configs/database");

const createUserTableQuery = `
 CREATE TABLE IF NOT EXISTS users  (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    authProvider VARCHAR(15),
    lastLogin DATE,
    status BOOLEAN,
    google_id VARCHAR(50),
    avatar VARCHAR(200)
    vip BOOLEAN
    is_admin BOOLEAN
)
`;

connectPostgresDb.query(createUserTableQuery, (err, res) => {
  if (err) {
    console.error("Error creating user table:", err);
  } else {
    console.log("User table created successfully");
  }
});
