const niv = require("node-input-validator");

exports.checkNewUser = (req, res, next) => {
  const validation = new niv.Validator(req.body, {
    firstName: "required|string",
    lastName: "required|string",
    dateOfBirth: "required|date",
    gender: "required|string",
    email: "required|email",
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

  validation.check().then(
    catchAsync(async (matched) => {
      if (!matched) {
        return res
          .status(400)
          .json({ status: "fail", error: validation.errors });
      } else {
        next();
      }
    })
  );
};
