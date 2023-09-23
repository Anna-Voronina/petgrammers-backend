const { ctrlWrapper, HttpError, cloudinary } = require("../helpers");
const Notice = require("../models/Notice");
const addNoticeSchema = require("../schemas/notices");

const fs = require("fs/promises");

// створити ендпоінт для пошуку оголошень з урахуванням переданої категорії з NoticesCategoriesNav та/або параметрів з NoticesSearch (пошук по заголовку)
const searchNotices = async (req, res, next) => {
  try {
    const { category, title } = req.params;
    const query = {};
    if (category) {
      query.category = category;
    }
    if (title) {
      query.title = { $regex: title, $options: "i" };
    }
    const notices = await Notice.find(query);

    res.status(200).json(notices);
  } catch (error) {
    next(error);
  }
};

//Отримати одне оголошення
const getNoticeById = async (req, res, next) => {
  const { id } = req.params;
  const notice = await Notice.findById(id);
  if (!notice) {
    throw HttpError(404, "Notice is not found");
  }
  res.json(notice);
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
  res.json(notice);
};

//Отримання всіх оголошень які обрані
const getFavorites = async (req, res, next) => {
  const favoritesNotices = await Notice.find({ favorite: true });
  res.json(favoritesNotices);
};

//Додати власне оголошення (не закінчено, додати owner)
const addOwnNotice = async (req, res, next) => {
  const { error } = addNoticeSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  // const { id: owner } = req.user;

  const { path: filePath } = req.file;
  const { url: file } = await cloudinary.uploader.upload(filePath, {
    folder: "notices",
  });

  await fs.unlink(filePath);

  const data = await Notice.create({ ...req.body, file });
  res.status(201).json(data);
};

//Отримання всіх власних оголошень
const getAllOwnNotices = async (req, res, next) => {
  const data = await Notice.find();
  res.json(data);
};

//Видалити власне оголошення
const deleteOwnNotice = async (req, res, next) => {
  const { id } = req.params;
  const notice = await Notice.findByIdAndDelete(id);
  res.status(204).json(notice);
};

module.exports = {
  addOwnNotice: ctrlWrapper(addOwnNotice),
  searchNotices: ctrlWrapper(searchNotices),
  getNoticeById: ctrlWrapper(getNoticeById),
  changeNoticeFavorites: ctrlWrapper(changeNoticeFavorites),
  getFavorites: ctrlWrapper(getFavorites),
  getAllOwnNotices: ctrlWrapper(getAllOwnNotices),
  deleteOwnNotice: ctrlWrapper(deleteOwnNotice),
};
