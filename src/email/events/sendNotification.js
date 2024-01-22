module.exports = async (config) => {
    let template = await require("../../common/helper/template").createTemplate({
      view: "emailTemplates/notification/createNotification.ejs",
      templateOptions: config.payload,
    });
    return {
      subject: config.subject || "New Notification",
      template,
    };
  };
  