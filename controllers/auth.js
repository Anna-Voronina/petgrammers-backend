const { User } = require("../models/user");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { SECRET_KEY } = process.env;

const { HttpError, ctrlWrapper, cloudinary } = require("../helpers");

const jimp = require("jimp");

const fs = require("fs").promises;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ ...req.body, password: hashPassword });

  res.status(201).json({
    name: newUser.name,
    email: newUser.email,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email is invalid");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Password is invalid");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    token,
  });
};

const getCurrent = async (req, res) => {
  const { avatarURL, name, email, phone, birthday, city } = req.user;
  res.json({
    avatarURL,
    name,
    email,
    phone,
    birthday,
    city,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.json({
    message: "logout success",
  });
};

const editUserForm = async (req, res) => {
  const { _id } = req.user;
  const updatedFields = req.body;

  const updatedUserForm = await User.findByIdAndUpdate(_id, updatedFields, {
    new: true,
  });
  if (!updatedUserForm) {
    throw HttpError(404);
  }
  res.json(updatedUserForm);
};

const updateAvatar = async (req, res) => {
  const { _id: owner } = req.user;
  const { path: filepath } = req.file;
  const imageJimp = await jimp.read(filepath);
  imageJimp.cover(182, 182).write(filepath);

  const { url: avatarURL } = await cloudinary.uploader.upload(filepath, {
    folder: "user_avatar",
  });

  console.log(filepath);

  await fs.unlink(filepath);
  const result = await User.findByIdAndUpdate(
    owner,
    { avatarURL },
    { new: true }
  );

  res.json({
    result,
  });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  editUserForm: ctrlWrapper(editUserForm),
  updateAvatar: ctrlWrapper(updateAvatar),
};
