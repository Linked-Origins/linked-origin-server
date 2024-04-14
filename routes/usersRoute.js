const express = require("express");
const router = express.Router();
const { checkNewUser, checkEmail } = require("./../utils/validators");
const { registerUser } = require("./../controllers/usersController");

router.post("/register-new-user", checkEmail, checkNewUser, registerUser);

module.exports = router;
