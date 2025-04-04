const reviewerService = require('../../services/SocialMediaService/reviewerService'); // import reviewerService from SocialMediaService

// this function is follow user
exports.followUser = async(req,res)=>{
    try{
      const userFollowId = req.params.id; // get userFollowId from request params
      const userId = req.user.id; // get userId from request user
      const response = await reviewerService.followUserService(userId,userFollowId); // call followUserService from userService
      if (!response.success) { // if response is not success
        return res.status(401).json({ message: "Error! Please try again.", error }); // 
      }
     return res.status(200).json(response); // return response
    }catch(error){
      return res.status(401).json({ message: "Error! Please try again.", error }); // return error
    }
  }
  
exports.getAllReviewer = async(req,res)=>{
    try{
      const userId = req.user.id; // get userId from request user
      const {filter,search,pageSize,currentPage} = req.query    
      const response = await reviewerService.getAllReviewersService(userId,filter,search,pageSize,currentPage); // call getAllFollowersService from userService
      if (!response.success) { // if response is not success
        return res.status(401).json({ message: "Error! Please try again.", error }); // return error
      }
     return res.status(200).json(response); // return response
    }catch(error){
      return res.status(401).json({ message: "Error! Please try again.", error }); // return error
    }
  }