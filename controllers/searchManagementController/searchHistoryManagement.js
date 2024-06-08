const catchAsync = require("../../utils/catchAsync");
exports.getSearchHistory = catchAsync(async (req, res, next) => {
  const user = req.user;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const searchHistory = user.searchHistory.slice(skip, skip + limit);

  if (searchHistory.length === 0) {
    return res.status(200).json({ message: "0 results" });
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
