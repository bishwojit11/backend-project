const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { softDeletePlugin } = require("./plugins/softDelete");
const { orgAndRoleReference } = require("./templates");
const { UsersModel } = require("./users");
const {orgDataPlugin} = require("./plugins/orgDataPlugin")
const Schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    ...orgAndRoleReference,
    token: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: UsersModel.modelName,
    },
  },
  { timestamps: true }
);
Schema.plugin(softDeletePlugin);
Schema.plugin(orgDataPlugin)
Schema.plugin(mongoosePaginate);
module.exports = {
  InvitationsModel: mongoose.model("invitations", Schema),
};
