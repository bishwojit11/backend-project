/**
 * @swagger
 * tags:
 *   name: Conversation
 *   description: API for managing conversations
 */

const router = require("express").Router();
const {
  createConversation,
  listConversations,
  getConversation,
  softRemoveConversation,
  hardRemoveConversation,
  restoreConversation,
} = require("../controllers");
const {GNS_SERVICES,ACTIONS} = require("../../models/typesAndEnums")
const { enforceRbac } = require("../../common/middlewares/enforceRbac");
/**
 * @swagger
 * components:
 *   schemas:
 *     createConversationData:
 *       type: object
 *       properties:
 *         targetUserId:
 *           type: string
 *           required: true
 *           label: targetUserId
 * */

/**
 * @swagger
 * /conversations:
 *   post:
 *     summary: Create a new conversation
 *     tags: [Conversation]
 *     security:
 *       - apiKey: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/createConversationData'
 *     responses:
 *       '200':
 *         description: Chathead created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Chathead created."
 *               details:
 *                 chathead:
 *                   deleteMarker:
 *                     status: false
 *                     deletedAt: null
 *                     dateScheduled: null
 *                   usersPair:
 *                     - "655b4b264e5343001f071744"
 *                     - "655b4bbd4e5343001f07174d"
 *                   _id: "655b4ce14e5343001f071758"
 *                   createdAt: "2023-11-20T12:11:13.112Z"
 *                   updatedAt: "2023-11-20T12:11:13.112Z"
 *   
 */
router.post("/", [
  enforceRbac({
    service: GNS_SERVICES.CONVERSATIONS,
    action: ACTIONS.CREATE,
  }),
], createConversation);

/**
 * @swagger
 * /conversations:
 *   get:
 *     summary: Get a list of conversations
 *     tags: [Conversation]
 *     security:
 *       - apiKey: []
 *     responses:
 *       '200':
 *         description: Conversations retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Conversations retrieved."
 *               details:
 *                 Conversations: []
 *                 pagination:
 *                   totalPages: 1
 *                   totalResults: 1
 *                   currentPage: 1
 *                   size: 0
 *                   hasPrevPage: false
 *                   hasNextPage: false
 *                   prevPage: null
 *                   nextPage: null
 */
router.get("/", [
  enforceRbac({
    service: GNS_SERVICES.CONVERSATIONS,
    action: ACTIONS.READ,
  }),
], listConversations);

/**
 * @swagger
 * /conversations/{id}:
 *   get:
 *     summary: Get conversation by ID
 *     tags: [Conversation]
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
 *         description: Conversation retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Conversation retrieved."
 *               details:
 *                 conversation:
 *                   deleteMarker:
 *                     status: false
 *                     deletedAt: null
 *                     dateScheduled: null
 *                   usersPair:
 *                     - "655b4b264e5343001f071744"
 *                     - "655b4bbd4e5343001f07174d"
 *                   _id: "655b4ce14e5343001f071758"
 *                   createdAt: "2023-11-20T12:11:13.112Z"
 *                   updatedAt: "2023-11-20T12:11:13.112Z"
 * 
 *       '404':
 *         description: No conversation found with the given query
 *         content:
 *           application/json:
 *             example:
 *               message: "Not Found"
 *               details:
 *                 description: "No conversation found with the given query."
 */
router.get("/:id", [
  enforceRbac({
    service: GNS_SERVICES.CONVERSATIONS,
    action: ACTIONS.READ,
  }),
], getConversation);

/**
 * @swagger
 * /conversations/{id}/soft:
 *   delete:
 *     summary: Soft remove conversation by ID
 *     tags: [Conversation]
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
 *         description: Conversation moved to trash successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Conversation moved to trash."
 *               details:
 *                 conversation:
 *                   deleteMarker:
 *                     status: false
 *                     deletedAt: null
 *                     dateScheduled: null
 *                   usersPair:
 *                     - "655b4b264e5343001f071744"
 *                     - "655b4bbd4e5343001f07174d"
 *                   _id: "655b4ce14e5343001f071758"
 *                   createdAt: "2023-11-20T12:11:13.112Z"
 *                   updatedAt: "2023-11-20T12:11:13.112Z"
 *       '404':
 *         description: No conversation found with the given query
 *         content:
 *           application/json:
 *             example:
 *               message: "Not Found"
 *               details:
 *                 description: "No conversation found with the given query."
 */
router.delete("/:id/soft", [], softRemoveConversation);

/**
 * @swagger
 * /conversations/{id}/hard:
 *   delete:
 *     summary: Hard remove conversation by ID
 *     tags: [Conversation]
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
 *         description: Conversation removed successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Conversation removed."
 *               details:
 *                 conversation:
 *                   deleteMarker:
 *                     status: false
 *                     deletedAt: null
 *                     dateScheduled: null
 *                   usersPair:
 *                     - "655b4b264e5343001f071744"
 *                     - "655b4bbd4e5343001f07174d"
 *                   _id: "655b4ce14e5343001f071758"
 *                   createdAt: "2023-11-20T12:11:13.112Z"
 *                   updatedAt: "2023-11-30T17:26:04.235Z"
 * 
 *       '404':
 *         description: No conversation found with the given query
 *         content:
 *           application/json:
 *             example:
 *               message: "Not Found"
 *               details:
 *                 description: "No conversation found with the given query."
 */
router.delete("/:id/hard", [], hardRemoveConversation);

/**
 * @swagger
 * /conversations/{id}/restore:
 *   put:
 *     summary: Restore soft-removed conversation by ID
 *     tags: [Conversation]
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
 *         description: Conversation restored successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Conversation restored."
 *               details:
 *                 conversation:
 *                   deleteMarker:
 *                     status: true
 *                     deletedAt: "2023-11-30T17:25:23.795Z"
 *                     dateScheduled: "2023-11-30T17:25:23.795Z"
 *                   usersPair:
 *                     - "655b4b264e5343001f071744"
 *                     - "655b4bbd4e5343001f07174d"
 *                   _id: "655b4ce14e5343001f071758"
 *                   createdAt: "2023-11-20T12:11:13.112Z"
 *                   updatedAt: "2023-11-30T17:25:23.797Z"
 * 
 *       '404':
 *         description: No conversation found with the given query
 *         content:
 *           application/json:
 *             example:
 *               message: "Not Found"
 *               details:
 *                 description: "No conversation found with the given query."
 */
router.put("/:id/restore", [], restoreConversation);

module.exports = router;
