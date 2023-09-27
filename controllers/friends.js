const Friend = require("../models/Friend");
const { ctrlWrapper } = require("../helpers");

const getAllFriends = async (req, res, next) => {
  const { page = 1, limit = 9 } = req.query;
  const skip = (page - 1) * limit;
  const data = await Friend.find().skip(skip).limit(limit);
  res.status(200).json(data);
};

module.exports = { getAllFriends: ctrlWrapper(getAllFriends) };
