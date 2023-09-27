const Friend = require("../models/Friend");
const { ctrlWrapper } = require("../helpers");

const getAllFriends = async (req, res, next) => {
  const data = await Friend.find();
  res.status(200).json(data);
};

module.exports = { getAllFriends: ctrlWrapper(getAllFriends) };
