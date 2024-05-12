const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const personalInfoSchema = new mongoose.Schema({
  firstName: { type: String, required: true, lowercase: true },
  lastName: { type: String, required: true, lowercase: true },
  dateOfBirth: { type: Date, required: true },
  email: { type: String, required: true, lowercase: true, unique: true },
  password: { type: String, required: true },
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
  assessment: [
    {
      listening: { type: String, required: true },
      reading: { type: String, required: true },
      speaking: { type: String, required: true },
      writing: { type: String, required: true },
    },
  ],
});

const educationAndEmploymentSchema = new mongoose.Schema({
  highestLevelOfEducation: { type: String, required: true },
  previousWorkExperience: { type: String, required: true },
  aspirations: { type: String, required: true },
});

const housingSituationSchema = new mongoose.Schema({
  currentHousingSituation: { type: String, required: true },
  housingPreference: { type: String },
});

const familyInfoSchema = new mongoose.Schema({
  numOfFamilyMembers: { type: Number, required: true, default: 0 },
  relationship: { type: String, required: true, default: null },
});

const socialIntegrationSchema = new mongoose.Schema({
  interestsAndHobbies: { type: String, required: true, default: null },
  preferredSocialActivities: { type: String, required: true, default: null }, //preferred social activiies for meeting new people.
  ethos: { type: String, default: null }, // cultural or social inclinations
});
const supportNeedsSchema = new mongoose.Schema({
  challenges: { type: String }, //specific challengesrelated to immigrations and settlement
  supportServices: { type: String, default: null }, //support services or resources
});

const profileSchema = new mongoose.Schema({
  name: { type: String },
  preferences: { type: String }, //temporary structure. to be revisited i decide which AI processing to use.
});
const searchHistorySchema = new mongoose.Schema({
  searchQuery: {
    type: String,
    required: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const chatHistorySchema = new mongoose.Schema({
  messages: [
    [
      {
        role: { type: String, enum: ["user", "model"] },
        parts: [{ text: { type: String } }],
        timestamp: { type: Date, default: Date.now },
      },
    ],
  ],
});

const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true },
  personalInfo: personalInfoSchema,
  immigationInfo: immigrationInfoSchema,
  languageProficiency: languageProficiencySchema,
  educationAndEmployment: educationAndEmploymentSchema,
  housingSituation: housingSituationSchema,
  familyInfo: familyInfoSchema,
  socialIntegration: socialIntegrationSchema,
  supportNeeds: supportNeedsSchema,
  profile: profileSchema,
  searchHistory: [searchHistorySchema],
  monAmiChatHistory: [chatHistorySchema],
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return bcrypt.compare(candidatePassword, userPassword);
};

userSchema.pre("save", function (next) {
  // Only generate a new UUID if the document is new
  if (!this.userId) {
    this.userId = uuidv4();
  }
  next();
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("personalInfo.password")) {
    return next();
  }
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);

    // Hash the password using the salt
    const hashedPassword = await bcrypt.hash(this.personalInfo.password, salt);

    // Replace the plain password with the hashed one
    this.personalInfo.password = hashedPassword;

    // Call next middleware
    next();
  } catch (error) {
    next(error);
  }
});
userSchema.pre("save", function (next) {
  // Check if this.profile is undefined
  if (!this.profile) {
    // Initialize this.profile
    this.profile = {};
  }

  // Set the name property of this.profile if it's not already set
  if (!this.profile.name) {
    this.profile.name = this.personalInfo.firstName;
  }

  next();
});
const Users = mongoose.model("User", userSchema);

module.exports = Users;
