const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { softDeletePlugin } = require("./plugins/softDelete");
const { fileMetaInfo } = require("./templates/fileMetaInfo");
const { VERIFICATION_STATUS } = require("./typesAndEnums");
const {orgDataPlugin} = require("./plugins/orgDataPlugin")
const Schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    // never mute by business logic
    fullName: {
      type: String,
    },
    industry: {
      type: String,
    },
    jobTitle: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      src: String,
      metaInfo: fileMetaInfo,
    },
    purposeOfUse: {
      type: [String],
    },
    isActive: {
      type: Boolean,
      default: false,
    },

    emailVerification: {
      token: {
        type: String,
        default: "",
      },
      status: {
        type: String,
        enum: Object.values(VERIFICATION_STATUS),
        default: VERIFICATION_STATUS.PENDING,
      },
      verificationDate: {
        type: Date,
        default: null,
      },
    },
    refreshTokens: [String],
    recoveryToken: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Middleware to set fullName before saving
Schema.pre("validate", function (next) {
  this.fullName = `${this.firstName} ${this.lastName}`;
  next();
});

Schema.plugin(mongoosePaginate);
Schema.plugin(softDeletePlugin);
module.exports = {
  UsersModel: mongoose.model("users", Schema),
};
