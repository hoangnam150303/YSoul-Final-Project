const dotenv = require("dotenv");
dotenv.config(); // Load environment variables

const { Pool } = require("pg"); // PostgreSQL library
const mongoose = require("mongoose");
const { createClient } = require("redis");

// PostgreSQL Connection
const conectPostgresDb = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DB,
  max: 1000, // max connections in pool
});
const redisClient = createClient({
  url: process.env.REDIS_URL, // redis://default:password@host:port
  socket: { tls: false, family: 4 }, // ép IPv4, không dùng TLS
});

redisClient.on("error", (err) => console.error("Redis error:", err));
redisClient.on("connect", () => console.log("Connected to Redis!"));

const connectRedisDb = async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error("Error connecting to Redis:", error);
  }
};

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
  connectRedisDb,
  redisClient,
};
