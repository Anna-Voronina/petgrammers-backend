const express = require("express");
const controllers = require("../../controllers/friends");
const router = express.Router();

router.get("/", controllers.getAllFriends);

module.exports = router;
