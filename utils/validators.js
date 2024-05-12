const niv = require("node-input-validator");
const Users = require("./../models/userSchema");

// Function to validate password
function validatePassword(value) {
  const regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$/;
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

  // Perform validation
  validation.check().then(async (matched) => {
    if (!matched) {
      return res.status(400).json({ status: "fail", error: validation.errors });
    }

    // Validate password separately
    if (!validatePassword(req.body.password)) {
      return res.status(400).json({
        status: "fail",
        error: { password: "Password must meet the specified requirements" },
      });
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
