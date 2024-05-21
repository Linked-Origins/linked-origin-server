const Users = require("./../models/userSchema");
const jwt = require("jsonwebtoken");
const catchAsync = require("./../utils/catchAsync");
const ErrorHandler = require("../utils/ErrorHandler");
const { promisify } = require("util");

exports.login = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(email);
  //check if user exists and password is correct
  const user = await Users.findOne({ "personalInfo.email": email })
    .select("personalInfo.password")
    .select("personalInfo.firstName")
    .select("personalInfo.lastName")
    .select("userId");
  console.log(user);
  if (
    !user ||
    !(await user.correctPassword(password, user.personalInfo.password))
  ) {
    return res.status(401).json({
      success: false,
      message: "Incorrect email or password! Please login again.",
    });
  }

  // Generate Bearer Token
  const token = jwt.sign({ id: user.userId }, process.env.JWT_SECRET);

  // Set Bearer token in response header
  res.setHeader("Authorization", `Bearer ${token}`);

  return res
    .status(200)
    .cookie("cookie", token, { httpOnly: true, sameSite: "None", secure: true })
    .json({
      success: true,
      firstName: user.personalInfo.firstName,
      lastName: user.personalInfo.lastName,
      email: user.personalInfo.email,
      phone: user.personalInfo.phone,
      token,
      userId: user.userId,
    });
});

//logout
exports.logOut = (req, res) => {
  res
    .cookie("cookie", "loggedOut", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    })
    .json({ message: "logged out!" });
};
exports.isLoggedIn = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.cookie) {
    token = req.cookies.cookie;
    console.log(token);
  }
  if (token) {
    //verifytoken

    console.log("tokeeeeen", token);
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log("decoded", decoded);
    //check if user still exists
    const currentUser = await Users.findOne({ userId: decoded.id });
    if (!currentUser) {
      return next(err);
    }
    req.user = currentUser;
    console.log(currentUser);
    return next();
  }
};

exports.protectRoute = catchAsync(async (req, res, next) => {
  let token;

  //check if the request contains a token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.cookie) {
    token = req.cookies.cookie;
    console.log(token);
  } else {
    return res.status(401).json({
      message: `you need to be logged in to view this resource! Don't have an account? You can sign up for free!`,
    });
  }
  //verify token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        message:
          "Authentication failed...pls, ensure you have a valid email/password.",
      });
    }
  }

  const currentUser = await Users.findOne(decoded.userId);
  if (!currentUser) {
    return next(
      new ErrorHandler(
        "User not logged in or user doesn't exist! Pls, log in.",
        401
      )
    );
  }

  req.user = currentUser;

  next();
});
