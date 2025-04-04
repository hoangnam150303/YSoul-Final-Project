const express = require("express");
const userRoute = express.Router();
const userController = require("../../controllers/UserController/userController");
const auth = require("../../middlewares/auth");
const upload = require("../../utils/multer");

userRoute.put("/activeOrDeactive/:id", auth.isAdmin, userController.activeOrDeactiveUser);
userRoute.put("/updateProfile/:id",upload.single("avatar"), auth.isAuth, userController.updateUserProfile);
userRoute.get("/getUserProfile", auth.isAuth, userController.getUserProfile);
userRoute.get("/getUser", auth.isAuth, userController.getUser);
userRoute.get("/getAllUser", auth.isAdmin, userController.getAllUsers);


module.exports = userRoute;
