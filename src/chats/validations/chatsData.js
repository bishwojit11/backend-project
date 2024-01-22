const Joi = require('joi');

const chatSchema = {
  plainTextMessage: Joi.string().required().label("plainTextMessage"),
  attachment: Joi.string().label("attachment"),
};

const createChatData = Joi.object({
  ...chatSchema,
  conversationId: Joi.string().required().label("conversationId"),
})
const editChatData = Joi.object({
  ...chatSchema,
})

module.exports = {
  createChatData,
  editChatData,
};
