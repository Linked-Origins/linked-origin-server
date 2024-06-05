const catchAsync = require("./../utils/catchAsync");
const ErrorHandler = require("./../utils/ErrorHandler");
const Users = require("./../models/userSchema");
const { google } = require("googleapis");
const customsearch = google.customsearch("v1");
const axios = require("axios");

async function searchGoogle(query, apiKey = process.env.GOOGLE_SEARCH_KEY) {
  try {
    const response = await customsearch.cse.list({
      auth: apiKey,
      cx: "54330fcc34f624f95",
      q: query,
    });

    return response.data.items;
  } catch (error) {
    console.error("Error searching Google:", error);
    throw error;
  }
}

exports.addSearchQuery = catchAsync(async (req, res, next) => {
  //get search query
  const searchQuery = req.body.searchQuery;
  const user = req.user;
  apiKey = "AIzaSyAWP7DFU6Qu0--EFv8hr7DMA9CHGPqG0Vo";

  const response = await customsearch.cse.list({
    auth: "AIzaSyAWP7DFU6Qu0--EFv8hr7DMA9CHGPqG0Vo",
    cx: "54330fcc34f624f95",
    q: searchQuery.searchQuery,
  });

  const results = response.data.items;

  const update = await Users.findOneAndUpdate(
    { userId: user.userId },
    { $push: { searchHistory: searchQuery } },
    { new: true }
  );

  return res.status(200).json({ results });
});

exports.getSearchHistory = catchAsync(async (req, res, next) => {
  const user = req.user;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const searchHistory = user.searchHistory.slice(skip, skip + limit);

  if (searchHistory.length === 0) {
    return res.status(200).json({ message: "0 results" });
  }

  return res.status(200).json({
    status: "success",
    data: {
      page,
      limit,
      totalResults: user.searchHistory.length,
      searchHistory,
    },
  });
});

exports.googlePlaceCheck = async (req, res, next) => {
  const query = req.body.query;
  const lat = req.body.lat;
  const lng = req.body.lng;

  const GOOGLE_PLACES_KEY = process.env.GOOGLE_PLACES_KEY;

  try {
    const apiEndpoint = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&location=${lat},${lng}&radius=50000&key=${GOOGLE_PLACES_KEY}`;

    const response = await axios.get(apiEndpoint);
    res.json({
      results: response.data.results,
      length: response.data.results.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching data" });
  }
};
