const Joi = require("joi");
const {
  PRIORITY_LEVELS,
  NOTIFICATION_TYPES,
  NOTIFICATION_STATUS,
  ROLES,
} = require("./../../models/typesAndEnums");

const notificationStructure = {
  title: Joi.string().max(100).required().label("title"),
  message: Joi.string().max(6000).required().label("message"),
};

const createNotificationData = Joi.object({
  ...notificationStructure,
  status: Joi.string().valid(...Object.values(NOTIFICATION_STATUS)).default("Queued").label("status"),
  redirectedPath: Joi.string().empty('').label("redirectedPath"),
  audienceGroup: Joi.string().valid(...Object.values(ROLES), "").empty(null).label("Audience Group"),
  type: Joi.string().valid(...Object.values(NOTIFICATION_TYPES)).default("System").label("type"),
  priorityLevel: Joi.string().valid(...Object.values(PRIORITY_LEVELS)).required().label("priorityLevel"),
  user: Joi.string().label("user"),
});

const updateNotificationData = Joi.object({
  ...notificationStructure,
});

const updateNotificationStatus = Joi.object({
  notificationIds: Joi.array()
    .items(Joi.string().required())
    .min(1)
    .required()
    .label("notificationIds"),
  status: Joi.string().valid(...Object.values(NOTIFICATION_STATUS)).default("Queued").label("status"),
})

module.exports = {
  createNotificationData,
  updateNotificationData,
  updateNotificationStatus,
};
