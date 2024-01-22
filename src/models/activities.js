const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");
const { softDeletePlugin } = require("./plugins/softDelete");
const { UsersModel } = require("./users");
const {LocationModel} = require("./locations");
const {OrganisationsModel} = require("./organisations")
const {orgDataPlugin} = require("./plugins/orgDataPlugin")
// Define the Schema for extraLogs
const extraLogSchema = new mongoose.Schema({
  title: String,
  description: String,
  iconImage: String,
});

// Define the main Activity Schema
const Schema = new mongoose.Schema({
  isAutomated: {
    type: Boolean,
  },
  value: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: UsersModel.modelName,
  },
  title: String,
  iconImage: String,
  extraLogs: [extraLogSchema],
  moduleType: {
    type: String,
    enum: [LocationModel.modelName, UsersModel.modelName, OrganisationsModel.modelName]
  },
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'moduleType', 
  }, 
},
{ timestamps: true }
);
Schema.plugin(softDeletePlugin);
Schema.plugin(orgDataPlugin)
Schema.plugin(mongoosePaginate);

module.exports = {
  ActivitiesModel: mongoose.model("activities", Schema),
};

