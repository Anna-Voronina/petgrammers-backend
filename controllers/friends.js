const Friend = require("../models/Friend");
const { ctrlWrapper } = require("../helpers");

const getAllFriends = async (req, res, next) => {
  const { page = 1, limit = 9 } = req.query;
  const skip = (page - 1) * limit;
  const data = await Friend.find().skip(skip).limit(limit);
  const total = await Friend.countDocuments();
  res.status(200).json({ data, total });
};

module.exports = { getAllFriends: ctrlWrapper(getAllFriends) };
