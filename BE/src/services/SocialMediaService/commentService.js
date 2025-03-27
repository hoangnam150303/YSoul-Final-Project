const Post = require("../../models/post");
const {conectPostgresDb} = require("../../configs/database");
const Notification = require("../../models/notification");
// this function is post comment
exports.postCommentService = async (postId,content,userId) => {
    try {
        const validPost = await Post.findById(postId); // check if post is valid
        if (!validPost) { // check if post is not valid
            return {success:false,message: "Post not found"}; // return error message
        }
        const validUser = await conectPostgresDb.query("SELECT * FROM users WHERE id = $1", [userId]); // check if user is valid
        if (!validUser.rows.length) { // check if user is not valid
            return {success:false,message: "User not found"}; // return error message
        }
        // add comment, user_id and username,avatar to post
        validPost.comments.push({content:content,user_id:validUser.rows[0].id,username:validUser.rows[0].name,avatar:validUser.rows[0].avatar}); 
        await validPost.save(); // save post
        
        if (userId.toString() !== validPost.user_id) { // check if user is post owner
            await Notification.create({user_id:validPost.user_id,type:"comment",content:{user_id:userId,username:validUser.rows[0].name,avatar:validUser.rows[0].avatar}});
        }
        return {success:true,message: "Comment created successfully"};
    } catch (error) {
        return {success:false,message: "Internal server error"};
    }
};

// this function is update comment
exports.updateCommentService = async (commentId,postId,content) => {
    try {
        
        const validPost = await Post.findById(postId); // check if post is valid
        if (!validPost) { // check if post is not valid
            return {success:false,message: "Post not found"}; // return error message
        }
        const comment = validPost.comments.find(comment => comment.id === commentId); // find comment by id
        if (!comment) { // check if comment is not valid
            return {success:false,message: "Comment not found"}; // return error message
        }
        comment.content = content; // update content
        await validPost.save(); // save post
        return {success:true,message: "Comment updated successfully"};
    } catch (error) {
        return {success:false,message: "Internal server error"};   
    }
}

// this function is post reply comment
exports.postReplyCommentService = async (postId,commentId,content,userId) => {
    try {
        const validPost = await Post.findById(postId); // check if post is valid
        if (!validPost) { // check if post is not valid
            return {success:false,message: "Post not found"}; // return error message
        }
      
        const validUser = await conectPostgresDb.query("SELECT * FROM users WHERE id = $1", [userId]); // check if user is valid
        if (!validUser.rows.length) { // check if user is not valid
            return {success:false,message: "User not found"}; // return error message
        }
        const comment = validPost.comments.find(comment => comment.id === commentId); // find comment by id
        if (!comment) { // check if comment is not valid
            return {success:false,message: "Comment not found"}; // return error message
        }        
        comment.commentReplied.push({content:content,user_id:userId,username:validUser.rows[0].name,avatar:validUser.rows[0].avatar}); // add reply to comment
        await validPost.save(); // save post
        if (validPost.user_id !== userId.toString() && comment.user_id !== userId.toString()) { // check if user is not post owner
            await Notification.create({user_id:validPost.user_id,type:"comment",content:{user_id:userId,username:validUser.rows[0].name,avatar:validUser.rows[0].avatar}});
            await Notification.create({user_id:comment.user_id,type:"reply",content:{user_id:userId,username:validUser.rows[0].name,avatar:validUser.rows[0].avatar}});

        }
        return {success:true,message: "Reply comment created successfully"};
    } catch (error) {
        return {success:false,message: error.toString()};
    }
}

// this function is update reply comment
exports.updateCommentReplyService = async (commentId,postId,replyId,content) => {
    try {
        const validPost = await Post.findById(postId); // check if post is valid
        if (!validPost) { // check if post is not valid
            return {success:false,message: "Post not found"}; // return error message
        }
        const comment = validPost.comments.find(comment => comment.id === commentId); // find comment by id
        if (!comment) { // check if comment is not valid
            return {success:false,message: "Comment not found"}; // return error message
        }
        const reply = comment.commentReplied.find(reply => reply.id === replyId); // find reply by id
        if (!reply) { // check if reply is not valid
            return {success:false,message: "Reply not found"}; // return error message
        }
        reply.content = content; // update content
        await validPost.save(); // save post
        return {success:true,message: "Reply comment updated successfully"};
    } catch (error) {
        return {success:false,message: "Internal server error"};   
    }
}

// this function is delete comment
exports.deleteCommentService = async (postId,commentId,userId) => {
    try {

        
        const validPost = await Post.findById(postId); // check if post is valid
        if (!validPost) { // check if post is not valid
            return {success:false,message: "Post not found"}; // return error message
        }
        const comment = validPost.comments.find(comment => comment.id === commentId); // find comment by id
        if (!comment) { // check if comment is not valid
            return {success:false,message: "Comment not found"}; // return error message
        }  
        if (comment.user_id !== userId.toString() && validPost.user_id !== userId.toString()) {
            return { success: false, message: "You are not allowed to delete this comment" }; 
        }        
        validPost.comments = validPost.comments.filter(comment => comment.id !== commentId); // delete comment
        await validPost.save(); // save post
        return {success:true,message: "Comment deleted successfully"};
    } catch (error) {
        return {success:false,message: error.toString()};
    }
};

// this function is delete reply comment
exports.deleteCommentReplyService = async (postId,commentId,replyId,userId) => {
    try {
        const validPost = await Post.findById(postId); // check if post is valid
        if (!validPost) { // check if post is not valid
            return {success:false,message: "Post not found"}; // return error message
        }
        const comment = validPost.comments.find(comment => comment.id === commentId); // find comment by id
        if (!comment) { // check if comment is not valid
            return {success:false,message: "Comment not found"}; // return error message
        }
        const reply = comment.commentReplied.find(reply => reply.id === replyId); // find reply by id
        if (!reply) { // check if reply is not valid
            return {success:false,message: "Reply not found"}; // return error message
        }  
        if (reply.user_id !== userId.toString() && validPost.user_id !== userId.toString()) {
            return { success: false, message: "You are not allowed to delete this reply" }; 
        }        
        comment.commentReplied = comment.commentReplied.filter(reply => reply.id !== replyId); // delete reply
        await validPost.save(); // save post
        return {success:true,message: "Reply comment deleted successfully"}; // return success message
    } catch (error) {
        return {success:false,message: error.toString()}; // return error message
    }
};