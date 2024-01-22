const { User } = require("../services");
const { Filters, formatListResponse } = require("../../common/helper");
const { StatusCodes } = require("http-status-codes");
exports.getUser = async (req, res, next) => {
  try {
    const userService = new User();
    const { id } = req.params;
    const user = await userService.getUser({ _id: id });
    res.status(StatusCodes.OK).json({ message: "User retrived.", details: { user } });
  } catch (error) {
    next(error);
  }
};

exports.updateProfileInformation = async (req, res, next) => {
  try {
    const userService = new User();
    const { id } = req.params;
    const user = await userService.updateProfileInformation(id, req.body);
    res.status(StatusCodes.OK).json({ message: "User updated.", details: { user } });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const userService = new User();
    const { id } = req.params;
    const user = await userService.changePassword(id, req.body);
    res.status(StatusCodes.OK).json({
      message: "Password changed.",
      details: { user },
    });
  } catch (error) {
    next(error);
  }
};

exports.listUsers = async (req, res, next) => {
  try {
    let { page, sort, size } = req.query;
    const options = { page, limit: size, sort };
    let filter = new Filters(req, {
      searchFields: [],
    })
      .build()
      .query();
    let query = { ...filter,  };
    const userService = new User();
    const results = await userService.listUsers(query, options);
    return res.status(StatusCodes.OK).json({
      message: "Users retrived.",
      details: {
        users: formatListResponse(results).data,
        pagination: formatListResponse(results).pagination,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.softRemoveUser = async (req, res, next) => {
  try {
    const userService = new User();
    const user = await userService.softRemoveUser(req.params.id);
    return res.status(StatusCodes.OK).json({
      message: "User moved to trash.",
      details: { user },
    });
  } catch (error) {
    next(error);
  }
};

exports.restoreUser = async (req, res, next) => {
  try {
    const userService = new User();
    const user = await userService.restoreUser(req.params.id);
    return res.status(StatusCodes.OK).json({
      message: "User restored.",
      details: { user },
    });
  } catch (error) {
    next(error);
  }
};

exports.hardRemoveUser = async (req, res, next) => {
  try {
    const userService = new User();
    const user = await userService.hardRemoveUser(req.params.id);
    return res.status(StatusCodes.OK).json({
      message: "User removed.",
      details: { user },
    });
  } catch (error) {
    next(error);
  }
};
