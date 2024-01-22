/**
 * @swagger
 * tags:
 *   name: Booking
 *   description: API for managing bookings
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     bookingSchema:
 *       type: object
 *       properties:
 *         description:
 *           type: string
 *           required: true
 *           label: Description
 *         contactEmail:
 *           type: string
 *           maxLength: 50
 *           format: email
 *           required: true
 *           label: Email
 *         contactPhone:
 *           type: string
 *           label: Contact Phone
 *       required:
 *         - description
 *         - contactEmail
 * 
 *     createBookingData:
 *       type: object
 *       properties:
 *         organisationId:
 *           type: string
 *           required: true
 *           label: Organisation Id
 *         location:
 *           type: string
 *           required: true
 *           label: Location
 *         surveyDate:
 *           type: string
 *           format: date
 *           required: true
 *           label: Survey Date
 *         services:
 *           type: array
 *           items:
 *               type: string
 *           required: true
 *         description:
 *           type: string
 *           required: true
 *           label: Description
 *         contactEmail:
 *           type: string
 *           maxLength: 50
 *           format: email
 *           required: true
 *           label: Email
 *         contactPhone:
 *           type: string
 *           label: Contact Phone
 *       required:
 *         - organisationId
 *         - location
 *         - surveyDate
 *         - services
 *         - description
 *         - contactEmail
 *         - contactPhone
 * 
 *     confirmBookingDataSchema:
 *       type: object
 *       properties:
 *         notes:
 *           type: string
 *           label: Notes
 *         surveyDate:
 *           type: string
 *           format: date
 *           required: true
 *           label: Survey Date
 *         status:
 *           type: string
 *           enum: ["Confirmed", "Cancelled"]
 *           required: true
 *           label: Status
 *       required:
 *         - surveyDate
 *         - status
 * 
 *     updateBookingData:
 *       type: object
 *       properties:
 *         description:
 *           type: string
 *           required: true
 *           label: Description
 *         contactEmail:
 *           type: string
 *           maxLength: 50
 *           format: email
 *           required: true
 *           label: Email
 *         contactPhone:
 *           type: string
 *           label: Contact Phone
 *         services:
 *           type: array
 *           items:
 *               type: string
 *           required: true
 *            
 */

const router = require("express").Router();
const {
  createBooking,
  getBooking,
  updateBookingInfo,
  organisationBookingList,
  requestForCancelation,
} = require("../controllers");
const { validate } = require("../../common/middlewares/validator");
const validations = require("../validations");
const {SERVICES,ACTIONS} = require("../../models/typesAndEnums")
const { enforceRbac } = require("../../common/middlewares/enforceRbac");
const validateBody = validate("body");

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Booking]
 *     security:
 *       - apiKey: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/createBookingData'
 *     responses:
 *       '200':
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Booking created successfully."
 *               details:
 *                 booking:
 *                   _id: "6568b8bd36f96a026a8d77d7"
 *                   deleteMarker:
 *                     status: false
 *                     deletedAt: null
 *                     dateScheduled: null
 *                   services: ["Aerial Survey"]
 *                   status: "Requested"
 *                   notes: ""
 *                   organisationId: "655b4b894e5343001f07174a"
 *                   surveyDate: "2023-11-25T14:00:00.000Z"
 *                   location: "655b4d034e5343001f07175a"
 *                   bookedBy: "655b4b264e5343001f071744"
 *                   description: "Sample booking description"
 *                   contactEmail: "test@example.com"
 *                   contactPhone: "+1234567890"
 *                   createdAt: "2023-11-30T16:30:53.670Z"
 *                   updatedAt: "2023-11-30T16:30:53.670Z"
 *                   __v: 0
 */
router.post("/", [[
  enforceRbac({
    service: SERVICES.BOOKINGS,
    action: ACTIONS.CREATE,
  }),
],validateBody(validations.createBookingData)], createBooking);

/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     summary: Get booking by ID
 *     tags: [Booking]
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
 *         description: Booking retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Booking retrieved."
 *               details:
 *                 booking:
 *                   _id: "6568b8bd36f96a026a8d77d7"
 *                   deleteMarker:
 *                     status: false
 *                     deletedAt: null
 *                     dateScheduled: null
 *                   services: ["Aerial Survey"]
 *                   status: "Requested"
 *                   notes: ""
 *                   organisationId: "655b4b894e5343001f07174a"
 *                   surveyDate: "2023-11-25T14:00:00.000Z"
 *                   location: "655b4d034e5343001f07175a"
 *                   bookedBy: "655b4b264e5343001f071744"
 *                   description: "Sample booking description"
 *                   contactEmail: "test@example.com"
 *                   contactPhone: "+1234567890"
 *                   createdAt: "2023-11-30T16:30:53.670Z"
 *                   updatedAt: "2023-11-30T16:30:53.670Z"
 *       '404':
 *         description: Booking details not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Not Found"
 *               details:
 *                 description: "Booking Details not found with given query."
 */
router.get("/:id", [
  enforceRbac({
    service: SERVICES.BOOKINGS,
    action: ACTIONS.READ,
  }),
], getBooking);

/**
 * @swagger
 * /bookings/:
 *   get:
 *     summary: Get a list of bookings for an organisation
 *     tags: [Booking]
 *     security:
 *       - apiKey: []
 *     responses:
 *       '200':
 *         description: Locations retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Booking retrieved."
 *               details:
 *                 locations: []
 *                 pagination:
 *                   totalPages: 1
 *                   totalResults: 7
 *                   currentPage: 1
 *                   size: 0
 *                   hasPrevPage: false
 *                   hasNextPage: false
 *                   prevPage: null
 *                   nextPage: null
 *       
 */
router.get("/", [
  enforceRbac({
    service: SERVICES.BOOKINGS,
    action: ACTIONS.READ,
  }),
], organisationBookingList);

/**
 * @swagger
 * /bookings/{id}:
 *   put:
 *     summary: Request for booking cancellation by ID
 *     tags: [Booking]
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
 *         description: Booking cancel request sent successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Booking cancel request sent."
 *               details:
 *                 booking:
 *                   _id: "6568b8bd36f96a026a8d77d7"
 *                   deleteMarker:
 *                     status: false
 *                     deletedAt: null
 *                     dateScheduled: null
 *                   services: ["Aerial Survey"]
 *                   status: "Requested to cancel"
 *                   notes: ""
 *                   organisationId: "655b4b894e5343001f07174a"
 *                   surveyDate: "2023-11-25T14:00:00.000Z"
 *                   location: "655b4d034e5343001f07175a"
 *                   bookedBy: "655b4b264e5343001f071744"
 *                   description: "Sample booking description"
 *                   contactEmail: "test@example.com"
 *                   contactPhone: "+1234567890"
 *                   createdAt: "2023-11-30T16:30:53.670Z"
 *                   updatedAt: "2023-11-30T16:37:53.788Z"
 * 
 *       '404':
 *         description: Booking details not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Not Found"
 *               details:
 *                 description: "Booking Details not found with given query."     
 */
router.put("/:id", [
  enforceRbac({
    service: SERVICES.BOOKINGS,
    action: ACTIONS.CREATE,
  }),
], requestForCancelation);

/**
 * @swagger
 * /bookings/{id}:
 *   patch:
 *     summary: Update booking information by ID
 *     tags: [Booking]
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
 *             $ref: '#/components/schemas/updateBookingData'
 *     responses:
 *       '200':
 *         description: Booking info updated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Booking info updated."
 *               details:
 *                 booking:
 *                   _id: "6568c05db8146302da14aa5d"
 *                   deleteMarker:
 *                     status: false
 *                     deletedAt: null
 *                     dateScheduled: null
 *                   status: "Requested"
 *                   notes: ""
 *                   organisationId: "655b4b894e5343001f07174a"
 *                   surveyDate: "2023-11-25T14:00:00.000Z"
 *                   location: "655b4d034e5343001f07175a"
 *                   bookedBy: "655b4b264e5343001f071744"
 *                   description: "update description"
 *                   contactEmail: "me.hello@gmail.com"
 *                   createdAt: "2023-11-30T17:03:25.650Z"
 *                   updatedAt: "2023-11-30T17:03:44.466Z"
 *                   __v: 0
 * 
 *       '404':
 *         description: Booking details not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Not Found"
 *               details:
 *                 description: "Booking Details not found with given query."
 */
router.patch("/:id", [[
  enforceRbac({
    service: SERVICES.BOOKINGS,
    action: ACTIONS.UPDATE,
  }),
],validateBody(validations.updateBookingData)], updateBookingInfo);

module.exports = router;
