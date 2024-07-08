const MessageSchema = require("../schema/messageSchema");
const Conversation = require("../schema/conversationSchema");
const createNewMessage = async (data) => {
  const newMessage = new MessageSchema(data);
  const createdNewMessage = await newMessage.save();
  return createdNewMessage;
};


// Function to fetch messages based on senderId and receiverId
const getMessages = async (senderId, receiverId) => {
  try {
    console.log("receiverId",receiverId);
    console.log("senderId",senderId);
    const conversation = await Conversation.find({
      participants: { $all: [{ userId: senderId }, { userId: receiverId }] },
    }).populate("messages");
  console.log("conversation",conversation)
    // if (!conversation) {
    //   return []; 
    // }
    // const messages = conversation.messages.map(message => ({
    //   messageId: message.messageId,
    //   senderId: message.senderId,
    //   receiverId: message.receiverId,
    //   message: message.message,
    //   createdAt: message.createdAt,
    //   updatedAt: message.updatedAt,
    // }));

    // return messages;
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    throw new Error("Failed to fetch messages");
  }
};
module.exports = {
  createNewMessage,
  getMessages
};