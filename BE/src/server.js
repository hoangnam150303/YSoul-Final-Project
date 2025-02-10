const express = require("express");
const passport = require("passport");
const dotenv = require("dotenv");
const { conectPostgresDb, connectMongoDb } = require("./configs/database");
dotenv.config();
const cors = require("cors");
const session = require("express-session");
const bodyParser = require("body-parser");
const userRoute = require("./routes/userRoutes");
const filmRoute = require("./routes/filmRoutes");
const invoiceRoute = require("./routes/invoiceRoutes");
const artistRoute = require("./routes/artistRoutes");
// Routes
const corsConfig = require("./configs/corsConfig");

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(passport.initialize());
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Khóa bí mật cho session, thêm vào file .env
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Nếu bạn dùng HTTPS, hãy set `secure: true`
  })
);

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  next();
});
app.use(cors(corsConfig));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", userRoute);
app.use("/film", filmRoute);
app.use("/invoice", invoiceRoute);
app.use("/artist", artistRoute);
// Start server
app.listen(port, () => {
  console.log(`Server is working on port: ${port}`);
  connectMongoDb();
  conectPostgresDb.connect((err, client, release) => {
    if (err) {
      console.error("Error connecting to PostgreSQL:", err.stack);
    } else {
      console.log("Connected to PostgreSQL database!");
      release();
    }
  });
});
