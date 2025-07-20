const { conectPostgresDb } = require("../../configs/database");
const passwordHelpers = require("../../helpers/passWordHelpers");
const Post = require("../../models/SocialModel/post");
const userStore = require("../../models/UserModel/userStore");
exports.getUserService = async (id) => {
  try {
    const user = await conectPostgresDb.query(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );
    if (user.rows.length === 0) {
      return { success: false, error: "User not found" };
    }
    return {
      id: user.rows[0].id,
      name: user.rows[0].name,
      is_admin: user.rows[0].is_admin,
      vip: user.rows[0].vip,
      avatar: user.rows[0].avatar,
      success: true,
    };
  } catch (error) {
    return { success: false, error };
  }
};
// this function is register account with email, password and user name.
exports.getAllUsersService = async (filter, search, typeUser) => {
  try {
    let sortColumn = "id";
    let sortOrder = "DESC";
    const searchValue = search ? `%${search}%` : "%";

    // Xác định cột sắp xếp
    switch (filter) {
      case "recent_login":
        sortColumn = "lastlogin";
        break;
      case "Active":
      case "unactive":
      case "isVip":
        sortColumn = "created_at"; // sắp xếp ổn định
        break;
      default:
        sortColumn = "id";
    }

    let users;

    const baseQuery = `
      SELECT * FROM users 
      WHERE name ILIKE $1 
        AND is_admin = false
    `;

    if (typeUser === "admin") {
      if (filter === "active") {
        users = await conectPostgresDb.query(
          `${baseQuery} AND status = true ORDER BY ${sortColumn} ${sortOrder}`,
          [searchValue]
        );
      } else if (filter === "unactive") {
        users = await conectPostgresDb.query(
          `${baseQuery} AND status = false ORDER BY ${sortColumn} ${sortOrder}`,
          [searchValue]
        );
      } else if (filter === "isVip") {
        users = await conectPostgresDb.query(
          `${baseQuery} AND vip = true ORDER BY ${sortColumn} ${sortOrder}`,
          [searchValue]
        );
      } else if (filter === "normalUser") {
        users = await conectPostgresDb.query(
          `${baseQuery} AND vip = false ORDER BY ${sortColumn} ${sortOrder}`,
          [searchValue]
        );
      } else {
        users = await conectPostgresDb.query(
          `${baseQuery} ORDER BY ${sortColumn} ${sortOrder}`,
          [searchValue]
        );
      }
    } else {
      // Người dùng không phải admin → chỉ thấy tài khoản hoạt động
      users = await conectPostgresDb.query(
        `${baseQuery} AND status = true ORDER BY ${sortColumn} ${sortOrder}`,
        [searchValue]
      );
    }

    // Xóa password khỏi kết quả trả về
    const sanitizedUsers = users.rows.map((user) => {
      delete user.password;
      return user;
    });

    return { success: true, users: sanitizedUsers };
  } catch (error) {
    console.error("Error in getAllUsersService:", error);
    return { success: false, message: error.toString() };
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
    } else if (user.rows[0].status === true) {
      await conectPostgresDb.query(
        "UPDATE users SET status = false  WHERE id = $1",
        [id]
      );
    }
    return { success: true };
  } catch (error) {
    return { success: false, message: error.toString() };
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
      );

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
    return { success: false, message: error.toString() };
  }
};

exports.getDetailUserService = async (id) => {
  try {
    const user = await conectPostgresDb.query(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );
    if (user.rows.length === 0) {
      return { success: false, error: "User not found" };
    }
    // Loại bỏ thuộc tính password khỏi user
    const sanitizedUsers = user.rows.map((user) => {
      delete user.password;
      delete user.vip;
      delete user.status;
      delete user.authprovider;
      delete user.lastlogin;
      delete user.google_id;
      delete user.is_admin;
      delete user.created_at;
      delete user.email;
      return user;
    });
    const validPost = await Post.find({ user_id: id });
    const numberOfPosts = validPost.length;
    const data = [...sanitizedUsers, numberOfPosts];

    return { success: true, data: data };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
};

exports.getUserStoreService = async (id) => {
  try {
    const validUserStore = await userStore
      .find({ user_id: id })
      .populate("NFTs", "name image");
    if (!validUserStore) {
      return { success: false, message: "User not found" };
    }
    return { success: true, data: validUserStore };
  } catch (error) {
    return { success: false, message: "Error! Please try again.", error };
  }
};

exports.updateAvatarNFTService = async (id, image) => {
  try {
    const user = await conectPostgresDb.query(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );
    if (user.rows.length === 0) {
      return { success: false, error: "User not found" };
    }
    await conectPostgresDb.query("UPDATE users SET avatar = $1 WHERE id = $2", [
      image,
      id,
    ]);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};
