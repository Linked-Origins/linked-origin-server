const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const Users = require("../../models/userSchema");
const MODEL_NAME = process.env.GEM_MODEL_NAME; // "gemini-pro";
const API_KEY = process.env.GEM_API_KEY;
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
  const searchQuery = req.body.searchQuery;
  try {
    let personaContext;

    const foundCategory = await Categories.findOne({ category: category });
    if (!foundCategory) {
      return res.json({ message: "Category not found!" });
    }
    // retrieve the persona for the particular subcategory
    personaContext = foundCategory.personaContext;

    let cleanedPersonaContext = personaContext.map((obj) => ({
      role: obj.role,
      parts: [{ text: obj.parts[0].text }],
    }));

    // Retrieve user's chat history from db
    let userHistory = await MonAmiChatHistory.findOne({ user: user._id });

    /*if user has no history*/
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
        categories: [
          {
            category: category,
            chatMessages: [
              {
                query: {
                  role: "user",
                  parts: [{ text: searchQuery }],
                },
                response: {
                  role: "model",
                  parts: [{ text: response }],
                },
              },
            ],
          },
        ],
      });

      return res.status(200).json({ response: response });
    }

    /*check if the user has a chat history but the category doesn'texist.
    In this case, create a path for the category*/

    //check if the category exists

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
          $addToSet: {
            categories: {
              category: category,
              chatMessages: [
                {
                  query: {
                    role: "user",
                    parts: [{ text: searchQuery }],
                  },
                  response: {
                    role: "model",
                    parts: [{ text: response }],
                  },
                },
              ],
            },
          },
        },
        { new: true }
      );

      return res.status(200).json({ response });
    }

    /*check if the user has a history and the category exists. Push into chat messages😉 */
    if (userHistory && existingCategory !== undefined) {
      let history = existingCategory.chatMessages.flatMap((message) => [
        {
          role: message.query.role,
          parts: message.query.parts.map((part) => ({ text: part.text })),
        },
        {
          role: message.response.role,
          parts: message.response.parts.map((part) => ({ text: part.text })),
        },
      ]);
      history = [...cleanedPersonaContext, ...history];

      console.log(history);

      const chat = model.startChat({
        generationConfig,
        safetySettings,
        history: history,
      });
      const result = await chat.sendMessage(searchQuery);
      let response = result.response.text();

      const updatedHistory = await MonAmiChatHistory.findOneAndUpdate(
        { user: user._id, "categories.category": category },
        {
          $push: {
            "categories.$.chatMessages": {
              query: {
                role: "user",
                parts: [{ text: searchQuery }],
              },
              response: {
                role: "model",
                parts: [{ text: response }],
              },
            },
          },
        },
        { new: true }
      );
      return res.status(200).json({ response });
    }
  } catch (error) {
    console.error("Error running chat:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
