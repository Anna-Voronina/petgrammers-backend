const queryString = require("query-string");
const axios = require("axios");
const { URL } = require("url");
const { User } = require("../models/user");
const RefreshToken = require("../models/sessionId");
const jwt = require("jsonwebtoken");

const { ctrlWrapper, HttpError } = require("../helpers");

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  FRONTEND_URL,
  BASE_URL,
  SECRET_KEY,
  REFRESH_SECRET_KEY,
} = process.env;

const googleAuth = async (req, res, next) => {
  const stringifyParams = queryString.stringify({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: `${BASE_URL}/api/auth/google-redirect`,
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ].join(" "),
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
  });

  return res.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${stringifyParams}`
  );
};

const googleRedirect = async (req, res, next) => {
  const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  const ulrObj = new URL(fullUrl);
  const ulrParams = queryString.parse(ulrObj.search);
  const code = ulrParams.code;
  const tokenData = await axios({
    url: `https://oauth2.googleapis.com/token`,
    method: "post",
    data: {
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: `${BASE_URL}/api/auth/google-redirect`,
      grant_type: "authorization_code",
      code,
    },
  });

  const userData = await axios({
    url: "https://googleapis.com/o/oauth2/v2/userinfo",
    method: "get",
    headers: {
      Authorization: `Bearer ${tokenData.data.access_token}`,
    },
  });

  if (!userData || !userData.data || !userData.data.email) {
    throw HttpError(401, "Unable to get user data from Google");
  }
  const { email } = userData.data;
  const user = await User.findOne({ email });
  if (!user) {
    await User.create({ ...req.body });
  }

  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
  console.log(token);
  const payloadSession = {
    userId: user._id,
  };
  await RefreshToken.create({ userId: user._id });
  const refreshToken = jwt.sign(payloadSession, REFRESH_SECRET_KEY, {
    expiresIn: "30d",
  });
  console.log(refreshToken);

  return res.redirect(
    `${FRONTEND_URL}/?name=${encodeURIComponent(
      user.name
    )}&email=${encodeURIComponent(email)}&token=${encodeURIComponent(
      token
    )}&refreshToken=${encodeURIComponent(refreshToken)}`
  );
};

module.exports = {
  googleAuth: ctrlWrapper(googleAuth),
  googleRedirect: ctrlWrapper(googleRedirect),
};
