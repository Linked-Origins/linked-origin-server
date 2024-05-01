const express = require("express");
const router = express.Router();
const { checkNewUser, checkEmail } = require("./../utils/validators");
const {
  registerUser,
  getProfile,
} = require("./../controllers/usersController");
const { protectRoute } = require("./../controllers/authController");

router.post("/register-new-user", checkEmail, checkNewUser, registerUser);
router.get("/profile", protectRoute, getProfile);

module.exports = router;
