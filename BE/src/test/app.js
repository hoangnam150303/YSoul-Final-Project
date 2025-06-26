const express = require("express");
const passport = require("passport");
const session = require("express-session");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");

dotenv.config();

const corsConfig = require("../configs/corsConfig");
const authRoute = require("../routes/AuthenticateRoute/authenticateRoutes");

const app = express();

app.use(passport.initialize());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  next();
});
app.use(cors(corsConfig));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// mount routes
app.use("/api/v1/auth", authRoute);
// mount thêm nếu có

module.exports = app;
