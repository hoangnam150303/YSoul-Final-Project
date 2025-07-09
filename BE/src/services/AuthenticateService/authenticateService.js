const { conectPostgresDb } = require("../../configs/database");
const passwordHelpers = require("../../helpers/passWordHelpers");
const mailHelpers = require("../../helpers/mailHelpers");
const jwt = require("jsonwebtoken");

exports.loginGoogleService = async (user) => {
  // this function is login with google account
  try {
    const userIsValid = await conectPostgresDb.query(
      "SELECT * FROM users WHERE authprovider = $1 AND email = $2",
      ["google", user.email]
    );
    if (userIsValid.status === false) {
      return res.status(401).json({ message: "Your account is not active" });
    }
    // Tạo access token
    const access_token = jwt.sign(
      // Generate access token
      {
        id: userIsValid.rows[0].id,
        is_admin: userIsValid.rows[0].is_admin,
        name: userIsValid.rows[0].name,
      },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: process.env.TOKEN_EXPIRED,
      }
    );
    return { success: true, access_token }; // Return access token
  } catch (error) {
    return { success: false, error }; // Return error
  }
};
// this function is register account with email, password and user name.
exports.registerService = async (name, email, password, otp, verifyToken) => {
  try {
    const decoded = jwt.verify(verifyToken, process.env.VERIFY_TOKEN); // Verify token

    if (decoded.otp.toString !== otp.toString) {
      // Check OTP
      return { success: false, error: "OTP is incorrect." };
    }

    const hashPassword = await passwordHelpers.hashPassword(password, 10); // Hash password

    await conectPostgresDb.query(
      // Insert user
      "INSERT INTO users (name, email, status, authprovider, password, vip) VALUES ($1, $2, $3, $4, $5,$6) RETURNING *",
      [name, email, true, "local", hashPassword, false]
    );

    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

// this function is send code to email
exports.sendCodeService = async (email, name) => {
  try {
    const validUser = await conectPostgresDb.query(
      // Check if user is exist
      "SELECT * FROM users WHERE email = $1 AND authprovider = $2",
      [email, "local"]
    );

    if (validUser.rows.length !== 0) {
      // If user is exist
      return { success: false, error: "User is exist" };
    }

    const otp = Math.floor(1000 + Math.random() * 90000).toString(); // Generate OTP

    const verifyToken = jwt.sign({ otp }, process.env.VERIFY_TOKEN, {
      // Generate verify token
      expiresIn: process.env.VERIFY_TOKEN_EXPIRED,
    });

    await mailHelpers.sendApproveAccount(email, name, otp); // Send email
    return { success: true, verifyToken };
  } catch (error) {
    return { success: false, error };
  }
};

// this function is login account with email and password
exports.loginLocalService = async (email, password) => {
  try {
    const user = await conectPostgresDb.query(
      // Check if user is exist
      "SELECT * FROM users WHERE email = $1 AND authprovider = $2",
      [email, "local"]
    );

    if (user.rows.length === 0) {
      // If user is not exist
      return { success: false, error: "User not found" };
    }
    if (user.rows[0].status === false) {
      // If user is not active
      return { success: false, error: "Your account is not active" };
    }
    const isMatch = await passwordHelpers.comparePassword(
      // Check password
      password,
      user.rows[0].password
    );

    if (!isMatch) {
      return { success: false, error: "Password is incorrect." };
    }

    await conectPostgresDb.query(
      // Update last login
      "UPDATE users SET lastlogin = $1 WHERE id = $2",
      [new Date(), user.rows[0].id]
    );

    const access_token = jwt.sign(
      // Generate access token
      {
        id: user.rows[0].id,
        is_admin: user.rows[0].is_admin,
        name: user.rows[0].name,
      },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: process.env.TOKEN_EXPIRED,
      }
    );
    return { success: true, access_token }; // Return access token
  } catch (error) {
    console.log(error);

    return { success: false, error }; // Return error
  }
};
