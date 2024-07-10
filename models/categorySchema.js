const mongoose = require("mongoose");

const category = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  personaContext: [
    { role: { type: String }, parts: [{ text: { type: String } }] },
  ],
});

const Categories = mongoose.model("Categories", category);

module.exports = Categories;
