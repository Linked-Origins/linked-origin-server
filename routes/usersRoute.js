const express = require("express");
const router = express.Router();
const {
  checkNewUser,
  checkEmail,
  checkUserForUpdate,
} = require("./../utils/validators");
const {
  registerUser,
  getProfile,
  updateProfile,
} = require("./../controllers/usersController");
const { protectRoute, isLoggedIn } = require("./../controllers/authController");

router.post("/register-new-user", checkEmail, checkNewUser, registerUser);
router.get("/profile", isLoggedIn, getProfile);
router.put("/update-profile", updateProfile);

module.exports = router;
