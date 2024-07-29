const express = require("express");
const router = express.Router();

const {
  vendorRegistration,
} = require("./../../controllers/vendorRegController/vendorRegController");

router.post("/add-vendor", vendorRegistration);

module.exports = router;
