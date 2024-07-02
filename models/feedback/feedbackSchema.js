const mongoose = require("mongoose");

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
});

const FeedBack = mongoose.model("FeedBack", feedBackSchema);

module.exports = FeedBack;
