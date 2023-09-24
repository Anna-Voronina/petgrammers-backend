const express = require("express");

const { validateBody, authenticate, upload } = require("../../middlewares");

const ctrl = require("../../controllers/auth");

const { schemas } = require("../../models/user");

const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), ctrl.register);

router.post("/login", validateBody(schemas.loginSchema), ctrl.login);

router.get("/current", authenticate, ctrl.getCurrent);

router.post("/logout", authenticate, ctrl.logout);

router.patch(
  "/user",
  authenticate,
  validateBody(schemas.userFormSchema),
  ctrl.editUserForm
);

router.patch(
  "/user/avatar",
  authenticate,
  upload.single("avatarURL"),
  ctrl.updateAvatar
);

module.exports = router;
