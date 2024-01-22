const { APIError } = require("../../common/helper/errors/apiError");
const { Manager } = require("./manager");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
class ChatsCRUD extends Manager {
  constructor(config) {
    super(config);
  }
  async createChat(data) {
    const chat = new this.Chat({
      organisationId: this.accessControl?.user?.organisationId,
      conversationId: data.conversationId,
      plainTextMessage: data.plainTextMessage,
      attachment: data.attachment,
    });
    return chat.save();
  }
  async getChat(query) {
    const chat = await this.Chat.findOne(query);
    if (!chat)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "No chat found with the given query."
      );
    return chat;
  }
  async listChats(query, options) {
    let pagination = await this.Chat.paginate(query, options);
    return pagination;
  }
  async listChatsByOrg(query, options) {
    let pagination = await this.Chat.paginateByOrg(
      this.accessControl?.user?.organisationId,
      { ...query, },
      options
    );
    return pagination;
  }
  async editChat(id, data) {
    const chat = await this.getChat({ _id: id });
    return chat.save();
  }
  async softRemoveChat(id) {
    const chat = await this.getChat({ _id: id });
    if (chat) {
      await this.Chat.softDelete({ _id: id });
      return chat;
    }
  }
  async hardRemoveChat(id) {
    const chat = await this.getChat({ _id: id });
    if (chat) {
      await this.Chat.deleteOne({ _id: id });
      return chat;
    }
  }
  async restoreChat(id) {
    const chat = await this.getChat({ _id: id });
    if (chat) {
      await this.Chat.restore({ _id: id });
      return chat;
    }
  }
}
module.exports = { ChatsCRUD };
