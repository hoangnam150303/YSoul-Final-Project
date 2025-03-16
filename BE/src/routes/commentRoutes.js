const express = require("express");
const commentRoute = express.Router();
const commentController = require("../controllers/SocialMediaController.js/commentController");
const auth = require("../middlewares/auth");

commentRoute.post("/postComment/:postId", auth.isAuth, commentController.postComment);
commentRoute.put("/updateComment/:postId/:commentId", auth.isAuth, commentController.updateComment);
commentRoute.post("/replyComment/:postId/:commentId", auth.isAuth, commentController.postReplyComment);
commentRoute.put("/updateCommentReply/:postId/:commentId/:replyId", auth.isAuth, commentController.updateCommentReply);
commentRoute.delete("/deleteComment/:postId/:commentId", auth.isAuth, commentController.deleteComment);
commentRoute.delete("/deleteCommentReply/:postId/:commentId/:replyId", auth.isAuth, commentController.deleteCommentReply);
module.exports = commentRoute;
