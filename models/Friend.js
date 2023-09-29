const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");

const friendSchema = new Schema({
  title: {
    type: String,
  },
  url: {
    type: String,
  },

  addressUrl: {
    type: String,
  },

  addressUrl: {
    type: String,
  },
  address: {
    type: String,
  },
  workDays: {
    type: Array,
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
});

const Friend = model("friend", friendSchema);

module.exports = Friend;
