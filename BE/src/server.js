const express = require("express");
const passport = require("passport");
const dotenv = require("dotenv");
const {
  conectPostgresDb,
  connectMongoDb,
  connectRedisDb,
} = require("./configs/database");
dotenv.config();
const cors = require("cors");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
// Import routes
const userRoute = require("./routes/UserRoute/userRoutes");
const filmRoute = require("./routes/FilmRoute/filmRoutes");
const invoiceRoute = require("./routes/PaymentRoute/invoiceRoutes");
const artistRoute = require("./routes/MusicRoute/artistRoutes");
const albumRoute = require("./routes/MusicRoute/albumRoutes");
const singleRoute = require("./routes/MusicRoute/singleRoutes");
const artistNFTRoute = require("./routes/MarketRoute/artistNFTRoutes");
const nftRoute = require("./routes/MarketRoute/nftRoutes");
const postRoute = require("./routes/SocialRoute/postRoutes");
const commentRoute = require("./routes/SocialRoute/commentRoutes");
const notificationRoute = require("./routes/SocialRoute/notificationRoutes");
const authRoute = require("./routes/AuthenticateRoute/authenticateRoutes");
const reviewerRoute = require("./routes/SocialRoute/reviewrRoutes");
const messageRoute = require("./routes/SocialRoute/messageRoutes");
const wishListRoute = require("./routes/WishListRoute/WishListRoute");
const dashBoardsRoute = require("./routes/DashBoardsRoute/DashBoardsRoute");
const corsConfig = require("./configs/corsConfig");
const { app, server } = require("./utils/socket");
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
// Middleware để sử dụng passport-local
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  next();
});
// config CORS
app.use(cors(corsConfig));
// config body-parser
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// use routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/reviewer", reviewerRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/film", filmRoute);
app.use("/api/v1/invoice", invoiceRoute);
app.use("/api/v1/artist", artistRoute);
app.use("/api/v1/album", albumRoute);
app.use("/api/v1/single", singleRoute);
app.use("/api/v1/artistNFT", artistNFTRoute);
app.use("/api/v1/nft", nftRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/comment", commentRoute);
app.use("/api/v1/notification", notificationRoute);
app.use("/api/v1/message", messageRoute);
app.use("/api/v1/wishList", wishListRoute);
app.use("/api/v1/dashBoards", dashBoardsRoute);
// Start server
server.listen(port, () => {
  console.log(`Server is working on port: ${port}`);
  connectMongoDb();
  connectRedisDb();
  conectPostgresDb.connect((err, client, release) => {
    if (err) {
      console.error("Error connecting to PostgreSQL:", err.stack);
    } else {
      console.log("Connected to PostgreSQL database!");
      release();
    }
  });
});
