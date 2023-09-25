const { ctrlWrapper, HttpError, cloudinary } = require("../helpers");
const Pet = require("../models/Pet");
const addPetSchema = require("../schemas/pets");
const fs = require("fs/promises");
const jimp = require("jimp");

//Add own pet
const addOwnPet = async (req, res, next) => {
  const { error } = addPetSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  const { id: owner } = req.user;
  const { path: filePath } = req.file;

  const imageJimp = await jimp.read(filePath);
  imageJimp.cover(161, 161).write(filePath);

  const { url: file } = await cloudinary.uploader.upload(filePath, {
    folder: "pets",
  });

  await fs.unlink(filePath);

  const data = await Pet.create({ ...req.body, file, owner });
  res.status(200).json(data);
};

//Delete own pet
const deleteOwnPet = async (req, res, next) => {
  const { id } = req.params;
  const pet = await Pet.findById(id);
  if (!pet) {
    return res.status(404).json({ message: "Pet is not found" });
  }
  const data = await Pet.findByIdAndDelete(id);
  res.status(204).json(data);
};

const getUserWithPets = async (req, res, next) => {};

module.exports = {
  addOwnPet: ctrlWrapper(addOwnPet),
  deleteOwnPet: ctrlWrapper(deleteOwnPet),
  getUserWithPets: ctrlWrapper(getUserWithPets),
};
