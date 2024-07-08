const MessageModel = require("../models/Message");
const ConversationModel = require("../models/Conversation");
const { getReceiverSocketId, io } = require("../socket/socket");
const { errorResponseHandler } = require("../helper/errorResponseHandler");

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { receiverId } = req.params;
    // const senderId = req.user;
  console.log("body",req.body);
  console.log("receiverId",receiverId);
  const senderId = req.user.studentId || req.user.teacherId; 

    if (!receiverId) {
      return res.status(400).json({ error: "ReceiverId parameter is missing." });
    }

    const senderType = req.user.studentId ? "student" : "teacher";
    const receiverType = receiverId.startsWith("student") ? "student" : "teacher"; // Example logic, adjust as per your application

    const conversation = await ConversationModel.findOrCreateConversation([
      { userId: senderId, userType: senderType.toLowerCase() },
      { userId: receiverId, userType: receiverType.toLowerCase() }
    ]);
    console.log("conversation",conversation);
    const newMessage = await MessageModel.createNewMessage({
      senderId,
      senderType,
      receiverId,
      receiverType,
      message,
    });
    console.log('message',newMessage)

    await ConversationModel.addMessageToConversation(conversation.conversationId, newMessage.messageId);

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (err) {
    errorResponseHandler(err, req, res);
  }
};

const fetchMessages = async (req, res) => {
  try {
    const senderId =  req.user.studentId || req.user.teacherId; 
    console.log("senderId----",senderId);
    const receiverId = req.params.id; 
    console.log("receiverId---",receiverId);
    const messages = await MessageModel.getMessages(senderId, receiverId);
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = {
  sendMessage,
  fetchMessages
};
