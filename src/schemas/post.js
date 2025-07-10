import Joi from "joi";

export const postSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
});
