const { conectPostgresDb } = require("../../configs/database");
const Film = require("../../models/film");
const Post = require("../../models/Post");
const cloudinaryHelpers = require("../../helpers/cloudinaryHelpers");
// this function is create post
exports.createPostService = async (content, film_id, single_id, image, user_id) => {
    try {
        const validUser = await conectPostgresDb.query("SELECT * FROM users WHERE id = $1", [user_id]); // check if user_id is valid
        if (!validUser) { // check if user_id is not valid
            return {success:false,message: "User not found"};
        }
       
       let validFilm;
       if(film_id){
        validFilm = await Film.findById(film_id);
        if(!validFilm){
            return {success:false,message: "Film not found"};
        }
     
       }
        let validSingle;
        if(single_id){
            validSingle = await conectPostgresDb.query("SELECT * FROM singles WHERE id = $1", [single_id]);
            if (!validSingle) {
                return {success:false,message: "Single not found"};
            }
      
        }
       const newPost =  await Post.create({ 
            content,
            film_id,
            single_id,
            image,
            user_id
        });
      if (newPost) {
        return {success: true};
      }
      return {success:false,message: "Post not created"};
    } catch (error) {
        console.log(error);
        return {success:false,message: "Internal server error"};
        
    }
};

// this function is update post
exports.updatePostService = async (id,content,film_id,single_id,image) =>{
    try {
        const validPost = await Post.findById(id); // check if post is valid
        if (!validPost) { // check if post is not valid
            return {success:false,message: "Post not found"}; // return error message
        }
        const updatePost =   await Post.findByIdAndUpdate(id,{
            content,
        });
        if(image !== updatePost.image){ // check if image is not empty
            const result = await cloudinaryHelpers.removeFile(updatePost.image); // remove old image
            if (result) { // check if image is removed
                updatePost.image = image;
                updatePost.save();
            }
            else{ // check if image is not removed
                return {success:false,message: "Image not updated"};
            }
        } // check if image is not empty 
        if(film_id !== updatePost.film_id){ // check if film_id is not empty
          const validFilm = await Film.findById(film_id); 
            if(!validFilm){ // check if film_id is not valid
                return {success:false,message: "Film not found"}; // return error message
            }
            updatePost.film_id = film_id; // update film_id
            updatePost.save(); // save post
        }
        if(single_id !== updatePost.single_id){ // check if single_id is not empty
            
           const validSingle = await conectPostgresDb.query("SELECT * FROM singles WHERE id = $1", [single_id]); // check if single_id is valid
            if (!validSingle) { // check if single_id is not valid
                return {success:false,message: "Single not found"}; // return error message
            }
            updatePost.single_id = single_id; // update single_id
            updatePost.save(); // save post
        }
        if(updatePost){ // check if post is updated
            return {success:true}; // return success message
        }
        return {success:false,message: "Post not updated"}; // return error message
    } catch (error) {
        console.log(error);
        return {success:false,message: "Internal server"};
        
    }
}