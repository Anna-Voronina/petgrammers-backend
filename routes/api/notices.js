const express = require("express");
const controllers = require("../../controllers/notices");
const router = express.Router();
const { upload } = require("../../middlewares");

const { isValidId } = require("../../middlewares");

// ------- PUBLIC ------- //
// Для пошуку оголошень по категорії
router.get("/search/:category", controllers.searchNotices);

// Для пошуку оголошень по категорії та пошуку
router.get("/search/:category/:title", controllers.searchNotices);

//Для оримання одного оголошення
router.get("/:id", isValidId, controllers.getNoticeById);

//-------AUTHENTICATE ------- //

//Отримання всі обранi оголошеня
router.get("/get/favorites", controllers.getFavorites);

//Додати оголошення до обраних
router.patch("/:id/favorite", isValidId, controllers.changeNoticeFavorites);

//Видалити оголошення з обраних
// router.patch(
//   "/:id/remove-favorite",
//   isValidId,
//   controllers.deleteNoticeFromFavorites
// );

//Додати оголошення sell, in-good-hands, lost
router.post("/", upload.single("file"), controllers.addOwnNotice);

//Отримання власних оголошень автора
router.get("/", controllers.getAllOwnNotices);

//Видалити оголошення автора
router.delete("/:id", isValidId, controllers.deleteOwnNotice);

module.exports = router;
