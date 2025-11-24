const express = require("express");
const filmRoute = express.Router();
const auth = require("../../middlewares/auth");
const filmController = require("../../controllers/FilmController/filmController");
const upload = require("../../utils/multer");

filmRoute.post(
  "/createFilm",
  auth.isAdmin,
  upload.fields([
    { name: "movie" },
    { name: "small_image", maxCount: 1 },
    { name: "large_image", maxCount: 1 },
  ]),
  filmController.createFilm
);

filmRoute.post("/addFilmToHistory/:id", auth.isAuth, filmController.addHistoryFilm);
filmRoute.get("/getAllFilm", filmController.getAllFilm);
filmRoute.get("/getFilmById/:id", filmController.getFilmById);
filmRoute.get("/getHistoryFilm", auth.isAuth, filmController.getHistoryFilm);
filmRoute.put(
  "/updateFilmById/:id",
  auth.isAdmin,
  upload.fields([
    { name: "small_image", maxCount: 1 },
    { name: "large_image", maxCount: 1 },
    { name: "movie" },
  ]),
  filmController.updateFilmById
);
filmRoute.put(
  "/activeOrDeactiveFilmById/:id",
  auth.isAdmin,

  filmController.activeOrDeactiveFilmById
);

filmRoute.put(
  "/updateStatusFilmById/:id/:type/:userId",
  auth.isAuth,
  filmController.updateStatusFilmById
);

module.exports = filmRoute;
