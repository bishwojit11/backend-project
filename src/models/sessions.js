const mongoose = require("mongoose");
const { UsersModel } = require("./users");

const Schema = new mongoose.Schema(
  {
    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: UsersModel.modelName,
      required: true,
    },
    userAgent: {
      type: String,
      default: "",
    },
    valid: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = { SessionsModel: mongoose.model("sessions", Schema) };
