const { conectPostgresDb } = require("../../configs/database");
const Notification = require("../../models/SocialModel/notification");

// this function is get notification by user
exports.getNotificationByUserService = async(userid,filter,currentPage,pageSize)=>{
    try {
        // Kiểm tra người dùng
        const validUser = await conectPostgresDb.query("SELECT * FROM users WHERE id = $1", [userid]);
        if (!validUser.rows.length) {
          return { success: false, message: "User not found" };
        }
    
        // Chuyển đổi kiểu dữ liệu từ query string sang số
        const page = parseInt(currentPage, 10) 
        const limit = parseInt(pageSize, 10)
        const skip = (page - 1) * limit;
    
        // Tạo query filter
        let query = { user_id: userid };
        if (filter === "isRead") query.isRead = true;
        else if (filter === "isNotRead") query.isRead = false;
        else query === null;
        
        // Truy vấn thông báo với phân trang
        const notifications = await Notification.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit);
          
     // Lấy tổng số lượng thông báo (dùng cho phân trang)
          const total = await Notification.countDocuments(query);
          
        return {
          success: true,
          data: notifications,
          total, // dùng để tính số trang phía frontend
          currentPage: page,
          pageSize: limit,
        };
      } catch (error) {
        return { success: false, message: error.toString() };
      }
}

// this function is update notification by user
exports.updateNotificationStatusService = async(userId,notificationId)=>{
    try {
        const validUser = await conectPostgresDb.query("SELECT * FROM users WHERE id = $1", [userId]); // check if user is valid
        if (!validUser.rows.length) { // check if user is not valid
            return {success:false,message: "User not found"}; // return error message
        }
        const validNotification = await Notification.findById(notificationId); // check if notification is valid
        if (!validNotification) { // check if notification is not valid
            return {success:false,message: "Notification not found"}; // return error message
        }
       if (validUser.rows[0].id.toString() === validNotification.user_id) { // check if user is notification owner
    
        
        validNotification.isRead = true; // set notification isRead to true
        await validNotification.save(); // save notification
        return {success:true,message:"success"}; // return success
       }else{
        return {success:false,message: "You are not author of this notification"}; // return error message
       }
    } catch (error) {
        return {success:false,message: error.toString()};
    }
}

// this function is delete notification by user
exports.deleteNotificationService = async(userId,notificationId)=>{
    try {
        const validUser = await conectPostgresDb.query("SELECT * FROM users WHERE id = $1", [userId]); // check if user is valid
        if (!validUser.rows.length) { // check if user is not valid
            return {success:false,message: "User not found"}; // return error message
        }
        const validNotification = await Notification.findById(notificationId); // check if notification is valid
        if (!validNotification) { // check if notification is not valid
            return {success:false,message: "Notification not found"}; // return error message
        }
       if (validUser.rows[0].id.toString() === validNotification.user_id) { // check if user is notification owner
        await Notification.findByIdAndDelete(notificationId); // delete notification
        return {success:true,message:"success"}; // return success
       }else{
        return {success:false,message: "You are not author of this notification"}; // return error message
       }
    } catch (error) {
        return {success:false,message: error.toString()};
    }
}

exports.readNotificationService = async(userId,notificationId)=>{
    try {
        const validNotification = await Notification.findById(notificationId); // check if notification is valid
        if (!validNotification) { // check if notification is not valid
            return {success:false,message: "Notification not found"}; // return error message
        }
       if (validNotification.user_id === userId.toString()) { // check if user is notification owner
        validNotification.isRead = true; // set notification isRead to true
        await validNotification.save(); // save notification
        return {success:true,message:"success"}; // return success
       }else{
        return {success:false,message: "You are not author of this notification"}; // return error message
       }
    } catch (error) {        
        return {success:false,message: error.toString()};
    }
}