const express = require("express");
const controllers = require("../../controllers/notices");
const router = express.Router();
const { upload } = require("../../middlewares");

const { isValidId, authenticate } = require("../../middlewares");

// ------- PUBLIC ------- //
// Для пошуку оголошень по категорії
router.get("/search/:category", controllers.searchNotices);

// Для пошуку оголошень по категорії та пошуку
router.get("/search/:category/:title", controllers.searchNotices);

//Для оримання одного оголошення
router.get("/:id", isValidId, controllers.getNoticeById);

//-------AUTHENTICATE ------- //

//Додати оголошення sell, in-good-hands, lost
router.post("/", upload.single("file"), authenticate, controllers.addOwnNotice);

//Додати/видалити оголошення до/з обраних
router.patch(
  "/:id/favorite",
  isValidId,
  authenticate,
  controllers.changeNoticeFavorites
);

//Отримання всі обранi оголошеня
router.get("/get/favorites", authenticate, controllers.getFavorites);

//Отримання власних оголошень автора
router.get("/", authenticate, controllers.getAllOwnNotices);

//Видалити оголошення автора
router.delete("/:id", authenticate, isValidId, controllers.deleteOwnNotice);

//Дістати всі оголошення
router.get("/get/all", authenticate, controllers.getAllNotices);

module.exports = router;
