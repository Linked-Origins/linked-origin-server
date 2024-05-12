const express = require("express");
const router = express.Router();
const { runChat } = require("./../controllers/geminiAiController");
const { protectRoute } = require("./../controllers/authController");

router.post("/chat", protectRoute, runChat);

module.exports = router;
