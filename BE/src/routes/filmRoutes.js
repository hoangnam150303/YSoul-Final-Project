const express = require("express");
const filmRoute = express.Router();
const auth = require("../middlewares/auth");
const filmController = require("../controllers/filmController");
const upload = require("../utils/multer");

filmRoute.post(
  "/createFilm",
  auth.isAdmin,
  upload.fields([
    { name: "small_image", maxCount: 1 },
    { name: "large_image", maxCount: 1 },
    { name: "movie", maxCount: 1 },
  ]),
  filmController.createFilm
);

filmRoute.get("/getAllFilm", filmController.getAllFilm);
filmRoute.get("/getFilmById/:id", filmController.getFilmById);
filmRoute.put(
  "/updateFilmById/:id",
  auth.isAdmin,
  upload.fields([
    { name: "small_image", maxCount: 1 },
    { name: "large_image", maxCount: 1 },
    { name: "movie", maxCount: 1 },
  ]),
  filmController.updateFilmById
);
filmRoute.put(
  "/activeOrDeactiveFilmById/:id",
  auth.isAdmin,

  filmController.activeOrDeactiveFilmById
);

module.exports = filmRoute;
