const { Manager } = require("./manager");
const { APIError } = require("../../common/helper/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { mainChannel } = require("../../events/topic");
const { SERVER_EVENTS } = require("../../events/topicsName");
class BookingAdminControl extends Manager {
  constructor() {
    super();
  }
  async confirmBooking(id, data) {

    const booking = await this.Booking.findOne({ _id: id });
    if (!booking) {
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "Booking not found with the given ID."
      );
    }
    booking.surveyDate = data.surveyDate;
    booking.status = data.status;
    booking.notes = data.notes;
    await booking.save();

    const { organisationId, bookedBy, location, surveyDate } = booking;
    mainChannel.topic(SERVER_EVENTS.BOOKING_CONFIRMED).emit({
      organisationId: organisationId,
      bookedBy: bookedBy,
      location: location,
      surveyDate: surveyDate,
    });
    return booking;
  }
  async softRemoveBooking(id) {
    const booking = await this.Booking.findOne({ _id: id });
    if (!booking) {
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "Booking not found with the given ID."
      );
    }
    if (booking) {
      await this.Booking.softDelete({ _id: id });
      return booking;
    }
  }
  async restoreBooking(id) {
    const booking = await this.Booking.findOne({ _id: id });
    if (!booking) {
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "Booking not found with the given ID."
      );
    }
    if (booking) {
      await this.Booking.restore({ _id: id });
      return booking;
    }
  }
  async hardRemoveBooking(id) {
    const booking = await this.Booking.findOne({ _id: id });
    if (!booking) {
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "Booking not found with the given ID."
      );
    }
    if (booking) {
      await this.Booking.deleteOne({ _id: id });
    }
  }
}

module.exports = { BookingAdminControl};
