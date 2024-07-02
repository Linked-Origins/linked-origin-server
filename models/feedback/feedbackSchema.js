const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const feedBackSchema = new mongoose.Schema({
  generalExperience: { type: Number },
  specificFeatures: { type: Number },
  mostHelpfulFeature: { type: String },
  leastHelpfulFeature: { type: String },
  mostImportantCategory: { type: String },
  suggestions: { type: String },
  overallImpression: { type: String },
  bugsDescription: { type: String },
  suggestedFeatures: { type: String },
  newcomerValuePerspective: { type: String },
  recommendLinkedOriginsFeedback: { type: String },
  additionalFeedBack: { type: String },
  id: { type: String, default: uuidv4(), unique: true },
});

const FeedBack = mongoose.model("FeedBack", feedBackSchema);

module.exports = FeedBack;
