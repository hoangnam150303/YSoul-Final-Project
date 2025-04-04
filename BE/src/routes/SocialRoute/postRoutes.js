const express = require("express");
const postRoute = express.Router();
const postController = require("../../controllers/SocialMediaController.js/postController");
const auth = require("../../middlewares/auth");
const upload = require("../../utils/multer");

postRoute.post("/createPost", upload.single("image"), auth.isVip, postController.createPost);
postRoute.put("/updatePost/:id", upload.single("image"), auth.isVip, postController.updatePost);
postRoute.put("/activeOrDeactive/:id", auth.isVip, postController.activeOrDeactivePost);
postRoute.get("/getAllPost", auth.isVip, postController.getAllPost);
postRoute.get("/getPostById/:id", auth.isVip, postController.getPostById);
postRoute.put("/likePost/:id", auth.isVip, postController.likePost);
module.exports = postRoute;
