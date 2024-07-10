const Users = require("../../models/userSchema");
const Category = require("../../models/categorySchema");
const MonAmiChatHistory = require("../../models/monAmiChatHistory");

exports.addCategory = async (req, res, next) => {
  const category = req.body.category;
  const persona = req.body.personaContext;

  try {
    let existingCategory = await Category.findOne({ category: category });

    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists!" });
    }

    const newCategory = await Category.create({
      category: category,
      personaContext: persona,
    });

    res.json({ added: newCategory });
  } catch (error) {
    console.error("Error adding category:", error);
    res
      .status(500)
      .json({ error: "An error occurred while adding the category." });
  }
};
