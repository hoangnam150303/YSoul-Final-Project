const { conectPostgresDb } = require("../configs/database");
const passwordHelpers = require("../helpers/passWordHelpers");
const mailHelpers = require("../helpers/mailHelpers");
const Notification = require("../models/notification");
const jwt = require("jsonwebtoken");
const { getReceiverSocketId, io } = require("../utils/socket");
// this function is register account with email, password and user name.
exports.registerService = async (name, email, password, otp, verifyToken) => {
  try {
    const decoded = jwt.verify(verifyToken, process.env.VERIFY_TOKEN); // Verify token
    
    if (decoded.otp.toString !== otp.toString) { // Check OTP
      return { success: false, error: "OTP is incorrect." };
    }

    
    const hashPassword = await passwordHelpers.hashPassword(password, 10); // Hash password
    
  await conectPostgresDb.query( // Insert user
      "INSERT INTO users (name, email, status, authprovider, password) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, email, true, "local", hashPassword]
    );

    
    return { success: true };
  } catch (error) {

    
    return { success: false, error };
  }
};

// this function is send code to email
exports.sendCodeService = async (email, name) => {
  try {
    const validUser = await conectPostgresDb.query( // Check if user is exist
      "SELECT * FROM users WHERE email = $1 AND authprovider = $2",
      [email, "local"]
    );

    if (validUser.rows.length !== 0) { // If user is exist
      return { success: false, error: "User is exist" };
    }

    const otp = Math.floor(1000 + Math.random() * 90000).toString(); // Generate OTP

    const verifyToken = jwt.sign({ otp }, process.env.VERIFY_TOKEN, { // Generate verify token
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
    const user = await conectPostgresDb.query( // Check if user is exist
      "SELECT * FROM users WHERE email = $1 AND authprovider = $2",
      [email, "local"]
    );
    if (user.rows.length === 0) { // If user is not exist
      return { success: false, error: "User not found" };
    }
    if (user.rows[0].status === false) { // If user is not active
      return { success: false, error: "Your account is not active" };
      
    }
    const isMatch = await passwordHelpers.comparePassword( // Check password
      password,
      user.rows[0].password
    );
    
    if (!isMatch) {
      return { success: false, error: "Password is incorrect." };
    }
 
    await conectPostgresDb.query( // Update last login
      "UPDATE users SET lastlogin = $1 WHERE id = $2",
      [new Date(), user.rows[0].id]
    );

    const access_token = jwt.sign( // Generate access token
      { id: user.rows[0].id, is_admin: user.rows[0].is_admin, name: user.rows[0].name },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: process.env.TOKEN_EXPIRED,
      }
    );
    return { success: true, access_token }; // Return access token
  } catch (error) {
    return { success: false, error };  // Return error
    
  }
};

exports.getAllUsersService = async (filter, search,typeUser) => {
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
  if (typeUser === "admin") {
    if (filter === "Active") {
      users = await conectPostgresDb.query(
        `SELECT * FROM users WHERE name ILIKE  $1 AND status = true ORDER BY ${filterOptions} ${sortOrder}`,
        [searchValue]
      );
    } else if (filter === "unactive") {
      users = await conectPostgresDb.query(
        `SELECT * FROM users WHERE name ILIKE  $1 AND status = false ORDER BY ${filterOptions} ${sortOrder}`,
        [searchValue]
      );
  }
    } else {
      users = await conectPostgresDb.query(
        `SELECT * FROM users WHERE name LIKE $1 AND status = true ORDER BY ${filterOptions} ${sortOrder}`,
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
    console.log(error);
    
  }
}

// follow user
exports.followUserService = async (userId, userFollowId) => {
  try {
    const validUserFollow = await conectPostgresDb.query( // find user follow is exist
      "SELECT * FROM users WHERE id = $1",
      [userFollowId]
    )
    if (validUserFollow.rows.length === 0) { // If user is not exist
      return { success: false, error: "User not found" }; // Return error
    }
    const validUser = await conectPostgresDb.query( // find user is exist
      "SELECT * FROM users WHERE id = $1",
      [userId]
    );
    if (validUser.rows.length === 0) { // If user is not exist
      return { success: false, error: "User not found" }; // Return error
    }

    if (validUser.rows[0].user_follow.includes(parseInt(userFollowId))) { // If user is followed
      await conectPostgresDb.query(
        "UPDATE users SET user_follow = array_remove(user_follow, $1) WHERE id = $2", // Remove user follow
        [userFollowId, userId]
      )
      await conectPostgresDb.query(
        "UPDATE users SET user_followed = array_remove(user_followed, $1) WHERE id = $2", // Remove user
        [userId, userFollowId]
      )
    }
   else{
    await conectPostgresDb.query(
      "UPDATE users SET user_follow = array_append(user_follow, $1) WHERE id = $2", // Append user follow
      [userFollowId, userId]
    );
    await conectPostgresDb.query(
      "UPDATE users SET user_followed = array_append(user_followed, $1) WHERE id = $2", // Append user
      [userId, userFollowId]
    );
   const newNotification = await Notification.create({user_id:userFollowId,type:"follow",content:{user_id:userId,username:validUser.rows[0].name,avatar:validUser.rows[0].avatar}});
    const receiverSocketId = getReceiverSocketId(userFollowId); // get receiver socket id
    io.to(receiverSocketId).emit("new-notification", newNotification);

   }
  
    return { success: true }; // Return success
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// get all reviewers with filter and search
exports.getAllReviewersService = async (userId, filter, search, pageSize = 10, currentPage = 1) => {
  try {
    const validUser = await conectPostgresDb.query("SELECT * FROM users WHERE id = $1", [userId]);
    if (validUser.rows.length === 0) {
      return { success: false, error: "User not found" };
    }

    let result = [];
    const sortOrder = "DESC";
    const searchValue = search ? `%${search}%` : "%";
    const limit = parseInt(pageSize);
    const offset = (parseInt(currentPage) - 1) * limit;

    if (filter === "popular") {
      const countQuery = await conectPostgresDb.query(
        `SELECT COUNT(*) FROM users WHERE name ILIKE $1`,
        [searchValue]
      );

      const userPopular = await conectPostgresDb.query(
        `SELECT * FROM users WHERE name ILIKE $1 
         ORDER BY array_length(user_followed, 1) ${sortOrder} NULLS LAST 
         LIMIT $2 OFFSET $3`,
        [searchValue, limit, offset]
      );

      result = userPopular.rows;

      return {
        success: true,
        reviewers: result.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          user_follow: user.user_follow,
          user_followed: user.user_followed
        })),
        total: parseInt(countQuery.rows[0].count),
        currentPage: parseInt(currentPage),
        pageSize: limit
      };
    }

    // followers
    if (filter === "followers") {
      const followers = validUser.rows[0].user_followed || [];
      const filteredUsers = [];

      for (const followedId of followers) {
        const foundUser = await conectPostgresDb.query(
          "SELECT * FROM users WHERE id = $1 AND name ILIKE $2",
          [followedId, searchValue]
        );
        if (foundUser.rows.length > 0) {
          filteredUsers.push(foundUser.rows[0]);
        }
      }

      const total = filteredUsers.length;
      const paginated = filteredUsers.slice(offset, offset + limit);

      return {
        success: true,
        reviewers: paginated.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          user_follow: user.user_follow,
          user_followed: user.user_followed
        })),
        total,
        currentPage: parseInt(currentPage),
        pageSize: limit
      };
    }

    // following
    if (filter === "following") {
      const followings = validUser.rows[0].user_follow || [];
      const filteredUsers = [];

      for (const followingId of followings) {
        const foundUser = await conectPostgresDb.query(
          "SELECT * FROM users WHERE id = $1 AND name ILIKE $2",
          [followingId, searchValue]
        );
        if (foundUser.rows.length > 0) {
          filteredUsers.push(foundUser.rows[0]);
        }
      }

      const total = filteredUsers.length;
      const paginated = filteredUsers.slice(offset, offset + limit);

      return {
        success: true,
        reviewers: paginated.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          user_follow: user.user_follow,
          user_followed: user.user_followed
        })),
        total,
        currentPage: parseInt(currentPage),
        pageSize: limit
      };
    }

    return { success: false, error: "Invalid filter type" };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
