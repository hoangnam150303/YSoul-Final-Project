const express = require("express");
const postRoute = express.Router();
const postController = require("../../controllers/SocialMediaController.js/postController");
const auth = require("../../middlewares/auth");
const upload = require("../../utils/multer");

postRoute.post(
  "/createPost",
  upload.single("image"),
  auth.isAuth,
  postController.createPost
);
postRoute.put(
  "/updatePost/:id",
  upload.single("image"),
  auth.isAuth,
  postController.updatePost
);
postRoute.put(
  "/activeOrDeactive/:id",
  auth.isAuth,
  postController.activeOrDeactivePost
);
postRoute.get("/getAllPost", auth.isAuth, postController.getAllPost);
postRoute.get("/getPostById/:id", auth.isAuth, postController.getPostById);
postRoute.get("/getPostByUser/:id", auth.isAuth, postController.getPostByUser);
postRoute.put("/likePost/:id", auth.isAuth, postController.likePost);

module.exports = postRoute;
