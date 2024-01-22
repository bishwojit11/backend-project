const rateLimit = require("express-rate-limit");
const { APIError } = require("../helper/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");

//Global rate Limit middleware
const globalLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100, // Max number of GET requests per IP during the window
  message: "Too many GET requests from this IP, please try again later.",
  handler: (req, res, next) => {
    throw new APIError(
      ReasonPhrases.TOO_MANY_REQUESTS,
      StatusCodes.TOO_MANY_REQUESTS,
      'Rate limit exceeded. Please try again later.',
      true
    )}
});

const postLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // Max number of POST requests per IP during the window
  message: "Too many POST requests from this IP, please try again later.",
  handler: (req, res, next) => {
    throw new APIError(
      'Rate Limit Exceeded',
      StatusCodes.TOO_MANY_REQUESTS,
      'Rate limit exceeded. Please try again later.',
      true
    )}
});


module.exports = { globalLimiter, postLimiter };