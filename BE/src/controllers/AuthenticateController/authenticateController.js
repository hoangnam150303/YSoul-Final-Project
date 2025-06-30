const authenticateService = require("../../services/AuthenticateService/authenticateService");
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
  } catch (error) {}
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
    console.log(respone);

    if (!respone.success) {
      const statusMap = {
        "User not found": 404,
        "Password is incorrect.": 401,
        "Your account is not active": 403,
      };
      return res.status(statusMap[respone.error] || 400).json(respone); // ✅ trả nguyên response từ service
    }

    return res.status(200).json(respone);
  } catch (error) {
    console.error("LoginLocal Error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};
