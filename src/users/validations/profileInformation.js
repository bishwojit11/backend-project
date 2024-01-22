const Joi = require("joi");
const passwordTemplate = Joi.string()
  .min(8)
  .max(50)
  .required()
  .label("Password");
const schema = Joi.object({
  firstName: Joi.string().required().label("First Name"),
  lastName: Joi.string().required().label("Last Name"),
});
const changePassword = Joi.object({
  oldPassword: passwordTemplate,
  password: passwordTemplate,
})

module.exports = {
  updateProfileData: schema,
  changePassword,
};
