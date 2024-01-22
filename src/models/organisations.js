const mongoose = require("mongoose");
const { fileMetaInfo } = require("./templates/fileMetaInfo");
const { softDeletePlugin } = require("./plugins/softDelete");
const mongoosePaginate = require("mongoose-paginate-v2");
const { UsersModel } = require("./users");

const Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    officePhone: {
      type: String,
    },
    officeEmail: {
      type: String,
    },
    // //street, aptSuitEtc, city, stateOrProvince, country, postCode, googlePlaceLocation
    address: {
      street: {
        type: String,
      },
      aptSuiteEtc: {
        type: String,
      },
      city: {
        type: String,
      },
      stateOrProvince: {
        type: String,
      },
      country: {
        type: String,
      },
      postCode: {
        type: String,
      },
      googlePlaceLocation: {
        type: String,
      },
    },
    organisationalLogo: {
      src: String,
      metaInfo: fileMetaInfo,
    },
    registrationNumber: {
      type: String,
    },
    industry: {
      type: String,
    },
    purposeOfUse: [String],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: UsersModel.modelName,
    },
  },
  { timestamps: true }
);
Schema.plugin(softDeletePlugin);
Schema.plugin(mongoosePaginate);
module.exports = {
  OrganisationsModel: mongoose.model("organisations", Schema),
};
