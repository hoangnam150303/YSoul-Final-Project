const { conectPostgresDb } = require("../configs/database");
const passwordHelpers = require("../helpers/passWordHelpers");
const mailHelpers = require("../helpers/mailHelpers");
const jwt = require("jsonwebtoken");

exports.registerService = async (name, email, password, otp, verifyToken) => {
  try {
    const decoded = jwt.verify(verifyToken, process.env.VERIFY_TOKEN);
    
    if (decoded.otp.toString !== otp.toString) {
      return { success: false, error: "OTP is incorrect." };
    }

    
    const hashPassword = await passwordHelpers.hashPassword(password, 10);
    console.log(hashPassword);
    
  await conectPostgresDb.query(
      "INSERT INTO users (name, email, status, authprovider, password) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, email, true, "local", hashPassword]
    );

    
    return { success: true };
  } catch (error) {
    console.log(error);
    
    return { success: false, error };
  }
};

exports.sendCodeService = async (email, name) => {
  try {
    const validUser = await conectPostgresDb.query(
      "SELECT * FROM users WHERE email = $1 AND authprovider = $2",
      [email, "local"]
    );

    if (validUser.rows.length !== 0) {
      return { success: false, error: "User is exist" };
    }

    const otp = Math.floor(1000 + Math.random() * 90000).toString();

    const verifyToken = jwt.sign({ otp }, process.env.VERIFY_TOKEN, {
      expiresIn: process.env.VERIFY_TOKEN_EXPIRED,
    });

    await mailHelpers.sendApproveAccount(email, name, otp);
    return { success: true, verifyToken };
  } catch (error) {}
};
exports.loginLocalService = async (email, password) => {
  try {
    const user = await conectPostgresDb.query(
      "SELECT * FROM users WHERE email = $1 AND authprovider = $2",
      [email, "local"]
    );
    if (user.rows.length === 0) {
      return { success: false, error: "User not found" };
    }
    const isMatch = await passwordHelpers.comparePassword(
      password,
      user.rows[0].password
    );
    if (!isMatch) {
      return { success: false, error: "Password is incorrect." };
    }
    await conectPostgresDb.query(
      "UPDATE users SET lastlogin = $1 WHERE id = $2",
      [new Date(), user.rows[0].id]
    );

    const access_token = jwt.sign(
      { id: user.rows[0].id, is_admin: user.rows[0].is_admin, name: user.rows[0].name },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: process.env.TOKEN_EXPIRED,
      }
    );
    return { success: true, access_token };
  } catch (error) {}
};

exports.getAllUsersService = async (filter, search) => {
  try {
    let filterOptions = "";
    let sortOrder = "DESC"; 
    const searchValue = search ? `%${search}%` : "%";
    switch (filter) {
      case "recent_login":
        filterOptions = "lastlogin";
        break;
      case "isDeleted":
        filterOptions = "is_deleted = true";
        break;
      case "Active":
        filterOptions = "is_deleted = false";
        break;
      default:
        filterOptions = "id";
    }
    
    let users;
    if (filter === "isDeleted") {
      users = await conectPostgresDb.query(
        `SELECT * FROM users WHERE name LIKE $1 AND is_deleted = true ORDER BY ${filterOptions} ${sortOrder}`,
        [searchValue]
      );
    } else if (filter === "Active") {
      users = await conectPostgresDb.query(
        `SELECT * FROM users WHERE name LIKE $1 AND is_deleted = false ORDER BY ${filterOptions} ${sortOrder}`,
        [searchValue]
      );
    } else {
      users = await conectPostgresDb.query(
        `SELECT * FROM users WHERE name LIKE $1 ORDER BY ${filterOptions} ${sortOrder}`,
        [searchValue]
      );
    }
    
    // Loại bỏ thuộc tính password khỏi mỗi user
    const sanitizedUsers = users.rows.map(user => {
      delete user.password;
      return user;
    });
    
    return { success: true, users: sanitizedUsers };
  } catch (error) {
    console.log(error);
  }
};
