const { Manager } = require("./manager");
const { APIError } = require("../../common/helper/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
class Location extends Manager {
  constructor(config) {
    super(config);
  }
  async createLocation(data) {
    if (!data)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Data is required."
      );
    let newLocation = new this.Location({
      organisationId: this.accessControl?.user?.organisationId,
      name: data.name,
      geometry: data.geometry,
      direction: data.direction,
    });
    newLocation = await newLocation.save();
    return newLocation;
  }
  async getLocation(query) {
    let exist = await this.Location.findOne(query);
    if (!exist)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "Location not found with given query."
      );
    return exist;
  }
  async listLocations(query, options) {
    let pagination = await this.Location.paginate(query, options);
    return pagination;
  }
  async listLocationsByOrg(query, options) {
    let pagination = await this.Location.paginateByOrg(
      this.accessControl?.user?.organisationId,
      { ...query },
      options
    );
    return pagination;
  }
  async updateLocationInfo(id, data) {
    let location = await this.getLocation({ _id: id });
    location.name = data.name;
    location.geometry = data.geometry;
    location.direction = data.direction;
    location.status = data.status;

    return await location.save();
  }
  async softRemoveLocation(id) {
    const location = this.getLocation({ _id: id });
    if (
      location.status === "Approved" ||
      location.status === "Survey Complete"
    )
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Not permitted to delete."
      );
    if (location) {
      await this.Location.softDelete({ _id: id });
      return location;
    }
  }
  async restoreLocation(id) {
    const location = await this.getLocation({ _id: id });
    if (location) {
      await this.Location.restore({ _id: id });
      return location;
    }
  }
  async hardRemoveLocation(id) {
    const location = await this.getLocation({ _id: id });
    if (!location) {
      return null;
    }

    if (
      location.status === " Approved" ||
      location.status === "Survey Complete"
    )
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Cannot delete  approved or complete survey."
      );
    if (location) {
      await this.Location.deleteOne({ _id: id });
    }
    return location;
  }
}

module.exports = { Location };
