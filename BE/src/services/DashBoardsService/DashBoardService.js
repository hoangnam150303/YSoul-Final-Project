const { conectPostgresDb } = require("../../configs/database");
const FavouriteEntertainment = require("../../models/DashBoardsModel/FavoriteEntertainment");
// this function is to get the number of users by type (normal and VIP)
exports.getNumberOfTypeUserService = async () => {
  try {
    const vipUsers = await conectPostgresDb.query(
      // get the number of VIP users
      "SELECT COUNT(*) FROM users WHERE vip = true"
    );
    const totalUsers = await conectPostgresDb.query(
      // get the total number of users
      "SELECT COUNT(*) FROM users"
    );
    const normalUsers = totalUsers.rows[0].count - vipUsers.rows[0].count; // calculate the number of normal users
    return {
      // return the result
      success: true,
      userData: [
        { type: "Normal Users", count: parseInt(normalUsers) },
        { type: "VIP Users", count: parseInt(vipUsers.rows[0].count) },
      ],
    };
  } catch (error) {
    console.log("Error in getNumberOfTypeUserService:", error);

    return {
      success: false,
      message: error.toString(),
    };
  }
};

// this function is to get the favourite count of entertainment
exports.increaseFavouriteCountService = async (type) => {
  try {
    if (!["film", "music", "market", "social"].includes(type)) {
      throw new Error("Invalid type");
    }
    console.log(type);

    const update = { $inc: { [type]: 1 } };

    await FavouriteEntertainment.findOneAndUpdate(
      {}, // vì chỉ có 1 document duy nhất
      update,
      { new: true, upsert: true } // nếu chưa có thì tạo
    );

    return {
      success: true,
      message: "Favourite count updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error.toString(),
    };
  }
};

// this function is to get the favourite count of entertainment
exports.getFavouriteCountService = async () => {
  try {
    const result = await FavouriteEntertainment.findOne({}); // get the number of favourite entertainment
    if (!result) {
      // check if the result is empty
      return {
        success: false,
        message: "No favourite entertainment data found",
      };
    }
    return {
      // return the result
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: error.toString(),
    };
  }
};
