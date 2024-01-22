const { Registration } = require("../services/registration");
const { StatusCodes } = require("http-status-codes");

exports.startRegistration = async (req, res, next) => {
  try {
    const registrationService = new Registration();
    const registration = await registrationService.startRegistration(req.body);
    return res.status(StatusCodes.OK).json({
      message: "Registration Process Started.",
      details: { ...registration },
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyRegistration = async (req, res, next) => {
  try {
    const token = req.header("x-register-token");
    const registraationService = new Registration();
    const user = await registraationService.verifyRegistration(token);
    res.status(StatusCodes.OK).json({
      message: "User account validation complete.",
      details: { user },
    });
  } catch (error) {
    next(error);
  }
};
exports.resendVerification = async (req, res, next) => {
  try {
    const registraationService = new Registration();
    const user = await registraationService.resendVerification(req.body.userId);
    res.status(StatusCodes.OK).json({
      message: "User account verification email sent.",
      details: { user },
    });
  } catch (error) {
    next(error);
  }
};
