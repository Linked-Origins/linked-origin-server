const niv = require("node-input-validator");
const Users = require("./../models/userSchema");

// Function to validate password
function validatePassword(value) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return regex.test(value);
}

exports.checkNewUser = (req, res, next) => {
  // Define validation rules
  const validation = new niv.Validator(req.body, {
    firstName: "required|string",
    lastName: "required|string",
    dateOfBirth: "required|date",
    gender: "required|string",
    email: "required|email",
    password: "required|string",
    phone: "required|string",

    countryOfOrigin: "required|string",
    currentImmigrationStatus: "required|string",
    dateOfImmigration: "required|date",
    visaType: "required|string",
    typeOfStatus: "required|string",

    nativeLanguage: "required|string",

    highestLevelOfEducation: "required|string",
    previousWorkExperience: "required|string",
    aspirations: "required|string",

    currentHousingSituation: "required|string",
    housingPreference: "required|string",

    numOfFamilyMembers: "required|string",
    relationship: "required|string",

    interestsAndHobbies: "required|string",
    preferredSocialActivities: "required|string",
    ethos: "required|string",
  });
  // Validate password separately
  if (!validatePassword(req.body.password)) {
    console.log("i am here");
    return res.status(400).json({
      status: "fail",
      error: {
        password:
          "Password must meet the specified requirements: Must contain at least one uppercase letter, lowercase letter, one number between 0-9 and must be at least 8 characters long",
      },
    });
  }

  // Perform validation
  validation.check().then(async (matched) => {
    console.log("gegege");
    if (!matched) {
      return res.status(400).json({ status: "fail", error: validation.errors });
    }

    next();
  });
};

exports.checkEmail = async (req, res, next) => {
  const email = req.body.email;

  const emailCheck = await Users.findOne({ "personalInfo.email": email });

  if (emailCheck) {
    return res.status(400).json({ message: "email already exists!" });
  }
  next();
};

exports.checkUserForUpdate = (req, res, next) => {
  // Define validation rules
  const validation = new niv.Validator(req.body, {
    firstName: "required|string",
    lastName: "required|string",
    phone: "required|string",
  });

  // Perform validation
  validation.check().then(async (matched) => {
    if (!matched) {
      return res.status(400).json({ status: "fail", error: validation.errors });
    }
    next();
  });
};
