const dotenv = require("dotenv");
dotenv.config(); // Load environment variables

const { Pool } = require("pg"); // PostgreSQL library
const mongoose = require("mongoose");

// PostgreSQL Connection
const conectPostgresDb = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DB,
  max: 1000, // max connections in pool
});


// MongoDB Connection
const connectMongoDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: "ysoul",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB database!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

// Connect both databases

module.exports = {
  connectMongoDb,
  conectPostgresDb,
};
