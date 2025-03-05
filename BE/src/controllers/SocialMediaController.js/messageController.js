const messageService = require("../../services/SocialMediaService/messageService");
// get all conversation in sidebar
exports.getAllConversation = async (req, res) => {
  try {
    const userId = req.user._id;
    const response = await messageService.getAllConversationService(userId);
    if (!response.success) {
      return res.status(400).json({ message: response.message });
    }
    return res.status(200).json(response.conversations);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// get message between 2 user
exports.getMessage = async (req, res) => {
  try {
    const userId = req.user._id;
    const { receiverId } = req.params;
    const response = await messageService.getMessageService(userId, receiverId);
    if (!response.success) {
      return res.status(400).json({ message: "fail to get message " });
    }
    return res.status(200).json(response.messages);
  } catch (error) {}
};
exports.sendMessage = async (req, res) => {
  try {
    const userId = req.user._id;
    const message = req.body.message;
    const receiverId = req.params.receiverId;
    const response = await messageService.sendMessageService(
      userId,
      receiverId,
      message
    );
    if (!response.success) {
      return res.status(400).json({ message: response.message });
    }
    return res.status(200).json("Message sent successfully");
  } catch (error) {}
};
