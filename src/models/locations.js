const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { softDeletePlugin } = require("./plugins/softDelete");
const { OrganisationsModel } = require("./organisations");
const { LOCATION_STATUS } = require("./typesAndEnums");
const { orgDataPlugin } = require("./plugins/orgDataPlugin");
const Schema = new mongoose.Schema({
  // organisationId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   required: true,
  //   ref: OrganisationsModel.modelName,
  // },
  name: {
    type: String,
    required: true,
  },
  geometry: mongoose.Schema.Types.Mixed,
  direction: mongoose.Schema.Types.Mixed,
  status: {
    type: String,
    enum: Object.values(LOCATION_STATUS),
  },

  //location status [Stale, Unbooked, Requested Survey,  Approved, Survey Complete, ]
  // not permitted to delete  approved and survey complete
});
Schema.plugin(softDeletePlugin);
Schema.plugin(orgDataPlugin);
Schema.plugin(mongoosePaginate);
module.exports = {
  LocationModel: mongoose.model("locations", Schema),
};
