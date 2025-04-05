const userService = require("../../services/UserService/userService");

// this function is get user information
exports.getUser = async (req, res) => {
  try {
   const userId = req.user.id; // get userId from request user
   const response = await userService.getUserService(userId); // call getUserService from userService
    if (!response.success) {
      return res.status(401).json({ message: "Error! Please try again.", error });
    }
   return res.status(200).json(response); // return response
  } catch (error) {
    return res.status(401).json({ message: "Error! Please try again.", error });
  }
};

exports.forgotPassword = async (req, res) => {};

exports.getAllUsers = async (req, res) => {
  try {
    const {filter,search,typeUser} = req.query
    const response = await userService.getAllUsersService(filter,search,typeUser);
    if (!response.success) {
      return res.status(401).json({ message: "Error! Please try again.", error });
    }
   return res.status(200).json(response);
  } catch (error) {
    return res.status(401).json({ message: "Error! Please try again.", error });
  }
};

exports.activeOrDeactiveUser = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await userService.activeOrDeactiveUserService(id);
    if (!response.success) {
      return res.status(401).json({ message: "Error! Please try again.", error });
    }
   return res.status(200).json(response);
  } catch (error) {
    return res.status(401).json({ message: "Error! Please try again.", error });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;    
    const { name, email, password, confirmPassword, oldPassword,vip } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Password and confirm password do not match." });
    }
    const avatar = req.file?.path;
    const response = await userService.updateUserProfileService(id,name, email, password, oldPassword,vip,avatar);
    if (!response.success) {
      return res.status(401).json({ message: "Error! Please try again.", error });
    }
   return res.status(200).json(response);
  } catch (error) {
    return res.status(401).json({ message: "Error! Please try again.", error });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const response = await userService.getUserProfileService(userId);
    if (!response.success) {
      return res.status(401).json({ message: "Error! Please try again.", error });
    }
   return res.status(200).json(response);
  } catch (error) {
    return res.status(401).json({ message: "Error! Please try again.", error });
  }
};

exports.getDetailUser = async (req,res)=>{
  try {
    const { id } = req.params;
    const response = await userService.getDetailUserService(id);
    if (!response.success) {
      return res.status(401).json({ message: "Error! Please try again.", error });
    }
   return res.status(200).json(response);
  } catch (error) {
    return res.status(401).json({ message: "Error! Please try again.", error });
  }
}

