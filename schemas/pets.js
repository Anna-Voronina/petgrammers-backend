const Joi = require("joi");

const addPetSchema = Joi.object({
  name: Joi.string().required(),
  date: Joi.string().required(),
  type: Joi.string().required(),
  file: Joi.string(),
  comments: Joi.string(),
});

module.exports = addPetSchema;
