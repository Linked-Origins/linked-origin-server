const express = require("express");
const router = express.Router();
const { login, logOut } = require("./../controllers/authController");

router.post("/user-login", login);
router.post("/logout", logOut);

module.exports = router;
