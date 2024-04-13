const catchAsync = require("./../utils/catchAsync");
const ErrorHandler = require("./../utils/errorHandler");
const Users = require("./../models/userSchema");

//register user
exports.registerUser = catchAsync(async (req, res, next) => {
  //const {
  //  personalInfo: { firstName, lastName, dateOfBirth, email, phone },
  //  immigrationInfo: {
  //    countryOfOrigin,
  //    currentImmigrationStatus,
  //    dateOfImmigration,
  //    visaType,
  //    typeOfStatus,
  //  },
  //  languageProficiency: { nativeLanguage },
  //  educationAndEmployment: {
  //    highestLevelOfEducation,
  //    previousWorkExperience,
  //    aspirations,
  //  },
  //  housingSituation: { currentHousingSituation, housingPreference },
  //  familyInfo: { numOfFamilyMembers, relationship },
  //  socialIntegration: { interestAndHobbies, preferredSocialActivities, ethos },
  //  supportNeeds: { challenges, supportServices },
  //} = req.body;
  const {
    firstName,
    lastName,
    dateOfBirth,
    email,
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

  const personalInfo = { firstName, lastName, dateOfBirth, email, phone };

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
