const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  url: {
    type: String,
  },
  image: { type: String },
  publishedAt: {
    type: Date,
  },
  source: { name: { type: String }, url: { type: String } },
  category: { type: String },
});

const News = mongoose.model("News", newsSchema);

module.exports = News;
