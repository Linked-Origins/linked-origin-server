const express = require("express");
const router = express.Router();

const {
  forgotPassword,
  handleForgotPassword,
  changePassword,
} = require("./../../controllers/passwordHandlingController/forgottenPasswordController");

router.post("/forgotten-password", forgotPassword);
router.get("/handle-forgotten-password/:token", handleForgotPassword);
router.post("/change-password", changePassword);

module.exports = router;
