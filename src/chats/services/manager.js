const {
    ChatModel,
  } = require("../../models");
  
  class Manager {
    constructor(config) {
      this.accessControl = config.accessControl
      this.Chat = ChatModel;
    }
  }
  module.exports = { Manager };
  