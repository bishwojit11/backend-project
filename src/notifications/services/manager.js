const {
  NotificationsModel,
  OrganisationsModel,
  UsersModel,
} = require("../../models");

class Manager {
  constructor(config) {
    this.Notification = NotificationsModel;
    this.User = UsersModel;
    this.Organisation = OrganisationsModel;
    this.accessControl = config.accessControl
  }
}
module.exports = { Manager };
