const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const { formatDate } = require("../middlewares");

const moment = require("moment");

const noticeSchema = new Schema(
  {
    category: {
      type: String,
      enum: ["sell", "lost-found", "in-good-hands"],
      required: [
        true,
        "Category must be one of 'sell', 'lost-found', 'in-good-hands'",
      ],
    },
    title: {
      type: String,
      required: [true, "Title must be required"],
    },
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      required: [true, "Name is required"],
    },
    date: {
      type: String,
      required: [true, "Date is required"],
      validate: {
        validator: function (dateString) {
          return moment(dateString, "DD-MM-YYYY", true).isValid();
        },
        message: "Format date must be DD-MM-YYYY",
      },
    },
    age: {
      type: Number,
    },
    type: {
      type: String,
      minlength: 2,
      maxlength: 50,
      required: [true, "Type is required"],
    },
    file: {
      type: String,
      required: [true, "File is required"],
    },
    sex: {
      type: String,
      enum: ["male", "female"],
      required: [true, "Sex is required!"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    price: {
      type: Number,
      required: function () {
        return ["sell"].includes(this.category);
      },
      min: [1, "Price must be greater than 0"],
    },
    comments: {
      type: String,
      maxlength: 120,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false }
);

noticeSchema.pre("save", formatDate);
noticeSchema.post("save", handleMongooseError);

const Notice = model("notice", noticeSchema);

module.exports = Notice;
