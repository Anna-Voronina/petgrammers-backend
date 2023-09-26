const { Schema, model } = require("mongoose");

const { handleMongooseError } = require("../helpers");

// const nameRegexp = /^[a-zA-Z]{2,16}$/;

// const passwordRegexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,16}$/;

// const emailRegexp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// const phoneRegexp = /^\+380\d{9}$/;

// const birthdayRegexp = /^\d{2}-\d{2}-\d{4}$/;

// const cityRegexp = /^[A-Za-z\s]+$/;

const newsSchema = new Schema(
  {
    imgUrl: String,
    title: String,
    text: String,
    date: Date,
    url: String,
    id: String,
  },
  { versionKey: false, timestamps: true }
);

newsSchema.post("save", handleMongooseError);

const News = model("news", newsSchema);

module.exports = News;
