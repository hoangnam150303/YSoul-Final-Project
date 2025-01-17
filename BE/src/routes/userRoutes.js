const express = require("express");
const userRoute = express.Router();
const userController = require("../controllers/userController");
const passport = require("../passport");
const auth = require("../middlewares/auth");
userRoute.post(
  "/loginGoogle",
  passport.authenticate("google-token", { session: false }),
  userController.loginGoogle
);

userRoute.post("/register", userController.register);
userRoute.post("/verify", userController.verify);
userRoute.post("/loginLocal", userController.loginLocal);
userRoute.get("/getUser", auth.isAuth, userController.getUser);
module.exports = userRoute;
