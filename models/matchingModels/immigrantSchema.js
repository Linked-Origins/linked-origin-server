const mongoose = require("mongoose");
const User = require("./../userSchema");

const immigrantSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  preferredLanguages: [{ type: String }],
  timeSpentInCanada: { type: String },
  primaryReasonForImmigrating: { type: String },
  location: { type: String, required: true },
  challenges: [{ type: String }],
  expectedGains: [{ type: String }],
  selfDescription: { type: String },
  hobbies: [{ type: String }],
  specificAreasOfNeed: [{ type: String }],
  document: { type: String },
});

const Immigrants = mongoose.model("Immigrant", immigrantSchema);

module.exports = Immigrants;
