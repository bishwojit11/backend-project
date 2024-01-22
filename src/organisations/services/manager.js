const { AccessPolicyModel , OrganisationsModel} = require("../../models/");

class Manager {
  constructor(config) {
    this.accessControl = config.accessControl
    this.Organisation = OrganisationsModel;
    this.AccessPolicy = AccessPolicyModel;
  }
}
module.exports = { Manager };
