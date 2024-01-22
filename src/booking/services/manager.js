const { BookingModel , OrganisationsModel, UsersModel} = require("../../models/");

class Manager {
  constructor(config) {
    this.accessControl = config.accessControl
    this.Organisation = OrganisationsModel;
    this.Booking = BookingModel;
    this.User = UsersModel;
  }
}
module.exports = { Manager };
