const { Schema, model } = require("mongoose");

const { handleMongooseError } = require("../helpers");

const { default: mongoose } = require("mongoose");

const nameRegexp = /^[a-zA-Zа-яА-ЯёЁіїєґҐ ]{2,50}$/;

const emailRegexp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

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
      default: "01-01-1970",
    },
    city: {
      type: String,
      default: "Kyiv",
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

const User = model("user", userSchema);

module.exports = { User };
