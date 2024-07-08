const ConversationSchema = require("../schema/conversationSchema");

const findOrCreateConversation = async (participants) => {
  let conversation = await ConversationSchema.findOne({
    "participants.userId": { $all: participants.map(p => p.userId) },
  });

  if (!conversation) {
    conversation = new ConversationSchema({
      participants,
    });
    await conversation.save();
  }

  return conversation;
};

const addMessageToConversation = async (conversationId, messageId) => {
  const conversation = await ConversationSchema.findOne({ conversationId });
  conversation.messages.push(messageId);
  await conversation.save();
  return conversation;
};

module.exports = {
  findOrCreateConversation,
  addMessageToConversation,
};
