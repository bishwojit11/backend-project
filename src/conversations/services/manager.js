const {
    ConversationModel,
    UsersModel,
    ChatModel
  } = require("../../models");
  
  class Manager {
    constructor(config) {
      this.Conversation = ConversationModel;
      this.User = UsersModel;
      this.Chat = ChatModel;
      this.accessControl = config.accessControl;
    }
  }
  module.exports = { Manager };
  