const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const Users = require("../../models/userSchema");
const MODEL_NAME = "gemini-pro";
const API_KEY = "AIzaSyAjzv84QBVbk7nIqw5reKBjCSzQcjh_STE";
const Categories = require("../../models/categorySchema");
const MonAmiChatHistory = require("../../models/monAmiChatHistory");

exports.runChat = async function (req, res, next) {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  //gemini config
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 1000,
  };
  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    // ... other safety settings
  ];

  /*get data from the front end */
  const category = req.body.category;
  const subCategory = req.body.subCategory;
  const searchQuery = req.body.searchQuery;
  try {
    // Define persona context with Mon-Ami's characteristics

    let personaContext;

    const foundCategory = await Categories.findOne({ categoryName: category });
    if (!foundCategory) {
      return res.json({ message: "Category not found!" });
    }

    const foundSubCategory = foundCategory.subCategories.find(
      (sub) => sub.subCategoryName === subCategory
    );

    if (!foundSubCategory) {
      return res.json({ message: "Subcategory not found!" });
    }

    // retrieve the persona for the particular subcategory
    personaContext = foundSubCategory.personaContext;

    let cleanedPersonaContext = personaContext.map((obj) => ({
      role: obj.role,
      parts: [{ text: obj.parts[0].text }],
    }));

    // Retrieve user's chat history from db
    let userHistory = await MonAmiChatHistory.findOne({ user: user._id });

    /*if user has no history   succeeded */
    if (!userHistory) {
      const chat = model.startChat({
        generationConfig,
        safetySettings,
        history: cleanedPersonaContext,
      });
      const result = await chat.sendMessage(searchQuery);
      let response = result.response.text();

      const userNewChat = await MonAmiChatHistory.create({
        user: user._id,
        categories: {
          category: category,
          subCategories: [
            {
              subCategoryName: subCategory,
              chatMessages: [
                { role: "user", parts: [{ text: searchQuery }] },
                { role: "model", parts: [{ text: response }] },
              ],
            },
          ],
        },
      });
      return res.status(200).json({ response: response });
    }

    /*check if the user has a chat history but the category and subCategory don't exist.
    In this case, create a path for the category and subcategory*/

    //check if the category(indirectly and subCategory) exists
    const existingSubCategory = userHistory.categories.find((item) =>
      item.subCategories.find((sub) => sub.subCategoryName === subCategory)
    );
    const existingCategory = userHistory.categories.find(
      (item) => item.category === category
    );

    if (userHistory && existingCategory === undefined) {
      const chat = model.startChat({
        generationConfig,
        safetySettings,
        history: cleanedPersonaContext,
      });
      const result = await chat.sendMessage(searchQuery);
      let response = result.response.text();

      const updatedHistory = await MonAmiChatHistory.findOneAndUpdate(
        { user: user._id },
        {
          $push: {
            categories: {
              category: category,
              subCategories: [
                {
                  subCategoryName: subCategory,
                  chatMessages: [
                    { role: "user", parts: [{ text: searchQuery }] },
                    { role: "model", parts: [{ text: response }] },
                  ],
                },
              ],
            },
          },
        },
        { new: true }
      );

      return res.status(200).json({ response });
    }

    //  /*if user history exists, category exists but not subCategory... push new subcategory.*/
    if (
      userHistory &&
      existingCategory.category === category &&
      existingSubCategory === undefined
    ) {
      const chat = model.startChat({
        generationConfig,
        safetySettings,
        history: cleanedPersonaContext,
      });
      const result = await chat.sendMessage(searchQuery);
      let response = result.response.text();
      const updatedHistory = await userHistory.updateOne(
        { category: category },
        {
          $push: {
            categories: {
              category: category,
              subCategories: [
                {
                  subCategoryName: subCategory,
                  chatMessages: [
                    { role: "user", parts: [{ text: searchQuery }] },
                    { role: "model", parts: [{ text: response }] },
                  ],
                },
              ],
            },
          },
        },
        { new: true }
      );
      return res.status(200).json({ response });
    }
    /*check if the user has a history and the category and subcategory exists. Push into chat messages😉 */
    if (
      userHistory &&
      existingCategory !== undefined &&
      existingSubCategory !== undefined
    ) {
      let history;
      history = existingCategory.subCategories[0].chatMessages;

      history = history.map((obj) => ({
        role: obj.role,
        parts: [{ text: obj.parts[0].text }],
      }));

      const chat = model.startChat({
        generationConfig,
        safetySettings,
        history: history,
      });
      const result = await chat.sendMessage(searchQuery);
      let response = result.response.text();

      const updatedHistory = await MonAmiChatHistory.findOneAndUpdate(
        {
          user: user._id,
          "categories.category": category,
          "categories.subCategories.subCategoryName": subCategory,
        },
        {
          $push: {
            "categories.$.subCategories.$[elem].chatMessages": {
              $each: [
                { role: "user", parts: [{ text: searchQuery }] },
                { role: "model", parts: [{ text: response }] },
              ],
            },
          }, // Push new chat contents to chat history
        },
        {
          arrayFilters: [{ "elem.subCategoryName": subCategory }],
          new: true,
        }
      );

      return res.status(200).json({ response });
    }
  } catch (error) {
    console.error("Error running chat:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
