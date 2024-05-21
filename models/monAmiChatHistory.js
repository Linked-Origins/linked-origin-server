const mongoose = require("mongoose");
const Categories = require("./categorySchema");
const Users = require("./userSchema");

const monAmiChatHistory = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  categories: [
    {
      category: { type: String },
      subCategories: [
        {
          _id: false,
          subCategoryName: { type: String },
          chatMessages: [
            {
              _id: false,
              role: { type: String },
              parts: [{ text: { type: String } }],
              timestamp: { type: Date, default: Date.now },
            },
          ],
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
