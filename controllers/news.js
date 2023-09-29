const News = require("../models/news");

const { ctrlWrapper } = require("../helpers/");

const getNews = async (req, res) => {
  const { page = 1, limit = 6 } = req.query;
  const skip = (page - 1) * limit;
  const newsData = await News.find().skip(skip).limit(limit);
  res.json(newsData);
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
  console.log(data);
  res.status(200).json(data);
};

module.exports = {
  getNews: ctrlWrapper(getNews),
  getNewsByTitle: ctrlWrapper(getNewsByTitle),
};
