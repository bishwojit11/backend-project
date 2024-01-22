/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: API for managing chats
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     chatSchema:
 *       type: object
 *       properties:
 *         plainTextMessage:
 *           type: string
 *           required: true
 *           label: plainTextMessage
 *         attachment:
 *           type: string
 *           label: attachment
 * 
 *     createChatData:
 *       type: object
 *       properties:
 *         conversationId:
 *           type: string
 *           required: true
 *           label: conversationId
 *         plainTextMessage:
 *           type: string
 *           required: true
 *           label: plainTextMessage
 *         attachment:
 *           type: string
 *           label: attachment
 *       required:
 *         - conversationId
 *         - plainTextMessage
 * 
 *     editChatData:
 *       type: object
 *       properties:
 *         plainTextMessage:
 *           type: string
 *           required: true
 *           label: plainTextMessage
 *         attachment:
 *           type: string
 *           label: attachment
 */

const router = require("express").Router();
const {
  createChat,
  listChats,
  getChat,
  softRemoveChat,
  hardRemoveChat,
  restoreChat,
} = require("../controllers");
const { validate } = require("../../common/middlewares/validator");
const validations = require("../validations");
const {GNS_SERVICES,ACTIONS} = require("../../models/typesAndEnums")
const { enforceRbac } = require("../../common/middlewares/enforceRbac");
const validateBody = validate("body");

/**
 * @swagger
 * /chats:
 *   post:
 *     summary: Create a new chat
 *     tags: [Chat]
 *     security:
 *       - apiKey: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/createChatData'
 *     responses:
 *      '200':
 *         description: Chat created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Chat created."
 *               details:
 *                 chat:
 *                   _id: "6568c2bf67310c03120069cb"
 *                   deleteMarker:
 *                     status: false
 *                     deletedAt: null
 *                     dateScheduled: null
 *                   conversationId: "655b4bbd4e5343001f07174d"
 *                   plainTextMessage: "Hello, how are you?"
 *                   attachment: "https://example.com/image.jpg"
 *                   __v: 0
 */
router.post("/", [[
  enforceRbac({
    service: GNS_SERVICES.CHATS,
    action: ACTIONS.CREATE,
  }),
],validateBody(validations.createChatData)], createChat);

/**
 * @swagger
 * /chats:
 *   get:
 *     summary: Get a list of chats
 *     tags: [Chat]
 *     security:
 *       - apiKey: []
 *     responses:
 *       '200':
 *         description: Chat retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Chat retrieved."
 *               details:
 *                 chat:
 *                   _id: "6568c2bf67310c03120069cb"
 *                   deleteMarker:
 *                     status: false
 *                     deletedAt: null
 *                     dateScheduled: null
 *                   conversationId: "655b4bbd4e5343001f07174d"
 *                   plainTextMessage: "Hello, how are you?"
 *                   attachment: "https://example.com/image.jpg"
 */
router.get("/", [
  enforceRbac({
    service: GNS_SERVICES.CHATS,
    action: ACTIONS.READ,
  }),
], listChats);

/**
 * @swagger
 * /chats/{id}:
 *   get:
 *     summary: Get chat by ID
 *     tags: [Chat]
 *     security:
 *       - apiKey: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Chats retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Chats retrieved."
 *               details:
 *                 chats: []
 *                 pagination:
 *                   totalPages: 1
 *                   totalResults: 2
 *                   currentPage: 1
 *                   size: 0
 *                   hasPrevPage: false
 *                   hasNextPage: false
 *                   prevPage: null
 *                   nextPage: null
 * 
 *       '404':
 *         description: No chat found with the given query
 *         content:
 *           application/json:
 *             example:
 *               message: "Not Found"
 *               details:
 *                 description: "No chat found with the given query."
 */
router.get("/:id", [
  enforceRbac({
    service: GNS_SERVICES.CHATS,
    action: ACTIONS.READ,
  }),
], getChat);

/**
 * @swagger
 * /chats/{id}/soft:
 *   delete:
 *     summary: Soft remove chat by ID
 *     tags: [Chat]
 *     security:
 *       - apiKey: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Chat moved to trash successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Chat moved to trash."
 *               details:
 *                 chat:
 *                   deleteMarker:
 *                     status: false
 *                     deletedAt: null
 *                     dateScheduled: null
 *                   _id: "6568c2bf67310c03120069cb"
 *                   conversationId: "655b4bbd4e5343001f07174d"
 *                   plainTextMessage: "Hello, how are you?"
 *                   attachment: "https://example.com/image.jpg"
 * 
 *       '404':
 *         description: No chat found with the given query
 *         content:
 *           application/json:
 *             example:
 *               message: "Not Found"
 *               details:
 *                 description: "No chat found with the given query."       
 */
router.delete("/:id/soft", [], softRemoveChat);

/**
 * @swagger
 * /chats/{id}/hard:
 *   delete:
 *     summary: Hard remove chat by ID
 *     tags: [Chat]
 *     security:
 *       - apiKey: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Chat removed successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Chat removed."
 *               details:
 *                 chat:
 *                   deleteMarker:
 *                     status: false
 *                     deletedAt: null
 *                     dateScheduled: null
 *                   _id: "6568c2bf67310c03120069cb"
 *                   conversationId: "655b4bbd4e5343001f07174d"
 *                   plainTextMessage: "Hello, how are you?"
 *                   attachment: "https://example.com/image.jpg"
 *       '404':
 *         description: No chat found with the given query
 *         content:
 *           application/json:
 *             example:
 *               message: "Not Found"
 *               details:
 *                 description: "No chat found with the given query."
 */
router.delete("/:id/hard", [], hardRemoveChat);

/**
 * @swagger
 * /chats/{id}/restore:
 *   put:
 *     summary: Restore soft-removed chat by ID
 *     tags: [Chat]
 *     security:
 *       - apiKey: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Chat restored successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Chat restored."
 *               details:
 *                 chat:
 *                   deleteMarker:
 *                     status: true
 *                     deletedAt: "2023-11-30T17:16:40.775Z"
 *                     dateScheduled: "2023-11-30T17:16:40.775Z"
 *                   _id: "6568c2bf67310c03120069cb"
 *                   conversationId: "655b4bbd4e5343001f07174d"
 *                   plainTextMessage: "Hello, how are you?"
 *                   attachment: "https://example.com/image.jpg"
 * 
 *       '404':
 *         description: No chat found with the given query
 *         content:
 *           application/json:
 *             example:
 *               message: "Not Found"
 *               details:
 *                 description: "No chat found with the given query."
 */
router.put("/:id/restore", [], restoreChat);

module.exports = router;
