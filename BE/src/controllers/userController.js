const { conectPostgresDb } = require("../configs/database");
const jwt = require("jsonwebtoken");
const userService = require("../services/userService");

// this function is  login with google, user can login or register account with google account
exports.loginGoogle = async (req, res) => {
  try {
    const { user } = req;
    const userIsValid = await conectPostgresDb.query(
      "SELECT * FROM users WHERE authprovider = $1 AND email = $2",
      ["google", user.email]
    );
    if (userIsValid.status === false) {
      return res.status(401).json({ message: "Your account is not active" });
    }
    // Tạo access token
    const access_token = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN, {
      expiresIn: process.env.TOKEN_EXPIRED,
    });
    res.status(200).json({ access_token, success: true });
  } catch (error) {
    return res.status(401).json({ message: "Lỗi! Vui lòng thử lại.", error });
  }
};

// this function is register account with email, password and user name.
exports.register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, otp, verifyToken } =
      req.body;
    const reg = /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)*$/;
    const isCheckEmail = reg.test(email);
    
    if (!name || !email || !password || !confirmPassword) {
      return res
        .status(401)
        .json({ message: "All fields are required.", error });
    }

    if (!isCheckEmail) {
      
      return res.status(401).json({ message: "Email is not valid.", error });
    }
    
    if (password !== confirmPassword) {
      return res.status(401).json({
        message: "Password and confirm password do not match.",
        error,
      });
    }
    
    
    const respone = await userService.registerService(
      name,
      email,
      password,
      otp,
      verifyToken
    );
    if (!respone.success) {
      return res
        .status(401)
        .json({ message: "Error! Please try again.", error });
    }
    return res.status(200).json(respone);
  } catch (error) {
    return res.status(401).json({ mesage: "Error! Please try again.", error });
  }
};

exports.sendCode = async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email) {
      return res
        .status(401)
        .json({ message: "All fields are required.", error });
    }
    const respone = await userService.sendCodeService(email, name);
    if (!respone.success) {
      return res
        .status(401)
        .json({ message: "Error! Please try again.", error });
    }
    return res.status(200).json(respone);
  } catch (error) {}
};

// this function is login account with email and password
exports.loginLocal = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(401)
        .json({ message: "All fields are required.", error });
    }
    const respone = await userService.loginLocalService(email, password);
    if (!respone.success) {
      return res
        .status(401)
        .json({ message: "Error! Please try again.", error });
    }
    return res.status(200).json(respone);
  } catch (error) {}
};

// this function is get user information
exports.getUser = async (req, res) => {
  try {
    const user = await conectPostgresDb.query(
      "SELECT * FROM users WHERE id = $1",
      [req.user.id]
    );
    return res.status(200).json({
      id: user.rows[0].id,
      name: user.rows[0].name,
      is_admin: user.rows[0].is_admin,
      vip: user.rows[0].vip,
    });
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