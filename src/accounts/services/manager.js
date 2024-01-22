const { SessionsModel, UsersModel, AccessPolicyModel, OrganisationsModel } = require("../../models");

class Manager {
  constructor() {
    this.User = UsersModel;
    this.AccessPolicy = AccessPolicyModel;
    this.Session = SessionsModel;
    this.Organisation = OrganisationsModel;
  }
}
module.exports = { Manager };
