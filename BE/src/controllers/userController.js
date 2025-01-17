const { conectPostgresDb } = require("../configs/database");
const jwt = require("jsonwebtoken");
const userService = require("../services/userService");
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

exports.register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
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
    const respone = await userService.registerService(name, email, password);
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

exports.verify = async (req, res) => {
  try {
    const { verifyToken, otp } = req.body;
    if (!verifyToken || !otp) {
      return res
        .status(401)
        .json({ message: "All fields are required.", error });
    }
    const respone = await userService.verifyService(verifyToken, otp);
    console.log(respone);
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


exports.getUser = async (req, res) => {
  try {
    const user = await conectPostgresDb.query(
      "SELECT * FROM users WHERE id = $1",
      [req.user.id]
    );
    return res.status(200).json({
      id: user.rows[0].id,
      name: user.rows[0].name,
      role: user.rows[0].role,
    });
  } catch (error) {
    return res.status(401).json({ message: "Error! Please try again.", error });
  }
};
