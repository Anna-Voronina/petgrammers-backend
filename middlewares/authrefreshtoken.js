const { HttpError } = require("../helpers");

const { REFRESH_SECRET_KEY } = process.env;

const jwt = require("jsonwebtoken");

const { User } = require("../models/user");
const RefreshToken = require("../models/sessionId");

const authRefreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw HttpError(401, "No refresh token provided");
    }

    const { userId, sessionId } = jwt.verify(refreshToken, REFRESH_SECRET_KEY);

    const user = await User.findById(userId);

    if (!user || !user.sessionId) {
      throw HttpError(401, "Invalid refresh token");
    }

    const session = await RefreshToken.findById(sessionId);

    if (!session) {
      throw HttpError(401, "Session is over");
    }
    if (user.sessionId.toString() !== sessionId.toString()) {
      throw HttpError(401, "Session ID does not match user ID");
    }

    req.user = user;

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authRefreshToken;
