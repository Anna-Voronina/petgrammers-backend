const { ctrlWrapper } = require("../helpers");
const Pet = require("../models/Pet");
const { User } = require("../models/user");

const getUserInfo = async (req, res, next) => {
  const { id } = req.user;
  const user = await User.findById(id);
  const userPets = await Pet.find({ owner: id });

  const userInfo = {
    name: user.name,
    email: user.email,
    birthday: user.birthday,
    phone: user.phone,
    city: user.city,
    pets: [...userPets],
  };

  res.json(userInfo).status(200);
};
module.exports = {
  getUserInfo: ctrlWrapper(getUserInfo),
};
