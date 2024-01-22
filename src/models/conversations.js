const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { softDeletePlugin } = require("./plugins/softDelete");
const { UsersModel } = require("./users");
const {orgDataPlugin} = require("./plugins/orgDataPlugin")
const Schema = new mongoose.Schema(
  {
    usersPair: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: UsersModel.modelName,

        // firstUser: {
        //   type: mongoose.Schema.Types.ObjectId,
        //   ref: UsersModel.modelName,
        // },
        // targetUserId: {
        //   type: mongoose.Schema.Types.ObjectId,
        //   ref: UsersModel.modelName,
        // },
      },
    ],
  },
  { timestamps: true }
);


Schema.path('usersPair').validate(function (value) {
  return value.length <= 2;
}, 'A conversation can only have up to 2 users.');


Schema.plugin(softDeletePlugin);
Schema.plugin(orgDataPlugin)
Schema.plugin(mongoosePaginate);
module.exports = {
  ConversationModel: mongoose.model("conversations", Schema),
};
