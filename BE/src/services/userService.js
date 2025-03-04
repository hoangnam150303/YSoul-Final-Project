const { conectPostgresDb } = require("../configs/database");
const passwordHelpers = require("../helpers/passWordHelpers");
const mailHelpers = require("../helpers/mailHelpers");
const jwt = require("jsonwebtoken");
const cloudinaryHelpers = require("../helpers/cloudinaryHelpers");
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
    if (user.rows[0].status === false) {
      return { success: false, error: "Your account is not active" };
      
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
  } catch (error) {
    console.log(error);
    
  }
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
      case "unactive":
        filterOptions = "status = true";
        break;
      case "Active":
        filterOptions = "status = false";
        break;
      default:
        filterOptions = "id";
    }
    
    let users;
    if (filter === "Active") {
      users = await conectPostgresDb.query(
        `SELECT * FROM users WHERE name LIKE $1 AND status = true ORDER BY ${filterOptions} ${sortOrder}`,
        [searchValue]
      );
    } else if (filter === "unactive") {
      users = await conectPostgresDb.query(
        `SELECT * FROM users WHERE name LIKE $1 AND status = false ORDER BY ${filterOptions} ${sortOrder}`,
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

exports.activeOrDeactiveUserService = async (id) => {
  try {
    const user = await conectPostgresDb.query(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );
    if (user.rows.length === 0) {
      return { success: false, error: "User not found" };
    }
    if (user.rows[0].status === false) {
      await conectPostgresDb.query(
        "UPDATE users SET status = true  WHERE id = $1",
        [id]
      );
    }else if (user.rows[0].status === true) {
      await conectPostgresDb.query(
        "UPDATE users SET status = false  WHERE id = $1",
        [id]
      );
    }
    return { success: true };
  } catch (error) {
    console.log(error);
  }
};

exports.updateUserProfileService = async (
  id,
  name,
  email,
  password,
  oldPassword,
  vip,
  avatar
) => {
  try {
    const user = await conectPostgresDb.query(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );
    if (user.rows.length === 0) {
      return { success: false, error: "User not found" };
    }

    // Nếu avatar được gửi (khác null hoặc rỗng), cập nhật avatar cùng name, email
    if (avatar) {
      await conectPostgresDb.query(
        "UPDATE users SET name = $1, email = $2, avatar = $3 WHERE id = $4",
        [name, email, avatar, id]
      );
    }

    // Nếu password được gửi (không phải chuỗi rỗng), cập nhật password
    if (password && password.trim() !== "") {
      
        const isMatch = await passwordHelpers.comparePassword(
          oldPassword,
          user.rows[0].password
        )
 
        
        if (!isMatch) {
        throw new Error("Old password is incorrect");
      } else {
        const hashPassword = await passwordHelpers.hashPassword(password, 10);
        await conectPostgresDb.query(
          "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4",
          [name, email, hashPassword, id]
        );
      }
    } else {
      // Nếu không cập nhật password thì cập nhật vip (và các trường khác)
      await conectPostgresDb.query(
        "UPDATE users SET name = $1, email = $2, vip = $3 WHERE id = $4",
        [name, email, vip, id]
      );
    }
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error: error.message };
  }
};


exports.getUserProfileService = async (id) => {
  try {
    const user = await conectPostgresDb.query(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );
    if (user.rows.length === 0) {
      return { success: false, error: "User not found" };
    }
    return { success: true, user: user.rows[0] };
  } catch (error) {
    
  }
}