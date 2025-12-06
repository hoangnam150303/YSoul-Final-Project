const authenticateService = require("../../services/AuthenticateService/authenticateService");
const { redisClient } = require("../../configs/database");
// this function is  login with google, user can login or register account with google account
exports.loginGoogle = async (req, res) => {
  try {
    const { user } = req;
    if (!user) {
      return res
        .status(401)
        .json({ message: "Error! Please try again.", error });
    }
    const respone = await authenticateService.loginGoogleService(user);
    if (!respone.success) {
      return res
        .status(401)
        .json({ message: "Error! Please try again.", error });
    }
    res.cookie("sessionId", respone.sessionId, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 1000 * 60 * 60 * 24, // 15 phút
    });
    return res.status(200).json(respone);
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

    const respone = await authenticateService.registerService(
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
    const respone = await authenticateService.sendCodeService(email, name);
    if (!respone.success) {
      return res
        .status(401)
        .json({ message: "Error! Please try again.", error });
    }
    return res.status(200).json(respone);
  } catch (error) {
    return res.status(500).json({ mesage: "Error!.", error });
  }
};

// this function is login account with email and password
exports.loginLocal = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "All fields are required." });
    }

    const respone = await authenticateService.loginLocalService(
      email,
      password
    );

    if (!respone.success) {
      const statusMap = {
        "User not found": 404,
        "Password is incorrect.": 401,
        "Your account is not active": 403,
      };
      return res.status(statusMap[respone.error] || 400).json(respone);
    }
    res.cookie("sessionId", respone.sessionId, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 1000 * 60 * 60 * 24, // 15 phút
    });
    return res.status(200).json(respone);
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, error: "Email is required." });
    }
    const respone = await authenticateService.forgotPasswordService(email);
    if (!respone.success) {
      console.log(respone)
      return res.status(400).json(respone);
    }
    return res.status(200).json(respone);
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, verifyToken, otp } = req.body;

    if (!password || !confirmPassword || !verifyToken || !otp) {
      return res
        .status(400)
        .json({ success: false, error: "All fields are required." });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: "Password and confirm password do not match.",
      });
    }
    const respone = await authenticateService.resetPasswordService(
      password,
      verifyToken,
      otp
    );
    if (!respone.success) {
      return res.status(400).json(respone);
    }
    return res.status(200).json(respone);
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const sessionId = req.cookies.sessionId;
    if (!sessionId) {
      return res
        .status(400)
        .json({ success: false, error: "Session ID is required." });
    }
    const respone = await authenticateService.refreshTokenService(sessionId);
    if (!respone.success) {
      return res.status(400).json(respone);
    }
    return res.status(200).json(respone);
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

exports.logout = async (req, res) => {
  try {
    const sessionId = req.cookies.sessionId;
    await redisClient.del(sessionId);
    res.clearCookie("sessionId");
    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
