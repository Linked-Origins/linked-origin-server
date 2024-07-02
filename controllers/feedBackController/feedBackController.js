const FeedBack = require("../../models/feedback/feedbackSchema");

exports.postFeedBack = async (req, res, next) => {
  try {
    const {
      generalExperience,
      specificFeatures,
      mostHelpfulFeature,
      leastHelpfulFeature,
      mostImportantCategory,
      suggestions,
      overallImpression,
      bugsDescription,
      suggestedFeatures,
      recommendLinkedOriginsFeedback,
      additionalFeedBack,
    } = req.body;

    const feedback = await FeedBack.create({
      specificFeatures,
      mostHelpfulFeature,
      leastHelpfulFeature,
      mostImportantCategory,
      suggestions,
      overallImpression,
      bugsDescription,
      suggestedFeatures,
      recommendLinkedOriginsFeedback,
      additionalFeedBack,
    });

    if (feedback) {
      return res
        .status(200)
        .json({ message: "feedback received successfully!" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
};

exports.getFeedBack = async (req, res) => {
  const feedbacks = await FeedBack.find();
  if (feedbacks.length !== 0) {
    return res.status(200).json({ length: feedbacks.length, data: feedbacks });
  } else {
    return res.status(200).json({ length: 0, data: "no feedbacks found" });
  }
};
