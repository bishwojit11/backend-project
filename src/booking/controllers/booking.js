const { Booking } = require("../services");
const { StatusCodes } = require("http-status-codes");
const { Filters, formatListResponse } = require("../../common/helper");

exports.createBooking = async (req, res, next) => {
  try {
    const bookingService = new Booking({
      accessControl: req.accessControl,
    });
    const data = {
      ...req.body,
      bookedBy: req.accessControl.user?._id,
      organisationId: req.accessControl?.user?.organisationId

    }
    const booking = await bookingService.createBooking(data);
    return res.status(StatusCodes.OK).json({
      message: "Booking created successfully.",
      details: { booking },
    });
  } catch (error) {
    next(error);
  }
};

exports.getBooking = async (req, res, next) => {
  try {
    const bookingService = new Booking({
      accessControl: req.accessControl,
    });
    const { id } = req.params;
    const booking = await bookingService.getBookingDetails({ _id: id });
    res.status(StatusCodes.OK).json({
      message: "Booking retrived.",
      details: { booking },
    });
  } catch (error) {
    next(error);
  }
};
exports.requestForCancelation = async (req, res, next) => {
  try {
    const bookingService = new Booking({
      accessControl: req.accessControl,
    });
    const { id } = req.params;
    const booking = await bookingService.requestForCancelation(id);
    res.status(StatusCodes.OK).json({
      message: "booking canel request sent.",
      details: { booking },
    });
  } catch (error) {
    next(error);
  }
};
exports.updateBookingInfo = async (req, res, next) => {
  try {
    const bookingService = new Booking({
      accessControl: req.accessControl,
    });
    const { id } = req.params;
    const booking = await bookingService.updateBookingInfo(id, req.body);
    res.status(StatusCodes.OK).json({
      message: "booking info updated.",
      details: { booking },
    });
  } catch (error) {
    next(error);
  }
};

exports.organisationBookingList = async (req, res, next) => {
  try {
    let { page, sort, size } = req.query;
    const options = { page, limit: size, sort };
    let filter = new Filters(req, {
      searchFields: [],
    })
      .build()
      .query();
    // let query = { ...filter, "bookedBy": req.accessControl.user?._id};
    let query = { ...filter, };
    const bookingService = new Booking({
      accessControl: req.accessControl,
    });
    const results = await bookingService.listBookingByOrg(query, options);
    return res.status(StatusCodes.OK).json({
      message: "Booking retrived.",
      details: {
        locations: formatListResponse(results).data,
        pagination: formatListResponse(results).pagination,
      },
    });
  } catch (error) {
    next(error);
  }
};

