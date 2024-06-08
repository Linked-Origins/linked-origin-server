const axios = require("axios");

exports.googlePlaceCheck = async (req, res, next) => {
  const query = req.body.query;
  const lat = req.body.lat;
  const lng = req.body.lng;

  const GOOGLE_PLACES_KEY = process.env.GOOGLE_PLACES_KEY;

  try {
    const apiEndpoint = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&location=${lat},${lng}&radius=25000&region=ca&key=${GOOGLE_PLACES_KEY}`;

    const response = await axios.get(apiEndpoint);
    res.json({
      results: response.data.results,
      length: response.data.results.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `Error fetching data, ${error}` });
  }
};
