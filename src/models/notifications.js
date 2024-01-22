const mongoose = require("mongoose");
const { fileMetaInfo } = require("./templates/fileMetaInfo");
const mongoosePaginate = require("mongoose-paginate-v2");
const {
  PRIORITY_LEVELS,
  NOTIFICATION_TYPES,
  NOTIFICATION_STATUS,
  ROLES,
} = require("./typesAndEnums");
const { UsersModel } = require("./users");
const { OrganisationsModel } = require("./organisations");
const {orgDataPlugin} = require("./plugins/orgDataPlugin")
const attachmentSchema = new mongoose.Schema({
    src: String,
    metaInfo: fileMetaInfo,
  });

const Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(NOTIFICATION_STATUS),
      required: true,
      default: NOTIFICATION_STATUS.QUEUED,
    },
    attachments: [attachmentSchema],
    redirectedPath: {
      type: String,
    },
    audienceGroup: {
      type: String,
      enum: [...Object.values(ROLES), ""],
    },    
    type: {
      type: String,
      enum: Object.values(NOTIFICATION_TYPES),
      required: true,
      default: NOTIFICATION_TYPES.SYSTEM,
    },
    priorityLevel: {
      type: String,
      enum: Object.values(PRIORITY_LEVELS),
      required: true,
      default: PRIORITY_LEVELS.P1,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: UsersModel.modelName,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: UsersModel.modelName,
    },
    // organisationId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: OrganisationsModel.modelName,
    //   required: true,
    // },
  },

  { timestamps: true }
);
Schema.plugin(mongoosePaginate);
Schema.plugin(orgDataPlugin)
module.exports = {
  NotificationsModel: mongoose.model("notifications", Schema),
};