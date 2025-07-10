export const answerSchema = Joi.object({
  content: Joi.string().min(5).required(),
});
