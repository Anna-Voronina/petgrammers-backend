const News = require("../models/news");

const { ctrlWrapper } = require("../helpers/");

const getNews = async (req, res) => {
  const { page = 1, limit = 6 } = req.query;
  const skip = (page - 1) * limit;
  const data = await News.find().skip(skip).limit(limit);
  const total = await News.countDocuments();

  res.json({ data, total });
};

const getNewsByTitle = async (req, res) => {
  const { title } = req.params;
  const { page = 1, limit = 6 } = req.query;
  const skip = (page - 1) * limit;
  const query = {};
  if (title) {
    query.title = { $regex: title, $options: "i" };
  }
  const data = await News.find(query).skip(skip).limit(limit);
  const total = await News.countDocuments(query);

  res.status(200).json({ data, total });
};

module.exports = {
  getNews: ctrlWrapper(getNews),
  getNewsByTitle: ctrlWrapper(getNewsByTitle),
};
