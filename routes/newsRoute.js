const express = require("express");
const router = express.Router();
const {
  getNewsFromDb,
  getNewsFromDB,
} = require("./../controllers/newsController");

router.get("/", getNewsFromDB);

module.exports = router;
