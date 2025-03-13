const express = require("express");
const postRoute = express.Router();
const postController = require("../controllers/SocialMediaController.js/postController");
const auth = require("../middlewares/auth");
const upload = require("../utils/multer");

postRoute.post("/createPost", upload.single("image"), auth.isAuth, postController.createPost);
postRoute.put("/updatePost/:id", upload.single("image"), auth.isAuth, postController.updatePost);
module.exports = postRoute;
