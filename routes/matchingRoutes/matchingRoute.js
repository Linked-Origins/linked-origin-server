const express = require("express");
const router = express.Router();
const {
  addNewImmigrant,
  addNewLocal,
} = require("../../controllers/matchingControllers/matchingController");

router.post("/add-new-immigrant", addNewImmigrant);
router.post("/add-new-Local", addNewLocal);

module.exports = router;
