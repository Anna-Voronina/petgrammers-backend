const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const moment = require("moment");
const fs = require("fs/promises");
const cookieParser = require("cookie-parser");

const swaggerUI = require("swagger-ui-express");
const swaggerJson = require("./swager.json");

require("dotenv").config();

const authRouter = require("./routes/api/auth");
const noticeRouter = require("./routes/api/notices");
const petRouter = require("./routes/api/pets");
const userInfoRouter = require("./routes/api/userInfo");
const friendsRouter = require("./routes/api/friends");
const newsRouter = require("./routes/api/news");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(cookieParser());
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/auth", authRouter);
app.use("/api/notices", noticeRouter);
app.use("/api/pets", petRouter);
app.use("/api/user-info", userInfoRouter);
app.use("/api/friends", friendsRouter);
app.use("/api/news", newsRouter);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJson));

app.use((req, res, next) => {
  const { method, url } = req;
  const date = moment().format("DD-MM-YY_hh:mm:ss");
  fs.appendFile("./public/server.log", `\n${method} ${url} ${date}`);
  next();
});

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server Error" } = err;
  res.status(status).json({ message });
});

module.exports = app;
