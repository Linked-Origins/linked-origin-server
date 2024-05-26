const mongoose = require("mongoose");

const localsSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  preferredLanguages: [{ type: String }],
  timeSpentInCanada: { type: String },
  areasOfExpertise: [{ type: String }],
  location: { type: String },
  motivations: [{ type: String }],
  backgrounds: [{ type: String }],
  selfDescription: { type: String },
  hobbies: [{ type: String }],
  specificGuidanceProficiencies: [{ type: String }],
});

const Locals = mongoose.model("Local", localsSchema);

module.exports = Locals;
