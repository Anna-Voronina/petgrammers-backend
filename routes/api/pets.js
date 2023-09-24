const express = require("express");
const controllers = require("../../controllers/pets");
const router = express.Router();

const { upload, isValidId, authenticate } = require("../../middlewares");

router.use(authenticate);
//Add own pet
router.post("/", upload.single("file"), controllers.addOwnPet);

//delete own pet
router.delete("/:id", isValidId, controllers.deleteOwnPet);
module.exports = router;
