const { conectPostgresDb } = require("../../configs/database");
const Notification = require("../../models/notification");

// this function is get notification by user
exports.getNotificationByUserService = async(userid,filter)=>{
try {
    const validUser = await conectPostgresDb.query("SELECT * FROM users WHERE id = $1", [userid]); // check if user is valid
    if (!validUser.rows.length) { // check if user is not valid
        return {success:false,message: "User not found"}; // return error message
    }
    let validNotificaton;
   if (filter === "isRead") { // check if filter is isRead
   validNotificaton = await Notification.find({user_id:userid,isRead:true}).sort({createdAt:-1}); // find notification by user id
   }
   else if(filter === "isNotRead"){ // check if filter is isNotRead
    validNotificaton = await Notification.find({user_id:userid,isRead:false}).sort({createdAt:-1}); // find notification by user id
   }
   else{ // check if filter is all
    validNotificaton = await Notification.find({user_id:userid}).sort({createdAt:-1}); // find notification by user id
   }
    return {success:true,data:validNotificaton}; // return success
} catch (error) {
    return {success:false,message: error.toString()}; // return error message
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