const express = require("express");
const router = express.Router();
const {
  protectRoute,
} = require("../../controllers/authController/authController");
const {
  youtubeSearch,
} = require("../../controllers/searchControllers/youtubeSearchController");
const {
  googleSearch,
} = require("../../controllers/searchControllers/googleSearchController");
const {
  googlePlaceCheck,
} = require("../../controllers/searchControllers/googlePlacesController");
const {
  fetchJobListings,
} = require("../../controllers/searchControllers/jobListingsController");

router.post("/google-search", protectRoute, googleSearch);
router.post("/location-search", protectRoute, googlePlaceCheck);
router.post("/youtube-search", protectRoute, youtubeSearch);
router.post("/job-listings", protectRoute, fetchJobListings);

module.exports = router;
