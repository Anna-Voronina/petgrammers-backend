const { Schema, model } = require("mongoose");

const { handleMongooseError } = require("../helpers");

const Joi = require("joi");
const { default: mongoose } = require("mongoose");

const nameRegexp = /^[a-zA-Z]{2,16}$/;

const passwordRegexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,16}$/;

const emailRegexp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const phoneRegexp = /^\+380\d{9}$/;

const birthdayRegexp = /^\d{2}-\d{2}-\d{4}$/;

const cityRegexp = /^[A-Za-z\s]+$/;

const userSchema = new Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "sessionId",
    },
    avatarURL: {
      type: String,
      default:
        "https://res.cloudinary.com/dofau6dtf/image/upload/v1695541073/default_avatar/Photo_default_twk9o4.jpg",
    },
    name: {
      type: String,
      match: nameRegexp,
      required: [true, "Set name for user"],
    },
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: emailRegexp,
      unique: true,
    },
    phone: {
      type: String,
      default: "+380123456789",
    },
    birthday: {
      type: String,
      default: "01.01.1970",
    },
    city: {
      type: String,
      default: "city Name",
    },
    favorites: {
      type: Array,
      default: [],
    },

    token: { type: String, default: "" },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({
  name: Joi.string().pattern(nameRegexp).required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().pattern(passwordRegexp).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().pattern(passwordRegexp).required(),
});

const userFormSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().pattern(emailRegexp),
  birthday: Joi.string().required().pattern(birthdayRegexp),
  phone: Joi.string().pattern(phoneRegexp),
  city: Joi.string().pattern(cityRegexp),
});

const schemas = {
  loginSchema,
  registerSchema,
  userFormSchema,
};

const User = model("user", userSchema);

module.exports = {
  User,
  schemas,
};
