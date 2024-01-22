const { Filters, formatListResponse } = require("../../common/helper");
const { Conversation } = require("../services");
const { StatusCodes } = require("http-status-codes");
exports.createConversation = async (req, res, next) => {
  try {
    const conversationService = new Conversation({
      accessControl: req.accessControl,
    });
    const {targetUserId} = req.body
    const chathead = await conversationService.createConversation({
      targetUserId,
      firstUserId: req.accessControl.user?._id,
    });
    return res.status(StatusCodes.CREATED).json({
      message: "Chathead created.",
      details: { chathead },
    });
  } catch (error) {
    next(error);
  }
};
exports.listConversations = async (req, res, next) => {
  try {
    let { page, sort, size } = req.query;
    const options = { page, limit: size, sort };
    let filter = new Filters(req, {
      searchFields: [],
    })
      .build()
      .query();
    let query = { ...filter, "usersPair.0": req.accessControl.user?._id };
    const conversationService = new Conversation({
      accessControl: req.accessControl,
    });
    const results = await conversationService.listConversation(query, options);
    return res.status(StatusCodes.OK).json({
      message: "Conversation retrived.",
      details: {
        Conversations: formatListResponse(results).data,
        pagination: formatListResponse(results).pagination,
      },
    });
  } catch (error) {
    next(error);
  }
};
exports.getConversation = async (req, res, next) => {
  try {
    const conversationService = new Conversation({
      accessControl: req.accessControl,
    });
    const conversation = await conversationService.getConversation({
      _id: req.params.id,
    });
    return res.status(StatusCodes.OK).json({
      message: "Conversation retrived.",
      details: { conversation },
    });
  } catch (error) {
    next(error);
  }
};
// exports.editChathead = async (req, res, next) => {
//   try {
//     const chatheadService = new ChatheadsCRUD();
//     const chathead = await chatheadService.editChathead(
//       req.params.id,
//       req.body
//     );
//     return res.status(StatusCodes.OK).json({
//       message: "Chathead updated.",
//       details: { chathead },
//     });
//   } catch (error) {
//     next(error);
//   }
// };
exports.softRemoveConversation = async (req, res, next) => {
  try {
    const conversationService = new Conversation({
      accessControl: req.accessControl,
    });
    const conversation = await conversationService.softRemoveConversation(req.params.id);
    return res.status(StatusCodes.OK).json({
      message: "Conversation moved to trash.",
      details: { conversation },
    });
  } catch (error) {
    next(error);
  }
};
exports.restoreConversation = async (req, res, next) => {
  try {
    const conversationService = new Conversation({
      accessControl: req.accessControl,
    });
    const conversation = await conversationService.restoreConversation(req.params.id);
    return res.status(StatusCodes.OK).json({
      message: "Conversation restored.",
      details: { conversation },
    });
  } catch (error) {
    next(error);
  }
};
exports.hardRemoveConversation = async (req, res, next) => {
  try {
    const conversationService = new Conversation({
      accessControl: req.accessControl,
    });
    const conversation = await conversationService.hardRemoveConversation(req.params.id);
    return res.status(StatusCodes.OK).json({
      message: "Conversation removed.",
      details: { conversation },
    });
  } catch (error) {
    next(error);
  }
};
