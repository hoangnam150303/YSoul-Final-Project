const express = require("express");
const userRoute = express.Router();
const userController = require("../../controllers/UserController/userController");
const auth = require("../../middlewares/auth");
const upload = require("../../utils/multer");

userRoute.get("/getUser", auth.isAuth, userController.getUser);
userRoute.put("/activeOrDeactive/:id", auth.isAdmin, userController.activeOrDeactiveUser);
userRoute.put("/updateProfile/:id",upload.single("avatar"), auth.isAuth, userController.updateUserProfile);
userRoute.get("/getUserProfile", auth.isAuth, userController.getUserProfile);
userRoute.get("/getAllUser", auth.isAdmin, userController.getAllUsers);
userRoute.get("/getDetailUser/:id", auth.isVip, userController.getDetailUser);
userRoute.get("/getUserStore", auth.isAuth, userController.getUserStore);
userRoute.put("/updateUserAvatarNFT", auth.isAuth, userController.updateAvatarNFT);
module.exports = userRoute;
