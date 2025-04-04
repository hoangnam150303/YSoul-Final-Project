const { getReceiverSocketId, io } = require("../../utils/socket");
const { conectPostgresDb } = require("../../configs/database");
const Notification = require("../../models/SocialModel/notification");
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
  exports.getAllReviewersService = async (userId, filter, search, pageSize, currentPage) => {
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