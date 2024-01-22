const { APIError } = require("../../common/helper/errors/apiError");
const { Manager } = require("./manager");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const bcrypt = require("bcryptjs");
const {mainChannel} = require("../../events/topic");
const {SERVER_EVENTS} = require("../../events/topicsName")
class User extends Manager {
  constructor() {
    super();
  }
  async listUsers(query, options) {
    let pagination = await this.User.paginate(query, options);
    return pagination;
  }
  async getUser(query) {
    let exist = await this.User.findOne(query);
    if (!exist)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "User not found with given query."
      );
    return exist;
  }
  async updateProfileInformation(id, data) {
    let user = await this.getUser({ _id: id });
    user.firstName = data.firstName;
    user.lastName = data.lastName;
    return user.save();
  }
  async changePassword(id, data) {
    const { password, oldPassword } = data;
    if (oldPassword === password)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Current password can not be used."
      );
    let user = await this.getUser({ _id: id });
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Invalid credentials."
      );

    const salt = await bcrypt.genSalt(10);
    let hashPassword = await bcrypt.hash(password, salt);
    user = await this.User.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          password: hashPassword,
        },
      },
      { new: true }
    );
    return user;
  }

  async softRemoveUser(id){
    const user = this.getUser({ _id: id });
    if(user){
      await this.User.softDelete({ _id: id })
      return user;
    }
  }

  async restoreUser(id) {
    const user = await this.getUser({ _id: id });
    if (user) {
      await this.User.restore({ _id: id });
      return user;
    }
  }

  async hardRemoveUser(id) {
    const user = await this.getUser({ _id: id });
    // Condition will be implemented..
    if (user) {
      const {fullName} = user;
      return this.User.deleteOne({ _id: id });
    }
    mainChannel.topic(SERVER_EVENTS.DELETE_USER).emit({
      userId: data.id,
      name: user.fullName,
      createdBy: req.accessControl.used._id,
      
    });
  }

}
module.exports = { User };
