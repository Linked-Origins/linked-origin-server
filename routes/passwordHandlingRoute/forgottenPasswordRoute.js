const express = require("express");
const router = express.Router();

const {
  forgotPassword,
  handleForgotPassword,
} = require("./../../controllers/passwordHandlingController/forgottenPasswordController");

router.post("/forgotten-password", forgotPassword);
router.post("/handle-forgotten-password", handleForgotPassword);

module.exports = router;
