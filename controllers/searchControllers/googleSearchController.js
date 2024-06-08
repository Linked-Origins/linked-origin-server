const catchAsync = require("../../utils/catchAsync");
const ErrorHandler = require("../../utils/ErrorHandler");
const Users = require("../../models/userSchema");
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

exports.googleSearch = catchAsync(async (req, res, next) => {
  //get search query
  const searchQuery = req.body.searchQuery;
  const user = req.user;
  apiKey = process.env.GOOGLE_SEARCH_API_KEY;

  const response = await customsearch.cse.list({
    auth: apiKey,
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
