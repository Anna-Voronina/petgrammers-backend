const express = require("express");
const controllers = require("../../controllers/pets");
const router = express.Router();

const { upload, isValidId } = require("../../middlewares");
// const { authenticate } = require("../../middlewares");

//Add own pet
router.post("/", upload.single("file"), controllers.addOwnPet);

//delete own pet
router.delete("/:id", isValidId, controllers.deleteOwnPet);
module.exports = router;
