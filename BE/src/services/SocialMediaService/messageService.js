const { conectPostgresDb } = require("../../configs/database");
const Message = require("../../models/SocialModel/message");
const { getReceiverSocketId, io } = require("../../utils/socket");

// this function is create message
exports.createConversationService = async (userId, receiverId) => {
  try {

    const validParticipant1 = await conectPostgresDb.query("SELECT * FROM users WHERE id = $1", [userId]); // check if user is valid
    if (validParticipant1.rows.length === 0) { // check if user is not valid
      return {success:false,message: "User not found"}; // return error message
    }
    const validParticipant2 = await conectPostgresDb.query("SELECT * FROM users WHERE id = $1", [receiverId]); // check if receiver is valid
    if (validParticipant2.rows.length === 0) { // check if receiver is not valid
      return {success:false,message: "Receiver not found"}; // return error message
    }
    const validConversation = await Message.find({$or:[{participant1:validParticipant1.rows[0].id,participant2:validParticipant2.rows[0].id},{participant1:validParticipant2.rows[0].id,participant2:validParticipant1.rows[0].id}]});
    if (validConversation.length > 0) { // check if conversation is not valid
    return {
      success: true,
      data: validConversation[0], 
    };
    }
    const newConversation = await Message.create(
      {participant1:validParticipant1.rows[0].id,
        participant1Name:validParticipant1.rows[0].name,
        participant1Avatar:validParticipant1.rows[0].avatar,
        participant2:validParticipant2.rows[0].id,
        participant2Name:validParticipant2.rows[0].name,
        participant2Avatar:validParticipant2.rows[0].avatar,}
    );
    return {success:true,data:newConversation}
  } catch (error) {
    return {success:false,message: "Internal server error"}
  }
}

// this function is get all conversation
exports.getAllConversationService = async (userId) => {
  try {
    const validUser = await conectPostgresDb.query("SELECT * FROM users WHERE id = $1", [userId]); // check if user is valid
    if (validUser.rows.length === 0) { // check if user is not valid
      return {success:false,message: "User not found"}; // return error message
    }
    // find all conversation with message not empty
    const conversation = await Message.find({$or:[{participant1:validUser.rows[0].id},{participant2:validUser.rows[0].id}],messages:{$ne:[]}}).sort({updatedAt:-1});
    
    return {success:true,data:conversation}
  } catch (error) {
    console.log(error);
    
    return {success:false,message: "Internal server error"}
  }
}

exports.getDetailConversationService = async (id,userId) =>{
  try {
    const validConversation = await Message.findById(id);
    if(!validConversation){
      return {success:false,message:"conversation not found!"}
    }
    const receiverId = 
    validConversation.participant1 !== userId.toString()
      ? validConversation.participant1
      : validConversation.participant2;
    const receiver = await conectPostgresDb.query("SELECT * FROM users WHERE id = $1", [receiverId]);
    if (receiver.rows.length === 0) {
      return {success:false, message:"Receiver not found!"};
    }
    const { name, avatar, is_online } = receiver.rows[0];

    const receiverData = { name, avatar, is_online };
    return {success:true, data:{conversation:validConversation,receiver:receiverData}}
  } catch (error) {
    return {success:false,message: "Internal server error"}
  }
}

// this function is send message
exports.sendMessageService = async (userId, id, message,image) => {
  try {
    const validUser = await conectPostgresDb.query("SELECT * FROM users WHERE id = $1", [userId]);
    if (validUser.rows.length === 0) {
      return {success:false, message:"User not found!"};
    } 
    const validConversation = await Message.findById(id);
    if (!validConversation) {
      return {success:false, message:"Conversation not found!"};
    }
    const receiverId = 
    validConversation.participant1 === userId.toString()
      ? validConversation.participant2
      : validConversation.participant1; 
    const receiverSocketId = getReceiverSocketId(receiverId); // get receiver socket id
    if (receiverSocketId) {
       // push new Message
      const newMessage =  await validConversation.messages.push({user_id:validUser.rows[0].id, username:validUser.rows[0].name, avatar:validUser.rows[0].avatar, content:message,image:image});
      validConversation.save();      
      io.to(receiverSocketId).emit("new-message", newMessage);
      return {success:true,message:"send success!"}
    }else{
      await validConversation.messages.push({user_id:validUser.rows[0].id, username:validUser.rows[0].name, avatar:validUser.rows[0].avatar, content:message,image:image});
      validConversation.save();      
      return {success:true,message:"send success!"}
    }
    return {success:false, message:"Receiver not found!"};
  } catch (error) {
    return {success:false, message:error};
  }
}

// this function is delete conversation
exports.deleteConversationService = async (id) =>{
  try {
    const validConversation = await Message.findByIdAndDelete(id);
    if (!validConversation) {
      return {success:false,message:"Conversation not found!"}
    }
    return {success:true,message:"Delete success!"}
  } catch (error) {
    return {success:false, message:"Delete Fail!"}
  }
}