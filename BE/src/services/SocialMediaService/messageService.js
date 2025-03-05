const Message = require("../models/message");
const users = require("../models/users");
const { getReceiverSocketId, io } = require("../utils/socket");
//
exports.getAllConversationService = async (userId) => {
  try {
    const user = await users.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ senderId: user._id }, { receiverId: user._id }],
        },
      },
      {
        $sort: { createdAt: -1 }, // Sắp xếp theo thời gian gần nhất
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$senderId", user._id] },
              "$receiverId",
              "$senderId",
            ],
          },
          lastMessage: { $first: "$message" }, // Tin nhắn gần nhất
          lastMessageTime: { $first: "$createdAt" }, // Thời gian gần nhất
          correctReceiverId: {
            $first: {
              $cond: [
                { $eq: ["$senderId", user._id] }, // Nếu tôi gửi
                "$receiverId", // Lấy người nhận
                "$senderId", // Nếu người khác gửi, lấy người gửi
              ],
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "correctReceiverId",
          foreignField: "_id",
          as: "receiverInfo",
        },
      },
      {
        $unwind: "$receiverInfo",
      },
      {
        $project: {
          _id: 0,
          receiverId: "$correctReceiverId",
          lastMessage: 1,
          lastMessageTime: 1,
          "receiverInfo.username": 1,
          "receiverInfo.avatar": 1,
        },
      },
      { $sort: { lastMessageTime: -1 } },
    ]);

    return { success: true, conversations };
  } catch (error) {
    console.error(error);
    return { success: false, message: error.message };
  }
};

exports.getMessageService = async (userId, receiverId) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: receiverId },
        { senderId: receiverId, receiverId: userId },
      ],
    });
    if (!messages) {
      throw new Error("Messages not found");
    }
    return { success: true, messages };
  } catch (error) {}
};

exports.sendMessageService = async (userId, receiverId, message) => {
  try {
    const senderUser = await users.findById(userId);
    if (!senderUser) {
      throw new Error("Sender user not found");
    }
    const receiverUser = await users.findById(receiverId);
    if (!receiverUser) {
      throw new Error("Receiver user not found");
    }
    if (!message) {
      return;
    }
    const newMessage = await Message.create({
      senderId: userId,
      receiverId: receiverUser._id,
      message,
    });
    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("new-message", newMessage);
    } else {
      console.log("Receiver is not connected:", receiverId);
    }
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
