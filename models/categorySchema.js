const mongoose = require("mongoose");

const subCategory = new mongoose.Schema({
  subCategoryName: {
    type: String,
    required: true,
  },
  personaContext: [
    { role: { type: String }, parts: [{ text: { type: String } }] },
  ],
});

const categories = new mongoose.Schema({
  categoryName: { type: String },
  subCategories: [subCategory],
});

const Categories = mongoose.model("Categories", categories);

module.exports = Categories;
