const mongoose = require("mongoose");
const uuidv4 = require("uuid").v4;
const { getCurrentDateTimeUTCPlus6 } = require("../helper/dateTimeHelpers");

const messageSchema = new mongoose.Schema(
  {
    messageId: {
      type: String,
      default: uuidv4,
      required: true,
    },
    senderId: {
      type: String,
    //   required: true,
    },
    senderType: {
      type: String,
      enum: ["student", "teacher"],
    //   required: true,
    },
    receiverId: {
      type: String,
    //   required: true,
    },
    receiverType: {
      type: String,
      enum: ["student", "teacher"],
    //   required: true,
    },
    message: {
      type: String,
    //   required: true,
    },
    createdAt: {
      type: Date,
      default: () => getCurrentDateTimeUTCPlus6(),
    },
    updatedAt: {
      type: Date,
      default: () => getCurrentDateTimeUTCPlus6(),
    },
  },
  { timestamps: true }
);

const MessageSchema = mongoose.model("Message", messageSchema);
module.exports = MessageSchema;
