const express = require("express");
const router = express.Router();
const { protectRoute } = require("./../controllers/authController");
const {
  addSearchQuery,
  getSearchHistory,
  googlePlaceCheck,
} = require("./../controllers/searchController");

router.post("/update-search-history/user", protectRoute, addSearchQuery);
router.get("/search-history/user", protectRoute, getSearchHistory);
router.get("/location-search", googlePlaceCheck);

module.exports = router;
