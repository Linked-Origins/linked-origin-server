const Users = require("./../models/userSchema");
const Category = require("./../models/categorySchema");
const MonAmiChatHistory = require("./../models/monAmiChatHistory");

exports.addCategory = async (req, res, next) => {
  const category = req.body.category;
  const subCategoryName = req.body.subCategoryName;
  const persona = req.body.personaContext;

  try {
    // Create the subcategory object
    const subCategory = {
      subCategoryName: subCategoryName,
      personaContext: persona,
    };

    // Find the category by name
    let existingCategory = await Category.findOne({ categoryName: category });

    // If the category doesn't exist, create a new one
    if (!existingCategory) {
      existingCategory = await Category.create({ categoryName: category });
    }

    // Push the new subcategory to the category's subCategories array
    existingCategory.subCategories.push(subCategory);

    // Save the changes
    await existingCategory.save();

    res.json({ added: existingCategory });
  } catch (error) {
    console.error("Error adding category:", error);
    res
      .status(500)
      .json({ error: "An error occurred while adding the category." });
  }
};

exports.addSubCategory = async (req, res, next) => {
  //get the category to be added to as well as the subcategories.
  const category = req.body.category;
  const subCategoryName = req.body.subCategoryName;
  const persona = req.body.personaContext;

  const subCategory = {
    subCategoryName: subCategoryName,
    personaContext: persona,
  };
  // check if the category exists
  const foundCategory = await Category.findOne({ category });
  //if the category doesnt exist return an error that it the category doesnt exist.
  if (!foundCategory) {
    return res.send("this category does not exist");
  } else {
    foundCategory.subCategories.push(subCategory);

    await foundCategory.save();
    return res.send({ updated: foundCategory });
  }
};
