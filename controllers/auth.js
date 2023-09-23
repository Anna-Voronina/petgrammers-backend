const { User } = require("../models/user");

const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

const { SECRET_KEY } = process.env;

const { HttpError, ctrlWrapper } = require("../helpers");

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
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const imageJimp = await jimp.read(tempUpload);
  await imageJimp.resize(250, 250).writeAsync(tempUpload);
  const resultUpload = path.join(avatarDir, originalname);
  const filename = `${_id}_${originalname}`;
  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatar", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    avatarURL,
  });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  editUserForm: ctrlWrapper(editUserForm),
};
