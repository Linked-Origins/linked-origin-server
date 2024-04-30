const axios = require("axios");
const News = require("./../models/newsSchema"); // Import your News model

// Function to fetch news from the remote API and store it in the database
exports.getNews = async (req, res, next) => {
  const apiKey = "4ea69395cd363e42caf1346aeb528c4f";
  const apiUrl = `https://gnews.io/api/v4/search?q=immigration&lang=en&country=ca&max=4&apikey=${apiKey}`;

  try {
    const response = await axios.get(apiUrl);

    const articles = response.data.articles;

    // Clear the existing news in the database (optional)
    await News.deleteMany({});

    // Store the fetched news in the database
    const newsItems = articles.map((article) => ({
      title: article.title,
      description: article.description,
      content: article.content,
      url: article.url,
      image: article.image,
      publishedAt: article.publishedAt,
      source: article.source,
    }));

    // Insert the news items into the database
    await News.insertMany(newsItems);

    console.log("Fetched and stored news");
    if (res) {
      return res.status(200).json({ message: "success", news: newsItems });
    }
  } catch (error) {
    console.error("Error fetching or storing news:", error);
    if (res) {
      return res.status(500).json({ error: "Failed to fetch and store news" });
    }
  }
};

// Function to fetch news from the database and return it to the client
exports.getNewsFromDB = async (req, res, next) => {
  try {
    // Fetch news from the database
    const news = await News.find();

    return res.status(200).json({ message: "success", news });
  } catch (error) {
    console.error("Error fetching news from database:", error);
    return res
      .status(500)
      .json({ error: "Failed to fetch news from database" });
  }
};
