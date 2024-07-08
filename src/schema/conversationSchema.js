const mongoose = require("mongoose");
const uuidv4 = require("uuid").v4;
const { getCurrentDateTimeUTCPlus6 } = require("../helper/dateTimeHelpers");

const conversationSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
      default: uuidv4,
      required: true,
    },
    participants: [
      {
        userId: {
          type: String,
        //   required: true,
        },
        userType: {
          type: String,
          enum: ["student", "teacher"],
        //   required: true,
        },
      },
    ],
    messages: [
      {
        type: String,
        ref: "Message",
        default: [],
      },
    ],
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

const ConversationSchema = mongoose.model("Conversation", conversationSchema);
module.exports = ConversationSchema;
