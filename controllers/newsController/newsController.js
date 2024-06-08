const axios = require("axios");
const News = require("../../models/newsSchema");

//exports.getNews = async (req, res, next) => {
//  const apiKey = process.env.GNEWS_API_KEY;
//  const apiUrl = `https://gnews.io/api/v4/search?q=immigration&lang=en&country=ca&max=4&apikey=${apiKey}`;
//
//  try {
//    const response = await axios.get(apiUrl);
//
//    const articles = response.data.articles;
//
//    await News.deleteMany({});
//
//    const newsItems = articles.map((article) => ({
//      title: article.title,
//      description: article.description,
//      content: article.content,
//      url: article.url,
//      image: article.image,
//      publishedAt: article.publishedAt,
//      source: article.source,
//    }));
//
//    // Insert the news items into the database
//    await News.insertMany(newsItems);
//
//    console.log("Fetched and stored news");
//    if (res) {
//      return res.status(200).json({ message: "success", news: newsItems });
//    }
//  } catch (error) {
//    console.error("Error fetching or storing news:", error);
//    if (res) {
//      return res.status(500).json({ error: "Failed to fetch and store news" });
//    }
//  }
//};
//
// Function to fetch news from the database and return it to the client

const categories = ["employment", "housing", "law", "health", "social"];
const fetchFromWorldNews = async () => {
  try {
    await News.deleteMany({});

    for (const category of categories) {
      const apiUrl = `https://api.worldnewsapi.com/search-news?text=${category}&language=en&apikey=cc553144e273435b886fc6799140c3cb`;
      const apiKey = "cc553144e273435b886fc6799140c3cb";

      const response = await axios.get(apiUrl, {
        headers: {
          "x-api-key": apiKey,
        },
      });

      const newsData = response.data.news;
      let selectedArticles = newsData.filter(
        (newsItem) => newsItem.source_country === "ca"
      );

      // Loop through each selected article and save it to the database
      for (const article of selectedArticles) {
        const newsDocument = {
          title: article.title,
          text: article.text,
          url: article.url,
          image: article.image,
          category: category,
        };

        await News.create(newsDocument);
      }
    }
  } catch (error) {
    console.error("Error fetching news:", error);
  }
};

// API endpoint to serve the latest news for all categories
exports.getNews = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const count = await News.countDocuments();
    const totalPages = Math.ceil(count / limit);
    const skip = (page - 1) * limit;

    const news = await News.find({})
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Assuming there's a createdAt field for sorting

    res.json({
      news,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Set an interval to fetch and cache news every 5 minutes
setInterval(fetchFromWorldNews, 10 * 60 * 1000); // 5 minutes interval

//delete existing news first before adding to the database.
