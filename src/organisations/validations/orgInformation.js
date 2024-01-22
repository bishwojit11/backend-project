const Joi = require("joi");
const { fileMetaInfo } = require("../../common/validations/fileMetaInfo");
const emailTemplate = Joi.string().max(50).email().label("Office Email");
const addressTemplate = Joi.object({
  street: Joi.string().required(),
  aptSuiteEtc: Joi.string().required(),
  city: Joi.string().required(),
  stateOrProvince: Joi.string().required(),
  country: Joi.string().required(),
  postCode: Joi.string().required(),
  googlePlaceLocation: Joi.string().required(),
}).optional();

const createOrganisationData = Joi.object({
  name: Joi.string().required().label("Name"),
  officePhone: Joi.string().label("Office Phone"),
  officeEmail: emailTemplate,
  address: addressTemplate,
  registrationNumber: Joi.string().label("Registration Number"),
  industry: Joi.string().label("Industry"),
  purposeOfUse: Joi.array().items(Joi.string()).label(" Purpose of Use"),
  organisationalLogo: fileMetaInfo,
});
const updateOrganisationData = Joi.object({
  name: Joi.string().required().label("Name"),
  officeEmail: emailTemplate,
  address: addressTemplate,
});
module.exports = {
  createOrganisationData,
  updateOrganisationData,
};
