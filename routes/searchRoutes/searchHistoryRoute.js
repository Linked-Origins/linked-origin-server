const express = require("express");
const router = express.Router();
const {
  protectRoute,
} = require("../../controllers/authController/authController");
const {
  getSearchHistory,
} = require("../../controllers/searchManagementController/searchHistoryManagement");
router.get("/search-history", protectRoute, getSearchHistory);

module.exports = router;
