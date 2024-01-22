const Joi = require("joi");

const locationTemplate = {
    name: Joi.string().required().label("name"),
    geometry: Joi.any().label("geometry"),
    direction: Joi.any().label("direction"),  
  };

const createLocationData = Joi.object({
    // organisationId: Joi.string().required().label("Organisation Id"),
    ...locationTemplate,
})

const updateLocationData = Joi.object({
    ...locationTemplate,
})

module.exports = {
    createLocationData,
    updateLocationData,
}