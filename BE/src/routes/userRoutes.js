const express = require("express");
const userRoute = express.Router();
const userController = require("../controllers/userController");
const passport = require("../passport");
const auth = require("../middlewares/auth");
const upload = require("../utils/multer");
userRoute.post(
  "/loginGoogle",
  passport.authenticate("google-token", { session: false }),
  userController.loginGoogle
);

userRoute.post("/register", userController.register);
userRoute.post("/sendCode", userController.sendCode);
userRoute.post("/loginLocal", userController.loginLocal);
userRoute.put("/activeOrDeactive/:id", auth.isAdmin, userController.activeOrDeactiveUser);
userRoute.put("/updateProfile/:id",upload.single("avatar"), auth.isAuth, userController.updateUserProfile);
userRoute.get("/getUserProfile", auth.isAuth, userController.getUserProfile);
userRoute.get("/getUser", auth.isAuth, userController.getUser);
userRoute.get("/getAllUser", auth.isAdmin, userController.getAllUsers);
module.exports = userRoute;
