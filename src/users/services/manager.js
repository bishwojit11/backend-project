const { UsersModel } = require("../../models");
class Manager {
  constructor() {
    this.User = UsersModel;
  }
}
module.exports = { Manager };
