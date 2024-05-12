const express = require("express");
const { fetchJobListings } = require("./../controllers/jobListingsController");

const router = express.Router();

router.get("/", fetchJobListings);

module.exports = router;
