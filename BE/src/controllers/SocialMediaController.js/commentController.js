const commentService = require("../../services/SocialMediaService/commentService");
// this function is post comment
exports.postComment = async (req,res)=>{
    try {
        const {postId} = req.params; // get postId from params
        const {content} = req.body; // get content from body
        const userId = req.user.id; // get userId from user
        if (!postId || !content || !userId) { // check if postId and content and userId is empty
            return res.status(400).json({message: "Please fill in all fields"});
        }
        const response = await commentService.postCommentService(postId,content,userId); // call postCommentService from commentService
        if (!response.success) { // check if response is not success
            return res.status(400).json({message: response.message});
        }
        return res.status(200).json({message: "Comment created successfully"}); // return success message
    } catch (error) {
        return res.status(500).json({message: "Internal server error"}); // return error message
    }
}

// this function is update comment
exports.updateComment = async(req,res)=>{
    try {
        const {commentId,postId} = req.params; // get commentId and postId from params
        const {content} = req.body; // get content from body
        if (!commentId || !postId) {
            return res.status(400).json({message: "Please fill in all fields"});
        }
        const response = await commentService.updateCommentService(commentId,postId,content); // call updateCommentService from commentService
        if (!response.success) {
            return res.status(400).json({message: response.message}); // return error message
        }
        return res.status(200).json({message: "Comment updated successfully"}); // return success message
    } catch (error) {
        return res.status(500).json({message: "Internal server error"}); // return error message
    }
}

// this function is post reply comment
exports.postReplyComment = async(req,res)=>{
    try {
        const {postId,commentId} = req.params; // get postId and commentId from params
        const {content} = req.body; // get content from body
        const userId = req.user.id; // get userId from user
        if (!postId || !commentId || !content || !userId) { // check if postId and commentId and content and userId is empty
            return res.status(400).json({message: "Please fill in all fields"});
        }
        const response = await commentService.postReplyCommentService(postId,commentId,content,userId); // call postReplyCommentService from commentService
        if (!response.success) { // check if response is not success
            return res.status(400).json({message: response.message});
        }
        return res.status(200).json({message: "Reply comment created successfully"}); // return success message
    } catch (error) {
        return res.status(500).json({message: "Internal server error"});
    }
}

// this function is update reply comment
exports.updateCommentReply = async(req,res)=>{
    try {
        const {commentId,postId,replyId} = req.params; // get commentId and postId and replyId from params
        const {content} = req.body; // get content from body
        if (!commentId || !postId || !replyId) { // check if commentId and postId and replyId is empty
            return res.status(400).json({message: "Please fill in all fields"});
        }
        const response = await commentService.updateCommentReplyService(commentId,postId,replyId,content); // call updateCommentReplyService from commentService
        if (!response.success) { // check if response is not success
            return res.status(400).json({message: response.message});
        }
        return res.status(200).json({message: "Reply comment updated successfully"}); // return success message
    } catch (error) {
        return res.status(500).json({message: "Internal server error"});
    }
}

// this function is delete comment
exports.deleteComment = async(req,res)=>{
    try {
        const {postId,commentId} = req.params; // get postId and commentId from params
        const userId = req.user.id; // get userId from user
        if (!postId || !commentId || !userId) { // check if postId and commentId and userId is empty
            return res.status(400).json({message: "Please fill in all fields"});
        }
        const response = await commentService.deleteCommentService(postId,commentId,userId); // call deleteCommentService from commentService
        if (!response.success) { // check if response is not success
            return res.status(400).json({message: response.message});
        }
        return res.status(200).json({message: "Comment deleted successfully"});
    } catch (error) {
        return res.status(500).json({message: "Internal server error"});
    }
};

// this function is delete reply comment
exports.deleteCommentReply = async(req,res)=>{
    try {
        const {postId,commentId,replyId} = req.params; // get postId and commentId and replyId from params
        const userId = req.user.id; // get userId from user
        if (!postId || !commentId || !replyId || !userId) { // check if postId and commentId and replyId and userId is empty
            return res.status(400).json({message: "Please fill in all fields"});
        }
        const response = await commentService.deleteCommentReplyService(postId,commentId,replyId,userId); // call deleteCommentReplyService from commentService
        if (!response.success) { // check if response is not success
            return res.status(400).json({message: response.message});
        }
        return res.status(200).json({message: "Reply comment deleted successfully"}); // return success message
    } catch (error) {
        return res.status(500).json({message: "Internal server error"}); // return error message
    }
};