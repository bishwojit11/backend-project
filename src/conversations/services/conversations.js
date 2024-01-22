const { APIError } = require("../../common/helper/errors/apiError");
const { Manager } = require("./manager");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
class Conversation extends Manager {
  constructor(config) {
    super(config);
  }
  async createConversation(data) {
    // Check if a chathead already exists for the given user pair
    const existingConversation = await this.Conversation.findOne({
      // $or: [
      //   {
      //     'usersPair.firstUserId': data.firstUserId,
      //     'usersPair.targetUserId': data.targetUserId,
      //   },
      //   {
      //     'usersPair.firstUserId': data.targetUserId,
      //     'usersPair.targetUserId': data.firstUserId,
      //   },
      // ],

      usersPair: { $all:  [
        data.firstUserId, data.targetUserId,
    ] },
    });

    if (existingConversation) {
      // conversation already exists, return it
      return existingConversation;
    }

    const conversation = new this.Conversation({
      organisationId: this.accessControl?.user?.organisationId,
      usersPair: [
          data.firstUserId, data.targetUserId,
      ],
    });
    return conversation.save();
  }
  async getConversation(query) {
    const exist = await this.Conversation.findOne(query);
    if (!exist)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "No conversation found with the given query."
      );
    return exist;
  }
  async listConversation(query, options) {
    let pagination = await this.Conversation.paginate(query, options);
    return pagination;
  }
  async listConversationByOrg(query, options) {
    let pagination = await this.Conversation.paginateByOrg(
      this.accessControl?.user?.organisationId,
      { ...query, },
      options
    );
    return pagination;
  }

  async softRemoveConversation(id) {
    const conversation = await this.getConversation({ _id: id });
    if (conversation) {
      await this.Conversation.softDelete({ _id: id });
      return conversation;
    }
  }
  async hardRemoveConversation(id) {
    const conversation = await this.getConversation({ _id: id });
    if (conversation) {
      await this.Chat.deleteMany({ conversation: id });
      await this.Conversation.deleteOne({ _id: id });
      return conversation;
    }
  }
  async restoreConversation(id) {
    const conversation = await this.getConversation({ _id: id });
    if (conversation) {
      await this.Conversation.restore({ _id: id });
      return conversation;
    }
  }
}
module.exports = { Conversation };
