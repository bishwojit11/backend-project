const { BookingAdminControl, Booking } = require("../services");
const { StatusCodes } = require("http-status-codes");
const { Filters, formatListResponse } = require("../../common/helper");

exports.confirmBooking = async (req, res, next) => {
  try {
    const adminBookingService = new BookingAdminControl();
    const { id } = req.params;
    const booking = await adminBookingService.confirmBooking(id, req.body);
    res.status(StatusCodes.OK).json({
      message: "Booking status updated.",
      details: { booking },
    });
  } catch (error) {
    next(error);
  }
};

exports.adminBookingList = async (req, res, next) => {
    try {
      let { page, sort, size } = req.query;
      const options = { page, limit: size, sort };
      let filter = new Filters(req, {
        searchFields: [],
      })
        .build()
        .query();
      let query = { ...filter, };
      const adminBookingService = new Booking();
      const results = await adminBookingService.listBooking(query, options);
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

exports.softRemoveBooking = async (req, res, next) => {
  try {
    const adminBookingService = new BookingAdminControl();
    const booking = await adminBookingService.softRemoveBooking(req.params.id);
    return res.status(StatusCodes.OK).json({
      message: "Booking moved to trash.",
      details: { booking },
    });
  } catch (error) {
    next(error);
  }
};

exports.restoreBooking = async (req, res, next) => {
  try {
    const adminBookingService = new BookingAdminControl();
    const booking = await adminBookingService.restoreBooking(req.params.id);
    return res.status(StatusCodes.OK).json({
      message: "Booking restored.",
      details: { booking },
    });
  } catch (error) {
    next(error);
  }
};

exports.hardRemoveBooking = async (req, res, next) => {
  try {
    const adminBookingService = new BookingAdminControl();
    const booking = await adminBookingService.hardRemoveBooking(req.params.id);
    return res.status(StatusCodes.OK).json({
      message: "Booking removed.",
      details: { booking },
    });
  } catch (error) {
    next(error);
  }
};
