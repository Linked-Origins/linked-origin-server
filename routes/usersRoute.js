const express = require("express");
const router = express.Router();
const { checkNewUser } = require("./../utils/validators");
const { registerUser } = require("./../controllers/usersController");

router.post("/register-new-user", checkNewUser, registerUser);

module.exports = router;
