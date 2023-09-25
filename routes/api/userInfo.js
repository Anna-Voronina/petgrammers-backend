const express = require("express");
const controllers = require("../../controllers/userInfo");
const router = express.Router();

const { authenticate } = require("../../middlewares");

router.get("/", authenticate, controllers.getUserInfo);

module.exports = router;
