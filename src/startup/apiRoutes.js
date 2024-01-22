const express = require("express");
const expressApp = express();
const userDeserialization = require("../common/middlewares/userDeserialization");

const router = express.Router();
function getUserRouter() {
  router.use("/accounts", require("../accounts/routes"));
  router.use(userDeserialization);
  
  return router;
}

/**
 *
 * @param {expressApp} router
 */
module.exports = function (app) {
  app.use("/api/v1", getUserRouter());
};
