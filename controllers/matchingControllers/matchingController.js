const catchAsync = require("./../../utils/catchAsync");
const ErrorHandler = require("./../../utils/ErrorHandler");
const Immigrants = require("./../../models/matchingModels/immigrantSchema");
const Locals = require("./../../models/matchingModels/localsSchema");

exports.addNewImmigrant = catchAsync(async (req, res, next) => {
  const document = req.file.path;
  const {
    firstName,
    lastName,
    email,
    phone,
    preferredLanguages,
    timeSpentInCanada,
    primaryReasonForImmigrating,
    location,
    challenges,
    expectedGains,
    selfDescription,
    hobbies,
    specificAreasOfNeed,
  } = req.body;

  const newImmigrant = await Immigrants.create({
    firstName,
    lastName,
    email,
    phone,
    preferredLanguages,
    timeSpentInCanada,
    primaryReasonForImmigrating,
    location,
    challenges,
    expectedGains,
    selfDescription,
    hobbies,
    specificAreasOfNeed,
    document,
  });

  if (newImmigrant) {
    return res
      .status(200)
      .json({ message: "data saved successfully", data: newImmigrant });
  } else return next(new ErrorHandler("couldn't save data.", 401));
});

exports.addNewLocal = catchAsync(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    preferredLanguages,
    timeSpentInCanada,
    areasOfExpertise,
    location,
    motivations,
    backgrounds,
    selfDescription,
    hobbies,
    specificGuidanceProficiencies,
  } = req.body;

  const newLocal = await Locals.create({
    firstName,
    lastName,
    email,
    phone,
    preferredLanguages,
    timeSpentInCanada,
    areasOfExpertise,
    location,
    motivations,
    backgrounds,
    selfDescription,
    hobbies,
    specificGuidanceProficiencies,
  });

  if (newLocal) {
    return res
      .status(200)
      .json({ message: "data saved successfully", data: newLocal });
  } else return next(new ErrorHandler("couldn't save data.", 401));
});
