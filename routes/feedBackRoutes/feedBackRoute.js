const express = require("express");
const router = express.Router();
const {
  postFeedBack,
  getFeedBack,
} = require("../../controllers/feedBackController/feedBackController");

router.post("/postfeedback", postFeedBack);
router.get("/getfeedback", getFeedBack);

module.exports = router;
