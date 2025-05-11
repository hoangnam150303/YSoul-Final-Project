const { conectPostgresDb } = require("../../configs/database");
const passwordHelpers = require("../../helpers/passWordHelpers");
const Post = require("../../models/SocialModel/post")
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
      avatar:user.rows[0].avatar,
      success: true,
    };
   
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
}
// this function is register account with email, password and user name.
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
    const sanitizedUsers = user.rows.map(user => {
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
    const validPost = await Post.find({user_id:id});
    const numberOfPosts = validPost.length;
    const data = [...sanitizedUsers,numberOfPosts]

    
    return { success: true, data:data};
  } catch (error) {
    console.log(error);
    
  }
}

exports.getUserStoreService = async (id)=>{
  try {
    const validUserStore = await userStore.find({user_id:id}).populate("NFTs","name image");
    if (!validUserStore) {
      return { success: false, message: "User not found" };
    }
    return { success: true, data: validUserStore };
  } catch (error) {
    return { success: false, message: "Error! Please try again.", error };
  }
}

exports.updateAvatarNFTService = async (id,image) => {
  try {
    const user = await conectPostgresDb.query(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );
    if (user.rows.length === 0) {
      return { success: false, error: "User not found" };
    }
    await conectPostgresDb.query(
      "UPDATE users SET avatar = $1 WHERE id = $2",
      [image, id]
    );
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};