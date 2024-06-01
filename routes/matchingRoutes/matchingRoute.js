const express = require("express");
const router = express.Router();
const multerMiddleware = require("./../../utils/image_upload/multerConfig");
const {
  addNewImmigrant,
  addNewLocal,
} = require("../../controllers/matchingControllers/matchingController");

router.post(
  "/add-new-immigrant",
  multerMiddleware("newcomers"),
  addNewImmigrant
);
router.post("/add-new-Local", addNewLocal);

module.exports = router;
