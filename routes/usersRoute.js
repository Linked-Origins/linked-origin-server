const express = require("express");
const router = express.Router();
const multerMiddleware = require("./../utils/image_upload/multerConfig");

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
router.get("/profile", protectRoute, getProfile);
router.put(
  "/update-profile",
  protectRoute,
  multerMiddleware("users"),
  updateProfile
);

module.exports = router;
