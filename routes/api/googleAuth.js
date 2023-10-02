const express = require("express");

const ctrl = require("../../controllers/google");

const router = express.Router();

router.get("/google", ctrl.googleAuth);

router.get("/google-redirect", ctrl.googleRedirect);

module.exports = router;
