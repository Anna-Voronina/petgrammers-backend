const queryString = require("query-string");
const axios = require("axios");
const URL = require("url");
const { ctrlWrapper } = require("../helpers");

const googleAuth = async (req, res, next) => {
  const stringifyParams = queryString.stringify({
    clientId: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: "http://localhost:3000/api/auth/google-redirect",
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ].join(" "),
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
  });

  return res.redirect(
    `https://account.google.com/o/oauth2/v2/auth?${stringifyParams}`
  );
};

const googleRedirect = async (req, res, next) => {
  const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  const ulrObj = new URL(fullUrl);
  const ulrParams = queryString.parse(ulrObj.search);
  const code = ulrParams.code;
  const tokenData = await axios({
    url: `https://oauth2/googleapis.com/token`,
    method: "post",
    data: {
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: "http://localhost:3000/api/auth/google-redirect",
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
  return res.redirect(`${process.env.FRONTEND_URL}?email=${userData.data.email}  
  `);
};

module.exports = {
  googleAuth: ctrlWrapper(googleAuth),
  googleRedirect: ctrlWrapper(googleRedirect),
};
