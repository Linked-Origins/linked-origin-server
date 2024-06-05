const catchAsync = require("./../utils/catchAsync");
const ErrorHandler = require("./../utils/ErrorHandler");
const Users = require("./../models/userSchema");
const { google } = require("googleapis");
const customsearch = google.customsearch("v1");
const axios = require("axios");
//54330fcc34f624f95

async function searchGoogle(
  query,
  apiKey = "AIzaSyAWP7DFU6Qu0--EFv8hr7DMA9CHGPqG0Vo"
) {
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
  //update user search query
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
  const query = req.body.query; // User search query, e.g., "where can I find pizza"
  const lat = req.body.lat; // User's location, e.g., "New York, NY"
  const lng = req.body.lng;

  try {
    // API endpoint and request (choose the appropriate API)
    const apiEndpoint = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&location=${lat},${lng}&radius=50000&key=AIzaSyCNUr0hLtD4PNnqqz_20S7DZ20Z1buf-E0`;

    // Make the API request
    const response = await axios.get(apiEndpoint);

    // Send the list of places back to the client
    res.json({
      results: response.data.results,
      length: response.data.results.length,
    });
  } catch (error) {
    // Handle error
    console.error(error);
    res.status(500).json({ error: "Error fetching data" });
  }
};
