const Joi = require("joi");

const addNoticeSchema = Joi.object({
  category: Joi.string()
    .valid("sell", "lost-found", "in-good-hands", "my-pet")
    .required(),
  title: Joi.string(),
  name: Joi.string().required(),
  date: Joi.string().required(),
  type: Joi.string().required(),
  file: Joi.binary().max(3 * 1024 * 1024),
  sex: Joi.string().when("category", {
    is: ["sell", "lost-found", "in-good-hands"],
    then: Joi.string().valid("male", "female").required(),
    otherwise: Joi.string(),
  }),
  location: Joi.string().when("category", {
    is: ["sell", "lost-found", "in-good-hands"],
    then: Joi.string().required(),
    otherwise: Joi.string(),
  }),
  price: Joi.number().when("category", {
    is: "sell",
    then: Joi.number().min(1).required(),
    otherwise: Joi.number(),
  }),
  comments: Joi.string(),
  favorite: Joi.boolean(),
});

module.exports = addNoticeSchema;
