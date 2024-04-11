const mongoose = require("mongoose");

const personalInfoSchema = new mongoose.Schema({
  firstName: { type: String, required: true, lowercase: true },
  lastName: { type: String, required: true, lowercase: true },
  dateOfBirth: { type: Date, required: true },
  email: { type: String, required: true, lowercase: true },
  phone: { type: String, required: true },
});

const immigrationInfoSchema = new mongoose.Schema({
  countryOfOrigin: { type: String, required: true },
  currentImmigrationStatus: { type: String, required: true },
  dateOfImmigration: { type: Date, required: true },
  visaType: { type: String, required: true },
  typeOfStatus: { type: String, required: true },
});

const languageProficiencySchema = new mongoose.Schema({
  nativeLanguage: { type: String, required: true },
  assessment: {},
});

const educationAndEmploymentSchema = new mongoose.Schema({
  highestLevelOfEducation: { type: String, required: true },
  previousWorkExperience: { type: String, required: true },
  aspirations: { type: String, required: true },
});

const housingSituationSchema = new mongoose.Schema({
  currentHousingSituatuion: { type: String, required: true },
  housingPreference: { type: String },
});

const familyInfoSchema = new mongoose.Schema({
  numOfFamilyMembers: { type: Number, required: true, default: 0 },
  relationship: { type: String, required: true, default: null },
});

const socialIntegrationSchema = new mongoose.Schema({
  interestAndHobbies: { type: String, required: true, default: null },
  preferredSocialActivities: { type: String, required: true, default: null }, //preferred social activiies for meeting new people.
  ethos: { type: String, default: null }, // cultural or social inclinations
});
const supportNeedsSchema = new mongoose.Schema({
  challenges: { type: String }, //specific challengesrelated to immigrations and settlement
  supportServices: { type: String, default: null }, //support services or resources
});

const userSchema = new mongoose.Schema({
  personalInfo: personalInfoSchema,
  immigationInfo: immigrationInfoSchema,
  languageProficiency: languageProficiencySchema,
  educationAndEmployment: educationAndEmploymentSchema,
  housingSituation: housingSituationSchema,
  familyInfo: familyInfoSchema,
  socialIntegration: socialIntegrationSchema,
  supportNeeds: supportNeedsSchema,
});

const Users = mongoose.model("User", userSchema);
