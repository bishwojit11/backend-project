const express = require("express");
const expressApp = express();
const userDeserialization = require("../common/middlewares/userDeserialization");

const router = express.Router();
function getUserRouter() {
  router.use("/accounts", require("../accounts/routes"));
  router.use(userDeserialization);
  router.use("/organisations", require("../organisations/routes"));
  router.use("/invitations", require("../invitations/routes"));
  router.use("/accessPolicies", require("../accessPolicies/routes"));
  router.use("/organisations", require("../organisations/routes"));
  router.use(authOrgAccess);
  router.use("/conversations", require("../conversations/routes"));
  router.use("/chats", require("../chats/routes"));
  router.use("/notifications", require("../notifications/routes"));
  router.use("/activities", require("../activities/routes"));
  router.use("/locations", require("../locations/routes"));
  router.use("/bookings", require("../booking/routes/bookings"));
  return router;
}

/**
 *
 * @param {expressApp} router
 */
module.exports = function (app) {
  app.use("/api/v1", getUserRouter());
};
