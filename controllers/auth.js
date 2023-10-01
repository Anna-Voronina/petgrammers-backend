const { User } = require("../models/user");
const RefreshToken = require("../models/sessionId");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { SECRET_KEY, REFRESH_SECRET_KEY } = process.env;

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
    user: { name: newUser.name, email: newUser.email },
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

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1m" });

  const session = await RefreshToken.create({ userId: user._id });
  await User.findByIdAndUpdate(user._id, { token, sessionId: session._id });

  const payloadSession = {
    userId: user._id,
    sessionId: session._id,
  };

  const refreshToken = jwt.sign(payloadSession, REFRESH_SECRET_KEY, {
    expiresIn: "5m",
  });

  res.json({ user: { name: user.name, email }, token, refreshToken });
};

const getCurrent = async (req, res) => {
  const { avatarURL, name, email, phone, birthday, city, favorites } = req.user;
  res.json({
    avatarURL,
    name,
    email,
    phone,
    birthday,
    city,
    favorites,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  await RefreshToken.deleteMany({ userId: _id });
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

  await fs.unlink(filepath);
  await User.findByIdAndUpdate(owner, { avatarURL });

  res.json({
    avatarURL,
  });
};

const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  const { userId } = jwt.verify(refreshToken, REFRESH_SECRET_KEY);

  const newAccessToken = jwt.sign({ id: userId }, SECRET_KEY, {
    expiresIn: "1m",
  });

  await User.findByIdAndUpdate(userId, { token: newAccessToken });

  res.json({
    token: newAccessToken,
  });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  editUserForm: ctrlWrapper(editUserForm),
  updateAvatar: ctrlWrapper(updateAvatar),
  refreshToken: ctrlWrapper(refreshToken),
};
