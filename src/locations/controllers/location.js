const { Location } = require("../services");
const { StatusCodes } = require("http-status-codes");
const { Filters, formatListResponse } = require("../../common/helper");

exports.createLocation = async (req, res, next) => {
  try {
    const locationService = new Location({
      accessControl: req.accessControl,
    });
    const location = await locationService.createLocation({
      ...req.body,
      organisationId: req.accessControl?.user?.organisationId,
    });
    return res.status(StatusCodes.OK).json({
      message: "Location created successfully.",
      details: location,
    });
  } catch (error) {
    next(error);
  }
};

exports.getLocation = async (req, res, next) => {
  try {
    const locationService = new Location({
      accessControl: req.accessControl,
    });
    const { id } = req.params;
    const location = await locationService.getLocation({ _id: id });
    res.status(StatusCodes.OK).json({
      message: "Location retrived.",
      details: { location },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateLocationInfo = async (req, res, next) => {
  try {
    const locationService = new Location({
      accessControl: req.accessControl,
    });
    const { id } = req.params;
    const location = await locationService.updateLocationInfo(id, req.body);
    res.status(StatusCodes.OK).json({
      message: "location info updated.",
      details: { location },
    });
  } catch (error) {
    next(error);
  }
};

exports.listLocation = async (req, res, next) => {
  try {
    let { page, sort, size } = req.query;
    const options = { page, limit: size, sort };
    let filter = new Filters(req, {
      searchFields: [],
    })
      .build()
      .query();
    let query = { ...filter };
    const locationService = new Location({
      accessControl: req.accessControl,
    });
    const results = await locationService.listLocationsByOrg(query, options);
    return res.status(StatusCodes.OK).json({
      message: "Location retrived.",
      details: {
        locations: formatListResponse(results).data,
        pagination: formatListResponse(results).pagination,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.softRemoveLocation = async (req, res, next) => {
  try {
    const locationService = new Location({
      accessControl: req.accessControl,
    });
    const location = await locationService.softRemoveLocation(req.params.id);
    return res.status(StatusCodes.OK).json({
      message: "Location moved to trash.",
      details: { location },
    });
  } catch (error) {
    next(error);
  }
};

exports.restoreLocation = async (req, res, next) => {
  try {
    const locationService = new Location({
      accessControl: req.accessControl,
    });
    const location = await locationService.restoreLocation(req.params.id);
    return res.status(StatusCodes.OK).json({
      message: "Location restored.",
      details: { location },
    });
  } catch (error) {
    next(error);
  }
};

exports.hardRemoveLocation = async (req, res, next) => {
  try {
    const locationService = new Location({
      accessControl: req.accessControl,
    });
    const location = await locationService.hardRemoveLocation(req.params.id);
    return res.status(StatusCodes.OK).json({
      message: "Location removed.",
      details: { location },
    });
  } catch (error) {
    next(error);
  }
};
