const message = require("../../models/SocialModel/message");
const messageService = require("../../services/SocialMediaService/messageService");

// create conversation
exports.createConversation = async (req, res) => {
  try {    
    const {receiverId} = req.params; // get id from params
    const userId = req.user.id; // get userId from user
    if (!userId || !receiverId) { // if userId or id is not exist
      return res.status(400).json({ message: "Id field is required." }); // return error message
    }
    const response = await messageService.createConversationService(userId, receiverId);  // call createConversationService from messageService
    if (!response.success) {  // if response is not success
      return res.status(400).json({ message: response.message }); // return error message
    }
    return res.status(200).json(response); // return success message
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" }); // return error message
  }
};

// get all conversation
exports.getAllConversation = async (req, res) => {
  try {
    const userId = req.user.id; // get userId from user
    if (!userId) {
      return res.status(400).json({ message: "Id field is required." }); // return error message
    }
    const response = await messageService.getAllConversationService(userId); // call getAllConversationService from messageService
    if (!response.success) {
      return res.status(400).json({ message: response.message }); // return error message
    }
    return res.status(200).json(response); // return success message
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" }); // return error message
  }
}

exports.getDetailConversation = async(req,res)=>{
  try {
    const {id} = req.params;
    const userId = req.user.id;
    if (!id) {
      return res.status(400).json({message:"Id is required!"})
    }
    const response = await messageService.getDetailConversationService(id,userId);
    if (!response.success) {
      return res.status(400).json({message:"Get detail message fail!"})
    }
    return res.status(200).json(response)
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" }); // return error message
  }
}

// send message
exports.sendMessage = async (req, res) => {
  try {
    const {id} = req.params;
    const userId = req.user.id; // get userId from user
    const {text} = req.body; // get message from body
    const image = req.file?.path;
    if (!userId || !id || !text) { // if userId or id or message is not exist
      return res.status(400).json({ message: "Id field is required." }); // return error message
    }
    const response = await messageService.sendMessageService(userId, id, text,image); // call sendMessageService from messageService
    if (!response.success) { // if response is not success
      
      return res.status(400).json({ message: response.message }); // return error message
    }
    
    return res.status(200).json(response); // return success message
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" }); // return error message
  }
}

//delete conversation
exports.deleteConversation = async (req,res) =>{
  try {
    const {id} = req.params;
    const userId = req.user.id;
    if (!id) {
      return res.status(400).json({message:"Id is required!"})
    }
    const response = await messageService.deleteConversationService(id,userId);
    if (!response.success) {
      return res.status(400).json(response.message)
    }
    return res.status(200).json(response)
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" }); // return error message
  }
}

// update message
exports.updateMessage = async (req,res)=>{
  try {
    const {conversationId, messageId} = req.params; // get id from params
    const {text} = req.body; // get message from body
    const userId = req.user.id; // get userId from user
    if (!conversationId || !messageId) {
      return res.status(400).json({message:"Id is required!"}) // return error message
    }
    const response = await messageService.updateMessageService(conversationId,messageId,text,userId); // call updateMessageService from messageService
    if (!response.success) {
      return res.status(400).json(response.message) // return error message
    }
    return res.status(200).json(response) // return success message
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" }); // return error message
  }
}

// delete message
exports.deleteMessage = async(req,res)=>{
  try {
    const {conversationId, messageId} = req.params; // get id from params
    const userId = req.user.id;
    if (!conversationId || !messageId) { // if id is not exist
      return res.status(400).json({message:"Id is required!"})
    }
    const response = await messageService.deleteMessageService(conversationId,messageId,userId); // call deleteMessageService from messageService
    if (!response.success) {
      return res.status(400).json(response.message) // return error message
    }
    return res.status(200).json(response) // return success message
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" }); // return error message
  }
}