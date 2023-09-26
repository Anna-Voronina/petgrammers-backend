const News = require("../models/news");

const { ctrlWrapper } = require("../helpers/");

const getNews = async (req, res) => {
  const { page = 1, limit = 12 } = req.query;
  const skip = (page - 1) * limit;
  const newsData = await News.find().skip(skip).limit(limit);
  res.json(newsData);
};

module.exports = { getNews: ctrlWrapper(getNews) };
