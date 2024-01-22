const { Manager } = require("./manager");
const { APIError } = require("../../common/helper/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { AccessPolicy } = require("../../accessPolicies/services");
const { ROLES } = require("../../models/typesAndEnums");
class Organisation extends Manager {
  constructor(config) {
    super(config);
  }
  async listOrganisations(query, options) {
    let pagination = await this.Organisation.paginate(query, options);
    return pagination;
  }
  async listOrganisationsByOrg(query, options) {
    let pagination = await this.Organisation.paginateByOrg(
      this.accessControl?.user?.organisationId,
      { ...query },
      options
    );
    return pagination;
  }
  async createOrganisation(data) {
    if (!data)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Data is required."
      );

    let newOrganisation = new this.Organisation({
      name: data.name,
      officePhone: data.officePhone,
      officeEmail: data.officeEmail,
      address: data.address,
      registrationNumber: data.registrationNumber,
      industry: data.industry,
      purposeOfUse: data.purposeOfUse,
      organisationalLogo: {
        src: process.env.ASSETS_BASE_URL + "/" + data.organisationalLogo.Key,
        metaInfo: data.organisationalLogo,
      },
      createdBy: this.accessControl.user._id,
    });
    newOrganisation = await newOrganisation.save();
    const AccessPolicyService = new AccessPolicy({
      accessControl: this.accessControl,
    });
    await AccessPolicyService.createAccessPolicy({
      invitedUserId: this.accessControl.user._id,
      organisationId: newOrganisation?._id,
      role: ROLES.ADMINISTRATOR,
    });
    return newOrganisation;
  }
  async getOrganisation(query) {
    let exist = await this.Organisation.findOne(query);
    if (!exist)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "Organisation not found with given query."
      );
    return exist;
  }
  async updateOrganisationInfo(id, data) {
    let organisation = await this.getOrganisation({ _id: id });
    organisation.name = data.name;
    organisation.office_mail = data.office_mail;
    organisation.address = data.address;

    return await organisation.save();
  }
  async softRemoveOrganisation(id) {
    const organisation = await this.getOrganisation({ _id: id });
    if (organisation) {
      await this.Organisation.softDelete({ _id: id });
      return organisation;
    }
  }
  async restoreOrganisation(id) {
    const organisation = await this.getOrganisation({ _id: id });
    if (organisation) {
      await this.Organisation.restore({ _id: id });
      return organisation;
    }
  }
  async hardRemoveOrganisation(id) {
    const organisation = await this.getOrganisation({ _id: id });
    if (organisation) {
      await this.Organisation.deleteOne({ _id: id });
      // Also, remove associated access policies if needed
      await this.AccessPolicy.deleteMany({ organisationId: id });
      //User will not be deleted , because there will be a possibility that we will be a part of other organisation
    }
    return organisation;
  }
}

module.exports = { Organisation };
