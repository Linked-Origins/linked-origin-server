const mongoose = require("mongoose");
const Categories = require("./categorySchema");
const Users = require("./userSchema");

const chatMessageSchema = new mongoose.Schema(
  {
    role: { type: String, required: true },
    parts: [{ text: { type: String, required: true } }],
  },
  { _id: false }
);

const monAmiChatHistory = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  categories: [
    {
      category: { type: String, required: true },
      chatMessages: [
        {
          query: chatMessageSchema,
          response: chatMessageSchema,
          timestamp: { type: Date, default: Date.now },
        },
      ],
    },
  ],
});

const MonAmiChatHistory = mongoose.model(
  "MonAmiChatHistory",
  monAmiChatHistory
);
module.exports = MonAmiChatHistory;
