const { defineAPIAbilitiesFor } = require("../../.config/accessControl/abilities");
const { APIError } = require("../helper/errors/apiError");
const { ReasonPhrases, StatusCodes } = require("http-status-codes");
const enforceRbac = (rules) => async (req, res, next) => {
  try {
    const user = req.accessControl.user; // assuming user information is stored in req.user
    if (!user)
      throw new APIError(
        ReasonPhrases.FORBIDDEN,
        StatusCodes.FORBIDDEN,
        "User needs to be logged in to pass access control checks."
      );
    const ability = defineAPIAbilitiesFor(user);
    const permitted = ability.can(rules.action, rules.service);
    if (!permitted)
      throw new APIError(
        ReasonPhrases.FORBIDDEN,
        StatusCodes.FORBIDDEN,
        "User does not have permission to access this service. Rbac rules validation failed for user."
      );
    return next();
  } catch (err) {
    return next(err);
  }
};
module.exports = { enforceRbac };
