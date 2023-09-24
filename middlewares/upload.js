const multer = require("multer");
const path = require("path");

const destination = path.resolve("temp");

const multerConfig = multer.diskStorage({
  destination,
  filename: (req, file, cb) => {
    const uniquePrefix = `${Date.now()} -${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniquePrefix}_${file.originalname}`;
    cb(null, filename);
  },
});

const limits = {
  fileSize: 1024 * 1024 * 3,
};

const fileFilter = function (req, file, cb) {
  const allowedFileTypes = [
    "image/jpeg",
    "image/jpg",
    "image/webp",
    "image/png",
  ];

  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Allowed file types are jpeg,jpg,webp,png"), false);
  }
};

const upload = multer({
  storage: multerConfig,
  limits,
  fileFilter,
});

module.exports = upload;
