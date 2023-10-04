const Joi = require("joi");

const nameRegexp = /^[a-zA-Zа-яА-ЯёЁіїєґҐ ]{2,50}$/;

const passwordRegexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,16}$/;

const emailRegexp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const phoneRegexp = /^\+380\d{9}$/;

const birthdayRegexp = /^\d{2}-\d{2}-\d{4}$/;

const cityRegexp = /^[A-Za-z\s]+$/;

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

module.exports = { schemas };
