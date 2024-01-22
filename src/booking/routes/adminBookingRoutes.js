/**
 * @swagger
 * tags:
 *   name: Admin Booking
 *   description: API for managing bookings confirmation, delete and restore by only admin
 */

const router = require("express").Router();

const {
  softRemoveBooking,
  hardRemoveBooking,
  restoreBooking,
  confirmBooking,
  adminBookingList,
} = require("../controllers");
const { validate } = require("../../common/middlewares/validator");
const validations = require("../validations");
const checkAdmin = require("../../common/middlewares/checkAdmin");

const validateBody = validate("body");

router.get("/", [checkAdmin], adminBookingList);
router.post(
  "/:id/status",
  [checkAdmin, validateBody(validations.confirmBookingDataSchema)],
  confirmBooking
);  


router.delete("/:id/soft", [checkAdmin,], softRemoveBooking);
router.delete("/:id/hard", [checkAdmin,], hardRemoveBooking);
router.put("/:id/restore", [checkAdmin,], restoreBooking);

/**
 * @swagger
 * /admin/bookings/:
 *   get:
 *     summary: Get a list of bookings for admin
 *     tags: [Admin Booking]
 *     security:
 *       - adminApiKey: []
 *     responses:
 *       '200':
 *         description: Bookings retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Booking retrieved."
 *               details:
 *                 locations: []
 *                 pagination:
 *                   totalPages: 1
 *                   totalResults: 8
 *                   currentPage: 1
 *                   size: 0
 *                   hasPrevPage: false
 *                   hasNextPage: false
 *                   prevPage: null
 *                   nextPage: null
 */

/**
 * @swagger
 * /admin/bookings/{id}/status:
 *   post:
 *     summary: Confirm booking status by ID
 *     tags: [Admin Booking]
 *     security:
 *       - adminApiKey: []
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
 *             $ref: '#/components/schemas/confirmBookingDataSchema'
 *     responses:
 *       '200':
 *         description: Booking status updated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Booking status updated."
 *               details:
 *                 booking:
 *                   deleteMarker:
 *                     status: false
 *                     deletedAt: null
 *                     dateScheduled: null
 *                   services:
 *                     - "Aerial Survey"
 *                   status: "Confirmed"
 *                   notes: "sample notes provided"
 *                   _id: "655b4e464e5343001f071766"
 *                   organisationId: "655b4b894e5343001f07174a"
 *                   surveyDate: "2023-11-25T14:00:00.000Z"
 *                   location: "655b4d034e5343001f07175a"
 *                   bookedBy: "655b4b264e5343001f071744"
 *                   description: "Sample booking description"
 *                   contactEmail: "test@example.com"
 *                   contactPhone: "+1234567890"
 *                   createdAt: "2023-11-20T12:17:10.389Z"
 *                   updatedAt: "2023-12-01T18:11:03.153Z"
 */


/**
 * @swagger
 * /admin/bookings/{id}/soft:
 *   delete:
 *     summary: Soft remove booking by ID
 *     tags: [Admin Booking]
 *     security:
 *       - adminApiKey: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Booking moved to trash successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Booking moved to trash."
 *               details:
 *                 booking:
 *                   deleteMarker:
 *                     status: false
 *                     deletedAt: null
 *                     dateScheduled: null
 *                   services:
 *                     - "Aerial Survey"
 *                   status: "Confirmed"
 *                   notes: "sample notes provided"
 *                   _id: "655b4e464e5343001f071766"
 *                   organisationId: "655b4b894e5343001f07174a"
 *                   surveyDate: "2023-11-25T14:00:00.000Z"
 *                   location: "655b4d034e5343001f07175a"
 *                   bookedBy: "655b4b264e5343001f071744"
 *                   description: "Sample booking description"
 *                   contactEmail: "test@example.com"
 *                   contactPhone: "+1234567890"
 *                   createdAt: "2023-11-20T12:17:10.389Z"
 *                   updatedAt: "2023-12-01T18:11:03.153Z"
 *                   __v: 0
 *       '404':
 *         description: Not Found
 *         content:
 *           application/json:
 *             example:
 *               message: "Not Found"
 *               details:
 *                 description: "Booking not found with the given ID."
 */

/**
 * @swagger
 * /admin/bookings/{id}/hard:
 *   delete:
 *     summary: Hard remove booking by ID
 *     tags: [Admin Booking]
 *     security:
 *       - adminApiKey: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example: { message: 'Booking removed.' }
 */


/**
 * @swagger
 * /admin/bookings/{id}/restore:
 *   put:
 *     summary: Restore soft-removed booking by ID
 *     tags: [Admin Booking]
 *     security:
 *       - adminApiKey: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Booking restored successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Booking restored."
 *               details:
 *                 booking:
 *                   deleteMarker:
 *                     status: true
 *                     deletedAt: "2023-12-01T18:52:30.275Z"
 *                     dateScheduled: "2023-12-01T18:52:30.275Z"
 *                   services:
 *                     - "Aerial Survey"
 *                   status: "Confirmed"
 *                   notes: "sample notes provided"
 *                   _id: "655b4e464e5343001f071766"
 *                   organisationId: "655b4b894e5343001f07174a"
 *                   surveyDate: "2023-11-25T14:00:00.000Z"
 *                   location: "655b4d034e5343001f07175a"
 *                   bookedBy: "655b4b264e5343001f071744"
 *                   description: "Sample booking description"
 *                   contactEmail: "test@example.com"
 *                   contactPhone: "+1234567890"
 *                   createdAt: "2023-11-20T12:17:10.389Z"
 *                   updatedAt: "2023-12-01T18:52:30.278Z"
 *                   __v: 0
 *       '404':
 *         description: Not Found
 *         content:
 *           application/json:
 *             example:
 *               message: "Not Found"
 *               details:
 *                 description: "Booking not found with the given ID."
 */



module.exports = router;
