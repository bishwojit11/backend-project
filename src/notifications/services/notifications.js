const { Manager } = require("./manager");
const { APIError } = require("../../common/helper/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const emailHandler = require("../../email/sendMail");
class Notification extends Manager {
  constructor(config) {
    super(config);
  }
  async createNotification(data, config) {
    if (!data)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Data is required."
      );
  
    let newNotification = new this.Notification({
      organisationId: this.accessControl?.user?.organisationId,
      title: data.title,
      message: data.message,
      status: data.status,
      attachments: data.attachments,
      redirectedPath: data.redirectedPath,
      audienceGroup: data.audienceGroup,
      type: data.type,
      priorityLevel: data.priorityLevel,
      createdBy: data.createdBy,
      user: data.user,
      organisationId: data.organisationId,
    });
    newNotification = await newNotification.save()
  
    if (config && config.email === true) {
      let foundUser = await this.User.findOne({ _id: data.user });
      if (foundUser) {
        const { email, firstName } = foundUser;
        const { redirectedPath, message, title } = data;
        let detailsLink = `${process.env.CLIENT_URL}/${redirectedPath}`;
        await emailHandler.sendMail("send-notification", email, {
          name: firstName,
          detailsLink,
          message,
          title,
        });
      } else {
        console.log("User not found.");
      }
    }
  
    return newNotification;
  }
  

  async updateNotificationStatus(data) {
    //user id array will be come from body
    // query [notification_id in array]
    // status
    // update

    if (!data)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Data is required."
      );

    let { notificationIds, status } = data;
    const query = { _id: { $in: notificationIds } };

    // Update the status for the selected notifications
    const newNotificationStatus = await this.Notification.updateMany(query, {
      status: status,
    });

    return newNotificationStatus;
  }
  async getNotification(query) {
    let exist = await this.Notification.findOne(query);
    if (!exist)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "Notification not found with given query."
      );
    return exist;
  }
  async updateNotificationInfo(id, data) {
    let notification = await this.getNotification({ _id: id });
    notification.title = data.title;
    notification.message = data.message;
    return notification.save();
  }
  async listNotifications(query, options) {
    let pagination = await this.Notification.paginate(query, options);
    return pagination;
  }
  async listNotificationsByOrg(query, options) {
    let pagination = await this.Notification.paginateByOrg(
      this.accessControl?.user?.organisationId,
      { ...query, },
      options
    );
    return pagination;
  }
  async hardRemoveNotification(id) {
    const notification = await this.getNotification({ _id: id });
    if (notification) {
      await this.Notification.deleteOne({ _id: id });
    }
    return notification;
  }
}
module.exports = { Notification };
