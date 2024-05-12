const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const Users = require("./../models/userSchema");
const MODEL_NAME = "gemini-pro";
const API_KEY = process.env.GEM_API_KEY;

exports.runChat = async function (req, res, next) {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  const category = req.body.category;
  const searchQuery = req.body.searchQuery;

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

  try {
    // Define persona context with Mon-Ami's characteristics
    const personaContext = [
      {
        role: "user",
        parts: [
          {
            text: `You are Mon-Ami for ${category} related queries, a friendly and informative assistant for Linked Origins. 
              Linked Origins helps newcomers in Canada settle down by providing resources and answering questions. 
              Your goal is to assist ${user.personalInfo.firstName} with their questions related to the category provided as ${category} in each request. 
              If you sense that the question they ask about is not in any way related to the category, please suggest to them to visit
              the perceived category on their dashboard. Dont't worry, you will learn more about the available categories as you interact more.
              Tell them that if they are unsure about the category, they can try the general search instead or visit the community.
              Remember their preferences over time to provide personalized help. 
              Use positive and encouraging language. Show empathy and understanding towards the user's situation.`,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: `Hi ${user.personalInfo.firstName}! Welcome to Linked Origins. I'm Mon-Ami, your friendly guide to settling in Canada. How can I help you today?`,
          },
        ],
      },
    ];

    // Retrieve user's chat history from MongoDB
    let userHistory = await Users.findOne({ userId: user.userId }).select(
      "monAmiChatHistory"
    );
    userHistory = userHistory.monAmiChatHistory.messages;
    // Initialize chat with persona context and user history
    console.log(userHistory);
    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: userHistory ? userHistory.messages : personaContext,
    });

    // Check if search query and category are provided
    if (!searchQuery || !category) {
      return res
        .status(400)
        .json({ message: "Please provide both 'category' and 'searchQuery'." });
    }

    // Send user's message to Gemini AI
    const result = await chat.sendMessage(searchQuery);
    const response = result.response;

    // Update user's chat history in MongoDB
    if (!userHistory) {
      // Create new chat history document if it doesn't exist
      await Users.findOneAndUpdate({
        userId: user.userId,
        monAmiChatHistory: [
          {
            messages: [
              { role: "user", parts: [{ text: searchQuery }] },
              { role: "model", parts: [{ text: response.text() }] },
            ],
          },
        ],
      });
    } else {
      await Users.updateOne(
        { userId: user.userId }, // Update the document with its _id
        {
          $push: {
            "monAmiChatHistory.messages": {
              role: "user",
              parts: [{ text: searchQuery }],
            },
            "monAmiChatHistory.messages": {
              role: "model",
              parts: [{ text: response.text() }],
            },
          },
        }
      );
    }

    // Return the response from Gemini AI
    return res.json({ response: response.text() });
  } catch (error) {
    console.error("Error running chat:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
