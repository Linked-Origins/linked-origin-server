const axios = require("axios");
exports.youtubeSearch = async (req, res, next) => {
  const query = req.body.searchQuery;
  const apiKey = process.env.YOUTUBE_API_KEY;

  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          maxResults: 25,
          q: query,
          key: apiKey,
        },
      }
    );

    return res.status(200).json({
      results: response.data.items,
      length: response.data.items.length,
    });
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `Error fetching data, ${error}` });
  }
};
