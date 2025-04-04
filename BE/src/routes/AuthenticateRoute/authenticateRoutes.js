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

module.exports = authRoute;