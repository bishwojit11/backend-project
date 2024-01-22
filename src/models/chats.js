const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { softDeletePlugin } = require("./plugins/softDelete");
const { ConversationModel } = require("./conversations");
const {orgDataPlugin} = require("./plugins/orgDataPlugin")
const Schema = new mongoose.Schema({
  plainTextMessage: {
    type: String,
    required: true,
  },
  attachment: {
    type: String,
  },
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ConversationModel.modelName,
    required: true,
  },
});
Schema.plugin(softDeletePlugin);
Schema.plugin(orgDataPlugin)
Schema.plugin(mongoosePaginate);
module.exports = {
  ChatModel: mongoose.model("chats", Schema),
};
