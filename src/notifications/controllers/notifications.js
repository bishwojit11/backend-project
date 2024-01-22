const { Notification } = require("../services");
const { StatusCodes } = require("http-status-codes");
const { Filters, formatListResponse } = require("../../common/helper");

exports.createNotification = async (req, res, next) => {
  try {
    const notificationService = new Notification({
      accessControl: req.accessControl,
    });
    const {title,
      message,
      attachments,
      redirectedPath,
      audienceGroup,
      type,
      priorityLevel,
      user,
      organisationId,} = req.body
      const config = {
        email: true, // Set your desired config value here
      };
  
    const notification = await notificationService.createNotification({
      title,
      message,
      attachments,
      redirectedPath,
      audienceGroup,
      type,
      priorityLevel,
      createdBy: req.accessControl.user._id,
      user,
      organisationId: req.accessControl?.user?.organisationId,
  });
    return res.status(StatusCodes.OK).json({
      message: "Notification created successfully.",
      details: { notification },
    });
  } catch (error) {
    next(error);
  }
};

exports.getNotification = async (req, res, next) => {
  try {
    const notificationService = new Notification({
      accessControl: req.accessControl,
    });
    const { id } = req.params;
    const notification = await notificationService.getNotification({ _id: id });
    res.status(StatusCodes.OK).json({
      message: "notification retrived.",
      details: { notification },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateNotificationStatus = async( req, res, next) => {
  try{
    const notificationService = new Notification({
      accessControl: req.accessControl,
    });
    const {notificationIds, status} = req.body;
    const notification = await notificationService.updateNotificationStatus({
      notificationIds,
      status,
  });
    return res.status(StatusCodes.OK).json({
      message: "Notification updated successfully.",
      details: { notification },
    });
  }catch(error){
    next(error);
  }
}

exports.updateNotificationInfo = async (req, res, next) => {
  try {
    const notificationService = new Notification({
      accessControl: req.accessControl,
    });
    const { id } = req.params;
    const notification = await notificationService.updateNotificationInfo(
      id,
      req.body
    );
    res.status(StatusCodes.OK).json({
      message: "notification info updated.",
      details: { notification },
    });
  } catch (error) {
    next(error);
  }
};

exports.listNotification = async (req, res, next) => {
  try {
    let { page, sort, size } = req.query;
    const options = { page, limit: size, sort };
    let filter = new Filters(req, {
      searchFields: [],
    })
      .build()
      .query();
    // let query = { ...filter, "user": req.accessControl.user?._id};
    let query = { ...filter, };
    const notificationService = new Notification({
      accessControl: req.accessControl,
    });
    const results = await notificationService.listNotificationsByOrg(
      query,
      options
    );
    return res.status(StatusCodes.OK).json({
      message: "Notification retrived.",
      details: {
        notifications: formatListResponse(results).data,
        pagination: formatListResponse(results).pagination,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.hardRemoveNotification = async (req, res, next) => {
  try {
    const notificationService = new Notification({
      accessControl: req.accessControl,
    });
    const notification = await notificationService.hardRemoveNotification(req.params.id);
    return res.status(StatusCodes.OK).json({
      message: "Notification removed.",
      details: { notification },
    });
  } catch (error) {
    next(error);
  }
};
