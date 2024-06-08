const express = require("express");
const router = express.Router();
const {
  runChat,
} = require("../../controllers/geminiController/geminiAiController");
const {
  protectRoute,
} = require("../../controllers/authController/authController");

router.post("/chat", protectRoute, runChat);

module.exports = router;
