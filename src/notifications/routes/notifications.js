/**
 * @swagger
 * tags:
 *   name: Notification
 *   description: API for managing notifications
 */

const router = require("express").Router();
const {
  createNotification,
  getNotification,
  listNotification,
  updateNotificationInfo,
  updateNotificationStatus,
  hardRemoveNotification,
} = require("../controllers");
const { validate } = require("../../common/middlewares/validator");
const validations = require("../validations");
const { GNS_SERVICES, ACTIONS } = require("../../models/typesAndEnums");
const { enforceRbac } = require("../../common/middlewares/enforceRbac");
const validateBody = validate("body");

/**
 * @swagger
 * components:
 *   schemas:
 *     notificationStructure:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           maxLength: 100
 *           required: true
 *           label: title
 *         message:
 *           type: string
 *           maxLength: 6000
 *           required: true
 *           label: message
 *
 *     createNotificationData:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           maxLength: 100
 *           required: true
 *           label: title
 *         message:
 *           type: string
 *           maxLength: 6000
 *           required: true
 *           label: message
 *         status:
 *           type: string
 *           enum: [Queued, Sent, Failed]
 *           default: Queued
 *           label: status
 *         redirectedPath:
 *           type: string
 *           label: redirectedPath
 *         audienceGroup:
 *           type: string
 *           enum: [ROLE1, ROLE2, ROLE3, ""]
 *           emptyValue: null
 *           label: Audience Group
 *         type:
 *           type: string
 *           enum: [System, Type1, Type2]
 *           default: System
 *           label: type
 *         priorityLevel:
 *           type: string
 *           enum: [Level1, Level2, Level3]
 *           required: true
 *           label: priorityLevel
 *         user:
 *           type: string
 *           label: user
 *         organisationId:
 *           type: string
 *           required: true
 *           label: Organisation Id
 *       required:
 *         - title
 *         - message
 *         - priorityLevel
 *         - organisationId
 *
 *     updateNotificationData:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           maxLength: 100
 *           required: true
 *           label: title
 *         message:
 *           type: string
 *           maxLength: 6000
 *           required: true
 *           label: message
 *
 *     updateNotificationStatus:
 *       type: object
 *       properties:
 *         notificationIds:
 *           type: array
 *           items:
 *             type: string
 *           minLength: 1
 *           required: true
 *           label: notificationIds
 *         status:
 *           type: string
 *           enum: [Queued, Sent, Failed]
 *           default: Queued
 *           label: status
 */

/**
 * @swagger
 * /notifications/:
 *   post:
 *     summary: Create a new notification
 *     tags: [Notification]
 *     security:
 *       - apiKey: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/createNotificationData'
 *     responses:
 *       '200':
 *         description: Notification created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Notification created successfully."
 *               details:
 *                 notification:
 *                   status: "Queued"
 *                   type: "GNS Manager"
 *                   priorityLevel: "P1"
 *                   _id: "656a0c4cd0ef220074876232"
 *                   title: "notification config email process done"
 *                   message: "In service layer email configuration code implemented and works fine."
 *                   attachments: []
 *                   redirectedPath: "viwdetails"
 *                   audienceGroup: "Administrator"
 *                   createdBy: "655b4b264e5343001f071744"
 *                   user: "654d166552051303e6affa13"
 *                   organisationId: "652d4347e8c66b0020da57da"
 *                   createdAt: "2023-12-01T16:39:40.945Z"
 *                   updatedAt: "2023-12-01T16:39:40.945Z"
 *
 */
router.post(
  "/",
  [
    [
      enforceRbac({
        service: GNS_SERVICES.NOTIFICATIONS,
        action: ACTIONS.CREATE,
      }),
    ],
    validateBody(validations.createNotificationData),
  ],
  createNotification
);

/**
 * @swagger
 * /notifications/status:
 *   post:
 *     summary: Update notification status
 *     tags: [Notification]
 *     security:
 *       - apiKey: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/updateNotificationStatus'
 *     responses:
 *       '200':
 *         description: Notification updated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Notification updated successfully."
 *               details:
 *                 notification:
 *                   n: 0
 *                   nModified: 0
 *                   ok: 1
 *
 *       '404':
 *         description: Not Found, notification not found with the given ID
 *         content:
 *           application/json:
 *             example:
 *               message: "Not Found"
 *               details:
 *                 description: "Notification not found with the given ID."
 */
router.post(
  "/status",
  [
    [
      enforceRbac({
        service: GNS_SERVICES.NOTIFICATIONS,
        action: ACTIONS.CREATE,
      }),
    ],
    validateBody(validations.updateNotificationStatus),
  ],
  updateNotificationStatus
);

/**
 * @swagger
 * /notifications/{id}:
 *   get:
 *     summary: Get notification by ID
 *     tags: [Notification]
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
 *         description: Notification retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Notification retrieved."
 *               details:
 *                 notification:
 *                   status: "Queued"
 *                   type: "GNS Manager"
 *                   priorityLevel: "P1"
 *                   _id: "656a0c4cd0ef220074876232"
 *                   title: "notification config email process done"
 *                   message: "In service layer email configuration code implemented and works fine."
 *                   attachments: []
 *                   redirectedPath: "viwdetails"
 *                   audienceGroup: "Administrator"
 *                   createdBy: "655b4b264e5343001f071744"
 *                   user: "654d166552051303e6affa13"
 *                   organisationId: "652d4347e8c66b0020da57da"
 *                   createdAt: "2023-12-01T16:39:40.945Z"
 *                   updatedAt: "2023-12-01T16:39:40.945Z"
 *
 *       '404':
 *         description: Not Found, notification not found with the given ID
 *         content:
 *           application/json:
 *             example:
 *               message: "Not Found"
 *               details:
 *                 description: "Notification not found with the given ID."
 */
router.get(
  "/:id",
  [
    enforceRbac({
      service: GNS_SERVICES.NOTIFICATIONS,
      action: ACTIONS.READ,
    }),
  ],
  getNotification
);

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get a list of notifications
 *     tags: [Notification]
 *     security:
 *       - apiKey: []
 *     responses:
 *       '200':
 *         description: Notifications retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Notification retrieved."
 *               details:
 *                 notifications: []
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
 */
router.get(
  "/",
  [
    enforceRbac({
      service: GNS_SERVICES.NOTIFICATIONS,
      action: ACTIONS.READ,
    }),
  ],
  listNotification
);

/**
 * @swagger
 * /notifications/{id}:
 *   put:
 *     summary: Update notification information by ID
 *     tags: [Notification]
 *     security:
 *       - apiKey: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/updateNotificationData'
 *     responses:
 *       '200':
 *         description: Notification info updated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Notification info updated."
 *               details:
 *                 notification:
 *                   status: "Queued"
 *                   type: "GNS Manager"
 *                   priorityLevel: "P1"
 *                   _id: "656a0c4cd0ef220074876232"
 *                   title: "Updated Notification Title"
 *                   message: "This is the updated notification message."
 *                   attachments: []
 *                   redirectedPath: "viwdetails"
 *                   audienceGroup: "Administrator"
 *                   createdBy: "655b4b264e5343001f071744"
 *                   user: "654d166552051303e6affa13"
 *                   organisationId: "652d4347e8c66b0020da57da"
 *                   createdAt: "2023-12-01T16:39:40.945Z"
 *                   updatedAt: "2023-12-01T16:41:15.028Z"
 *
 *       '404':
 *         description: Not Found, notification not found with the given ID
 *         content:
 *           application/json:
 *             example:
 *               message: "Not Found"
 *               details:
 *                 description: "Notification not found with the given ID."
 *
 */
router.put(
  "/:id",
  [
    [
      enforceRbac({
        service: GNS_SERVICES.NOTIFICATIONS,
        action: ACTIONS.CREATE,
      }),
    ],
    validateBody(validations.updateNotificationData),
  ],
  updateNotificationInfo
);

/**
 * @swagger
 * /notifications/{id}/hard:
 *   delete:
 *     summary: Hard remove notification by ID
 *     tags: [Notification]
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
 *         description: Notification removed successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Notification removed."
 *               details:
 *                 notification:
 *                   status: "Queued"
 *                   type: "GNS Manager"
 *                   priorityLevel: "P1"
 *                   _id: "656a0c4cd0ef220074876232"
 *                   title: "Updated Notification Title"
 *                   message: "This is the updated notification message."
 *                   attachments: []
 *                   redirectedPath: "viwdetails"
 *                   audienceGroup: "Administrator"
 *                   createdBy: "655b4b264e5343001f071744"
 *                   user: "654d166552051303e6affa13"
 *                   organisationId: "652d4347e8c66b0020da57da"
 *                   createdAt: "2023-12-01T16:39:40.945Z"
 *                   updatedAt: "2023-12-01T16:41:15.028Z"
 *
 *       '404':
 *         description: Not Found, notification not found with the given ID
 *         content:
 *           application/json:
 *             example:
 *               message: "Not Found"
 *               details:
 *                 description: "Notification not found with the given ID."
 */
router.delete("/:id/hard", [], hardRemoveNotification);

module.exports = router;
