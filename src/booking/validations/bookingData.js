const Joi = require("joi");
const { SERVICES } = require("../../models/typesAndEnums");

const validServices = Object.values(SURVEY_SERVICES);
const servicesSchema = Joi.array().items(
  Joi.string().valid(...validServices).min(1)
);

const bookingSchema = {
  description: Joi.string().required().label("Description"),
  contactEmail: Joi.string().max(50).email().required().label("Email"),
  contactPhone: Joi.string().label("Contact Phone"),
};

const createBookingData = Joi.object({
  ...bookingSchema,
  location: Joi.string().required().label("Location"),
  surveyDate: Joi.date().required().label("Survey Date"),
  services: servicesSchema.required().label("Services"),
});

const confirmBookingDataSchema = Joi.object({
  notes: Joi.string().label("Notes"),
  surveyDate: Joi.date().required().label("Survey Date"),
  status: Joi.string().valid("Confirmed", "Cancelled").required().label("Status")
});


const updateBookingData = Joi.object({
  ...bookingSchema,
  services: servicesSchema.label("Services"),
  
});


module.exports = {
  createBookingData,
  updateBookingData,
  confirmBookingDataSchema,
};
