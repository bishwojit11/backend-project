const mongoose = require("mongoose");
const { OrganisationsModel } = require("./organisations");
const mongoosePaginate = require("mongoose-paginate-v2");
const { softDeletePlugin } = require("./plugins/softDelete");
const { UsersModel } = require("./users");
const { GNS_SURVEY_SERVICES } = require("./typesAndEnums");
const {orgDataPlugin} = require("./plugins/orgDataPlugin")
const Schema = new mongoose.Schema(
  {
  //   organisationId: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: OrganisationsModel.modelName,
  //     require: true,
  //   },
    surveyDate: {
      type: Date,
      required: true,
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    services: [
      {
        type: String,
        enum: Object.values(GNS_SURVEY_SERVICES),
        required: true,
      },
    ],
    status: {
      type: String,
      enum: ["Requested", "Cancelled", "Confirmed", "Requested to cancel"],
      default: "Requested",
    },
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: UsersModel.modelName,
    },
    description: {
      type: String,
      required: true,
    },
    contactEmail: {
      type: String,
    },
    contactPhone: {
      type: String,
    },
    notes: {
      type: String,
      default: "",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);
Schema.plugin(softDeletePlugin);
Schema.plugin(orgDataPlugin)
Schema.plugin(mongoosePaginate);
module.exports = {
  BookingModel: mongoose.model("bookings", Schema),
};
