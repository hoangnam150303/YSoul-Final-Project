const express = require("express");
const singleRoute = express.Router();
const auth = require("../../middlewares/auth");
const upload = require("../../utils/multer");
const singleController = require("../../controllers/MusicController/singleController");
singleRoute.post(
  "/createSingle",
  auth.isAdmin,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "mp3", maxCount: 1 },
  ]),
  singleController.createSingle
);

singleRoute.put(
  "/updateSingle/:id",
  auth.isAdmin,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "mp3", maxCount: 1 },
  ]),
  singleController.updateSingle
);

singleRoute.put(
  "/activeOrDeactive/:id",
  auth.isAdmin,
  singleController.activeOrDeactiveSingle
);
singleRoute.put(
  "/interactSingle/:id",
  auth.isVip,
  singleController.interactSingle
);
singleRoute.get(
  "/getSngleById/:id",
  auth.isVip,
  singleController.getSingleById
);
singleRoute.get("/getAllSingle", singleController.getAllSingle);
singleRoute.get("/nextSingle/:id", auth.isVip, singleController.nextSingle);
module.exports = singleRoute;
