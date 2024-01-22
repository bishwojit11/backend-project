const { Manager } = require("./manager");
const { APIError } = require("../../common/helper/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { mainChannel } = require("../../events/topic");
const { SERVER_EVENTS } = require("../../events/topicsName");
class Booking extends Manager {
  constructor(config) {
    super(config);
  }
  async createBooking(data) {
    if (!data)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Data is required."
      );
    let {
      surveyDate,
      location,
      description,
      contactEmail,
      contactPhone,
      services,
    } = data;
    let existingOrganisation = await this.Organisation.findOne({
      _id: this.accessControl?.user?.organisationId,
    });

    if (!existingOrganisation)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Organisation doesn't exist. Please provide a valid Organisation."
      );

    // Check if there are already two bookings for the same date and organisation
    // const existingBookingsCount = await this.Booking.find({
    //   surveyDate: data.surveyDate,
    //   status: { $ne: "Cancelled" }, // Exclude Cancled bookings
    // });
    // if (existingBookingsCount.length >= 2) {
    //   throw new APIError(
    //     ReasonPhrases.BAD_REQUEST,
    //     StatusCodes.BAD_REQUEST,
    //     "Another survey already exists for the same date."
    //   );
    // }

    let newBooking = new this.Booking({
      organisationId: this.accessControl?.user?.organisationId,
      surveyDate,
      location,
      bookedBy: this.accessControl?.user?._id,
      description,
      contactEmail,
      contactPhone,
      services,
    });
    newBooking = await newBooking.save();
    const foundUser = await this.User.findOne({ _id: this.accessControl?.user?._id });
    const foundOrganisation = await this.Organisation.findOne({
      _id: this.accessControl?.user?.organisationId,
    });
    const { firstName } = foundUser;
    const { name } = foundOrganisation;

    mainChannel.topic(SERVER_EVENTS.CREATE_BOOKING).emit({
      userName: firstName,
      organisationName: name,
      organisationId: this.accessControl?.user?.organisationId,
      bookedBy: this.accessControl?.user?._id,
      surveyDate: data.surveyDate,
      location: data.location,
    });
    return newBooking;
  }
  async getBookingDetails(query) {
    let exist = await this.Booking.findOne(query);
    if (!exist)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "Booking Details not found with given query."
      );
    return exist;
  }
  async requestForCancelation(id){
    let booking = await this.getBookingDetails({ _id: id });
    if(booking.status === "Cancelled")
    throw new APIError(
      ReasonPhrases.BAD_REQUEST,
      StatusCodes.BAD_REQUEST,
      "Booking already Cancelled."
    );
    booking.status = "Requested to cancel";
    return await booking.save();
  }
  async updateBookingInfo(id, data) {
    let booking = await this.getBookingDetails({ _id: id });
    booking.description = data.description;
    booking.contactEmail = data.contactEmail;
    booking.contactPhone = data.contactPhone;
    booking.services = data.services;

    return await booking.save();
  }
  async listBooking(query, options) {
    let pagination = await this.Booking.paginate(query, options);
    return pagination;
  }
  async listBookingByOrg(query, options) {
    let pagination = await this.Booking.paginateByOrg(
      this.accessControl?.user?.organisationId,
      { ...query, },
      options
    );
    return pagination;
  }

}

module.exports = { Booking };
