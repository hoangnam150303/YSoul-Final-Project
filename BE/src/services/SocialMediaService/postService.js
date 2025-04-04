const { conectPostgresDb } = require("../../configs/database");
const Film = require("../../models/FilmModel/film");
const Post = require("../../models/SocialModel/post");
const cloudinaryHelpers = require("../../helpers/cloudinaryHelpers");
const Notification = require("../../models/SocialModel/notification");
const { getReceiverSocketId, io } = require("../../utils/socket");
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

// this function is active or deactive post
exports.activeOrDeactivePostService = async (id) => {
    try {
        const validPost = await Post.findById(id); // check if post is valid
        if (!validPost) { // check if post is not valid
            return {success:false,message: "Post not found"}; // return error message
        }
        validPost.isActive = !validPost.isActive; // update is_active
        validPost.save(); // save post
        if(validPost){ // check if post is updated
            return {success:true}; // return success message
        }
        return {success:false,message: "Post not updated"}; // return error message
    } catch (error) {
        return {success:false,message: error.toString()}; // return error message
    }
}

// this function is get all post
exports.getAllPostService = async (search) => {
    try {
        let users;
        let query;
        let values;
        let result = [];
        if (search !== "" && search !== undefined) { // check if search is not empty
            query = `SELECT * FROM users WHERE name ILIKE $1 AND status = true`; 
            values = [`%${search}%`]; // Sử dụng tham số hóa
        } else {
            query = `SELECT * FROM users WHERE status = true`;
            values = [];
        }        
        users = await conectPostgresDb.query(query, values); // Truy vấn an toàn
        const sanitizedUsers = users.rows.map(user => {
            delete user.password;
            delete user.vip;
            delete user.status;
            delete user.authprovider;
            delete user.lastlogin;
            delete user.google_id;
            delete user.is_admin;
            delete user.created_at;
            delete user.email;
            return user;
          });
          
        for (let i = 0; i < users.rows.length; i++) { 
            const post = await Post.find({ isActive: true })
                .where("user_id").equals(users.rows[i].id)
                .sort({ createdAt: -1 }); // find post by user_id   
            result = [...result, { user: sanitizedUsers[i], post: post }];
        }
        
        return { success: true, data: result }; // return success
    } catch (error) {
        console.error("Error fetching posts:", error);
        return { success: false, message: "Internal server error" };
    }
}

// this function is get post by id
exports.getPostByIdService = async (id) => {
    try {
        const validPost = await Post.findById(id); // check if post is valid
        if (!validPost) { // check if post is not valid
            return {success:false,message: "Post not found"}; // return error message
        }
        // find user by id
        const author = await conectPostgresDb.query("SELECT * FROM users WHERE id = $1", [validPost.user_id]); 
        if (author.rows.length === 0) { // check if user is not valid
            return {success:false,message: "User not found"};
        }
        const sanitizedUsers = author.rows.map(user => { // delete fields not need of user
            delete user.password;
            delete user.vip;
            delete user.status;
            delete user.authprovider;
            delete user.lastlogin;
            delete user.google_id;
            delete user.is_admin;
            delete user.created_at;
            delete user.email;
            return user;
          });
        const result = {post:validPost,author:sanitizedUsers}; // create result
        return {success:true,result}; // return success and result
    } catch (error) {
        console.log(error);
        return {success:false,message: "Internal server error"};
    }
}

// this function is like post
exports.likePostService = async (id,userId) => {
    try {
        const validPost = await Post.findById(id); // check if post is valid
        const validUser = await conectPostgresDb.query("SELECT * FROM users WHERE id = $1", [userId]); // check if user is valid
        if (!validPost || validUser.rows.length === 0) {// check if post and user are not valid
            return {success:false,message: "Post or user not found"}; // return error message
        } 
       
     if (validPost.likes.length !==0) {        
        const index = validPost.likes.findIndex(user => user.user_id === userId.toString());
        if (index !== -1) { // check if user is in likes
            validPost.likes.splice(index, 1); // remove user from likes
            await validPost.save(); // save post
            return {success:true,message: "Success"};
        }
        else{
            validPost.likes.push({user_id:userId,username:validUser.rows[0].name,avatar:validUser.rows[0].avatar}); // add user to likes
            await validPost.save(); // save post
        }
     }
    else{
        validPost.likes.push({user_id:userId,username:validUser.rows[0].name}); // add user to likes
        await validPost.save(); // save post
    }
    if (validPost.user_id !== userId.toString()) { // check if user is not post owner
      const newNotification =   await Notification.create({user_id:validPost.user_id,type:"like",content:{user_id:userId,username:validUser.rows[0].name,avatar:validUser.rows[0].avatar}});
        const receiverSocketId = getReceiverSocketId(validPost.user_id); // get receiver socket id
        io.to(receiverSocketId).emit("new-notification", newNotification);
    }
    return {success:true,message: "Success"}; 
    } catch (error) {
        return {success:false,message: "Internal server error"};
    }
}

// this function is get top post
exports.getTopPostService = async () => {
    try {
        const validPost = await Post.find({ isActive: true }).sort({ likes: -1 }); // find post by is_active
        if (!validPost) { // check if post is not valid
            return {success:false,message: "Post not found"}; // return error message
        }
        return {success:true,validPost}; // return success
    } catch (error) {
        return {success:false,message: "Internal server error"}; // return error message
    }
}