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
router.get("/location-search", protectRoute, googlePlaceCheck);
router.get("/youtube-search", protectRoute, youtubeSearch);
router.get("/job-listings", protectRoute, fetchJobListings);

module.exports = router;
