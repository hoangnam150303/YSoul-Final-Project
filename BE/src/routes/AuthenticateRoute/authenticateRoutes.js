const express = require("express");
const authRoute = express.Router();
const authController = require("../../controllers/AuthenticateController/authenticateController");
const passport = require("../../passport");

authRoute.post(
  "/loginGoogle",
  passport.authenticate("google-token", { session: false }),
  authController.loginGoogle
);

authRoute.post("/register", authController.register);
authRoute.post("/sendCode", authController.sendCode);
authRoute.post("/loginLocal", authController.loginLocal);
authRoute.post("/forgotPassword", authController.forgotPassword);
authRoute.put("/resetPassword", authController.resetPassword);
authRoute.put("/refreshToken", authController.refreshToken);
authRoute.post("/logout", authController.logout);
module.exports = authRoute;
