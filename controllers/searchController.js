const catchAsync = require("./../utils/catchAsync");
const ErrorHandler = require("./../utils/ErrorHandler");
const Users = require("./../models/userSchema");

exports.addSearchQuery = catchAsync(async (req, res, next) => {
  const userId = req.params.id;

  const searchQuery = req.body.searchQuery;

  //get the user first.
  const user = await Users.findOne({ userId });

  //if no user, return an error message
  if (!user || user.length === 0 || user === null) {
    return next(new ErrorHandler("user not found"), 404);
  } else {
    const user = await Users.findOneAndUpdate(
      { userId: userId },
      { $push: { searchHistory: searchQuery } },
      { new: true }
    );

    return res
      .status(200)
      .json({ message: "success!", searchQuery: searchQuery });
  }
});

exports.getSearchHistory = catchAsync(async (req, res, next) => {
  // Get user ID from request parameters
  const userId = req.params.id;

  if (!userId) {
    return next(new ErrorHandler("User ID cannot be blank!", 400));
  }

  // Find the user by ID and retrieve their search history
  const user = await Users.findOne({ userId: userId }).select("searchHistory");

  if (!user) {
    return next(new ErrorHandler("User does not exist!", 400));
  }

  const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  const limit = parseInt(req.query.limit) || 10; // Default to limit of 10 if not provided
  const skip = (page - 1) * limit;

  const searchHistory = user.searchHistory.slice(skip, skip + limit);

  if (searchHistory.length === 0) {
    return res.status(200).json({ message: "No search history found!" });
  }

  return res.status(200).json({
    status: "success",
    data: {
      page,
      limit,
      totalResults: user.searchHistory.length,
      searchHistory,
    },
  });
});
