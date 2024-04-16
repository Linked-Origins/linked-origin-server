const catchAsync = require("./../utils/catchAsync");
const ErrorHandler = require("./../utils/ErrorHandler");

const Users = require("./../models/userSchema");

//register user
exports.registerUser = catchAsync(async (req, res, next) => {
  const {
    firstName,
    lastName,
    dateOfBirth,
    email,
    password,
    phone,

    countryOfOrigin,
    currentImmigrationStatus,
    dateOfImmigration,
    visaType,
    typeOfStatus,

    nativeLanguage,

    highestLevelOfEducation,
    previousWorkExperience,
    aspirations,

    currentHousingSituation,
    housingPreference,

    numOfFamilyMembers,
    relationship,

    interestsAndHobbies,
    preferredSocialActivities,
    ethos,

    challenges,
    supportServices,
  } = req.body;

  const personalInfo = {
    firstName,
    lastName,
    dateOfBirth,
    email,
    password,
    phone,
  };

  const immigrationInfo = {
    countryOfOrigin,
    currentImmigrationStatus,
    dateOfImmigration,
    visaType,
    typeOfStatus,
  };
  const languageProficiency = { nativeLanguage };

  const educationAndEmployment = {
    highestLevelOfEducation,
    previousWorkExperience,
    aspirations,
  };
  const housingSituation = { currentHousingSituation, housingPreference };

  const familyInfo = { numOfFamilyMembers, relationship };

  const socialIntegration = {
    interestsAndHobbies,
    preferredSocialActivities,
    ethos,
  };

  const supportNeeds = { challenges, supportServices };

  //add the new user.
  const newUser = await Users.create({
    personalInfo,
    immigrationInfo,
    languageProficiency,
    educationAndEmployment,
    housingSituation,
    familyInfo,
    socialIntegration,
    supportNeeds,
  });

  if (newUser) {
    return res
      .status(200)
      .json({ message: "user created successfully", data: newUser });
    next();
  } else {
    res.send("error creating");
    next();
  }
});

exports.getProfile = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  if (userId) {
    const profile = await Users.findOne({ userId: userId });

    if (profile) {
      return res.status(200).json({ message: "success", data: profile });
    } else {
      return res
        .status(404)
        .json({ message: "Profile not found for that user!" });
    }
  } else {
    return res.status(404).json({ message: "Please, provide a user id!" });
  }
});
