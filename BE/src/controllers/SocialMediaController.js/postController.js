const postService = require("../../services/SocialMediaService/postService");

// this function is create post
exports.createPost = async (req, res) => {
    try {
        const {content, film_id, single_id} = req.body; // film_id and single_id are optional
        const user_id = req.user.id; // get user_id from user
        const image = req.file?.path; // 
        if (!content  || !user_id) { // check if content and user_id is empty
            return res.status(400).json({message: "Please fill in all fields"});    // return error message
        }
        const response = await postService.createPostService(content, film_id, single_id, image, user_id); // call createPostService from postService
        if (!response.success) { // check if response is not success
            return res.status(400).json({message: response.message}); // return error message
        }
        return res.status(200).json({message: "Post created successfully"}); // return success message
    } catch (error) {
        return res.status(500).json({message: "Internal server error"}); // return error message
    }
};

// this function is update post
exports.updatePost = async(req,res) => {
    try {
        const {id} = req.params; // get id from params
        if (!id) { // check if id is empty
            return res.status(400).json({message: "Please fill in all fields"});
        }
        const {content,film_id,single_id} = req.body; // get content, film_id, single_id from body
        const image = req.file?.path; // get image from file
        const response = await postService.updatePostService(id,content,film_id,single_id,image); // call updatePostService from postService
        if (!response.success) {
            return res.status(400).json({message: response.message}); // return error message
        }
        return res.status(200).json({message: "Post updated successfully"}); // return success message
    } catch (error) {
        
    }
};