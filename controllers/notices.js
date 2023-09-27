const { ctrlWrapper, HttpError, cloudinary } = require("../helpers");
const Notice = require("../models/Notice");
const addNoticeSchema = require("../schemas/notices");

const fs = require("fs/promises");
const jimp = require("jimp");

const { User } = require("../models/user");

// створити ендпоінт для пошуку оголошень з урахуванням переданої категорії з NoticesCategoriesNav та/або параметрів з NoticesSearch (пошук по заголовку)
const searchNotices = async (req, res, next) => {
  const { category, title } = req.params;
  const { page = 1, limit = 12 } = req.query;
  const query = {};
  if (category) {
    query.category = category;
  }
  if (title) {
    query.title = { $regex: title, $options: "i" };
  }

  const skip = (page - 1) * limit;
  const notices = await Notice.find(query).skip(skip).limit(limit);
  res.status(200).json(notices);
};

const getAllNoticesByTitle = async (req, res, next) => {
  const { title } = req.params;
  const query = {};
  if (title) {
    query.title = { $regex: title, $options: "i" };
  }
  const data = await Notice.find(query);
  //Дописати, що видаємо пустий масив якщо респонс порожній
  res.status(200).json(data);
};

//Отримати одне оголошення
const getNoticeById = async (req, res, next) => {
  const { id } = req.params;
  const notice = await Notice.findById(id);
  if (!notice) {
    throw HttpError(404, "Notice is not found");
  }
  res.status(200).json(notice);
};

//Додати оголошення до обраних
const changeNoticeFavorites = async (req, res, next) => {
  const { id } = req.params;
  const { favorite } = req.body;
  if (favorite === undefined) {
    throw HttpError(400, "Missing field favorite");
  }
  const notice = await Notice.findByIdAndUpdate(
    id,
    { favorite },
    { new: true }
  );

  if (!notice) {
    throw HttpError(404, "Notice is not found");
  }

  if (favorite) {
    req.user.favorites.push(id);
  } else {
    const index = req.user.favorites.indexOf(id);
    if (index !== -1) {
      req.user.favorites.splice(index, 1);
    }
  }
  await req.user.save();

  res.status(200).json(notice);
};

//Отримання всіх оголошень які обрані
const getFavorites = async (req, res, next) => {
  // const data = await Notice.find({ favorite: true });
  // res.json(data);
  const { page = 1, limit = 12 } = req.query;
  const { id } = req.user;
  const skip = (page - 1) * limit;
  const user = await User.findById(id);
  const favoriteNoriceIds = user.favorites;
  const favorites = await Notice.find({ _id: { $in: favoriteNoriceIds } })
    .skip(skip)
    .limit(limit);
  res.status(200).json(favorites);
};

//Додати власне оголошення (не закінчено, додати owner)
const addOwnNotice = async (req, res, next) => {
  const { error } = addNoticeSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  const { id: owner } = req.user;
  const { path: filePath } = req.file;

  const imageJimp = await jimp.read(filePath);
  imageJimp.cover(336, 288).write(filePath);

  const { url: file } = await cloudinary.uploader.upload(filePath, {
    folder: "notices",
  });
  await fs.unlink(filePath);
  const data = await Notice.create({ ...req.body, file, owner });
  res.status(201).json(data);
};

//Отримання всіх власних оголошень
const getAllOwnNotices = async (req, res, next) => {
  const { page = 1, limit = 12 } = req.query;
  const skip = (page - 1) * limit;
  const { _id: owner } = req.user;
  const data = await Notice.find({ owner }).skip(skip).limit(limit);
  res.status(200).json(data);
};

//Видалити власне оголошення
const deleteOwnNotice = async (req, res, next) => {
  const { id } = req.params;
  const notice = await Notice.findByIdAndDelete(id);
  if (notice) {
    res.json(notice).status(204);
  } else {
    throw HttpError(404, "Id not found");
  }
};

const getAllNotices = async (req, res, next) => {
  const data = await Notice.find();
  res.status(200).json(data);
};

// const getAllContacts = async (req, res, next) => {
//   const { id: owner } = req.user;
//   const { page = 1, limit = 20 } = req.query;
//   const skip = (page - 1) * limit;
//   const data = await Contact.find({ owner })
//     .skip(skip)
//     .limit(limit)
//     .populate("owner", "email");
//   res.json(data);
// };

module.exports = {
  addOwnNotice: ctrlWrapper(addOwnNotice),
  searchNotices: ctrlWrapper(searchNotices),
  getNoticeById: ctrlWrapper(getNoticeById),
  changeNoticeFavorites: ctrlWrapper(changeNoticeFavorites),
  getFavorites: ctrlWrapper(getFavorites),
  getAllOwnNotices: ctrlWrapper(getAllOwnNotices),
  deleteOwnNotice: ctrlWrapper(deleteOwnNotice),
  getAllNotices: ctrlWrapper(getAllNotices),
  getAllNoticesByTitle: ctrlWrapper(getAllNoticesByTitle),
};
