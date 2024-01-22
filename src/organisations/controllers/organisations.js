const { Organisation } = require("../services");
const { Filters, formatListResponse } = require("../../common/helper");
const { StatusCodes } = require("http-status-codes");

exports.createOrganisation = async (req, res, next) => {
  try {
    const organisationService = new Organisation({
      accessControl: req.accessControl,
    });
    const {
      name,
      officePhone,
      officeEmail,
      address,
      registrationNumber,
      industry,
      purposeOfUse,
      organisationalLogo,
    } = req.body;
    const organisation = await organisationService.createOrganisation({
      name,
      officePhone,
      officeEmail,
      address,
      registrationNumber,
      industry,
      purposeOfUse,
      organisationalLogo,
      createdBy: req.accessControl.user._id,
    });
    return res.status(StatusCodes.OK).json({
      message: "organisation created successfully.",
      details: { organisation },
    });
  } catch (error) {
    next(error);
  }
};

exports.getOrganisation = async (req, res, next) => {
  try {
    const organisationService = new Organisation({
      accessControl: req.accessControl,
    });
    const { id } = req.params;
    const organisation = await organisationService.getOrganisation({ _id: id });
    res.status(StatusCodes.OK).json({
      message: "organisation retrived.",
      details: { organisation },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateOrganisationInformation = async (req, res, next) => {
  try {
    const organisationService = new Organisation({
      accessControl: req.accessControl,
    });
    const { id } = req.params;
    const organisation = await organisationService.updateOrganisationInfo(
      id,
      req.body
    );
    res.status(StatusCodes.OK).json({
      message: "Organisation updated.",
      details: { organisation },
    });
  } catch (error) {
    next(error);
  }
};

exports.listOrganisations = async (req, res, next) => {
  try {
    let { page, sort, size } = req.query;
    const options = { page, limit: size, sort };
    let filter = new Filters(req, {
      searchFields: [],
    })
      .build()
      .query();
    // let query = { ...filter, createdBy: req.accessControl.user._id };
    let query = { ...filter, };
    const organisationService = new Organisation({
      accessControl: req.accessControl,
    });
    const results = await organisationService.listOrganisationsByOrg(query, options);
    return res.status(StatusCodes.OK).json({
      message: "Organisations retrived.",
      details: {
        organisations: formatListResponse(results).data,
        pagination: formatListResponse(results).pagination,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.softRemoveOrganisation = async (req, res, next) => {
  try {
    const organisationService = new Organisation({
      accessControl: req.accessControl,
    });
    const organisation = await organisationService.softRemoveOrganisation(
      req.params.id
    );
    return res.status(StatusCodes.OK).json({
      message: "Organisation moved to trash.",
      details: { organisation },
    });
  } catch (error) {
    next(error);
  }
};

exports.restoreOrganisation = async (req, res, next) => {
  try {
    const organisationService = new Organisation({
      accessControl: req.accessControl,
    });
    const organisation = await organisationService.restoreOrganisation(
      req.params.id
    );
    return res.status(StatusCodes.OK).json({
      message: "Organisation restored.",
      details: { organisation },
    });
  } catch (error) {
    next(error);
  }
};

exports.hardRemoveOrganisation = async (req, res, next) => {
  try {
    const organisationService = new Organisation({
      accessControl: req.accessControl,
    });
    const organisation = await organisationService.hardRemoveOrganisation(
      req.params.id
    );
    return res.status(StatusCodes.OK).json({
      message: "Organisation removed.",
      details: { organisation },
    });
  } catch (error) {
    next(error);
  }
};
