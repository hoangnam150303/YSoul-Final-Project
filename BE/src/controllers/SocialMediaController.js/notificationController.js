const notificationService = require('../../services/SocialMediaService/notificationService');

// get notification by user
exports.getNotificationByUser = async(req,res)=>{
    try {
        const userId = req.user.id; // get userId from request user
        const {filter,currentPage,pageSize} = req.query;
        const response = await notificationService.getNotificationByUserService(userId,filter,currentPage,pageSize); // call getNotificationByUserService from notificationService
        if (!response.success) { // if response is not success
            return res.status(401).json({ message: "Error! Please try again.", error }); // return error
        }
       return res.status(200).json(response); // return response if success
    } catch (error) {
        return res.status(500).json({ message: "Error! Please try again.", error }); // return error
    }
}

// update notification by user
exports.updateNotificationStatus = async(req,res)=>{
    try {
        const {id} = req.params; // get id from params
        const userId = req.user.id; // get userId from request user
        const response = await notificationService.updateNotificationStatusService(userId,id); // call updateNotificationStatusService from notificationService
        if (!response.success) { // if response is not success
            return res.status(401).json({ message: "Error! Please try again.", error }); // return error
        }
       return res.status(200).json(response); // return response if success
    } catch (error) {
        return res.status(500).json({ message: "Error! Please try again.", error }); // return error
    }
}

// delete notification
exports.deleteNotification = async(req,res)=>{
    try {
        const {id} = req.params; // get id from params
        const userId = req.user.id; // get userId from request user
        const response = await notificationService.deleteNotificationService(userId,id); // call deleteNotificationService from notificationService
        if (!response.success) { // if response is not success
            return res.status(401).json({ message: "Error! Please try again.", error }); // return error
        }
       return res.status(200).json(response); // return response if success
    } catch (error) {
        return res.status(400).json({ message: "Error! Please try again.", error }); // return error
    }
}

// read notification
exports.readNotification = async(req,res)=>{
    try {
        const {id} = req.params; // get id from params
        const userId = req.user.id; // get userId from request user
        const response = await notificationService.readNotificationService(userId,id); // call readNotificationService from notificationService
        if (!response.success) { // if response is not success
            return res.status(401).json({ message: "Error! Please try again.", error }); // return error
        }
       return res.status(200).json(response); // return response if success
    } catch (error) {
        return res.status(400).json({ message: "Error! Please try again.", error }); // return error
    }
}