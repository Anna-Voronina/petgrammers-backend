const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const { formatDate } = require("../middlewares");

const moment = require("moment");

const petSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 16,
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
    type: {
      type: String,
      minlength: 2,
      maxlength: 16,
      required: [true, "Type is required"],
    },
    file: {
      type: String,
      required: [true, "Image is required"],
    },
    comments: {
      type: String,
      maxlength: 120,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false }
);

petSchema.pre("save", formatDate);
petSchema.post("save", handleMongooseError);

const Pet = model("pet", petSchema);

module.exports = Pet;
