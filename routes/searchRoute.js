const express = require("express");
const router = express.Router();
const { protectRoute } = require("./../controllers/authController");
const {
  addSearchQuery,
  getSearchHistory,
} = require("./../controllers/searchController");

router.post("/update-search-history/user/:id", protectRoute, addSearchQuery);
router.get("/search-history/user/:id", protectRoute, getSearchHistory);

module.exports = router;
