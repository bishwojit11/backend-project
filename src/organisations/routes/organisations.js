/**
 * @swagger
 * tags:
 *   name: Organisation
 *   description: API for managing organisations
 */

const router = require("express").Router();
const {
  getOrganisation,
  createOrganisation,
  updateOrganisationInformation,
  listOrganisations,
  softRemoveOrganisation,
  restoreOrganisation,
  hardRemoveOrganisation,
} = require("../controllers");
const { validate } = require("../../common/middlewares/validator");
const validations = require("../validations");

const validateBody = validate("body");

/**
 * @swagger
 * components:
 *   schemas:
 *     addressTemplate:
 *       type: object
 *       properties:
 *         street:
 *           type: string
 *           required: true
 *         aptSuiteEtc:
 *           type: string
 *           required: true
 *         city:
 *           type: string
 *           required: true
 *         stateOrProvince:
 *           type: string
 *           required: true
 *         country:
 *           type: string
 *           required: true
 *         postCode:
 *           type: string
 *           required: true
 *         googlePlaceLocation:
 *           type: string
 *           required: true
 *       required:
 *         - street
 *         - aptSuiteEtc
 *         - city
 *         - stateOrProvince
 *         - country
 *         - postCode
 *         - googlePlaceLocation
 *     emailTemplate:
 *       type: string
 *       maxLength: 50
 *       format: email
 *       label: Office Email
 *     fileMetaInfo:
 *       type: object
 *       properties:
 *         Name:
 *           type: string
 *           required: true
 *         Key:
 *           type: string
 *           required: true
 *         Bucket:
 *           type: string
 *           required: true
 *       required:
 *         - Name
 *         - Key
 *         - Bucket
 *     createOrganisationData:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           required: true
 *           label: Name
 *         officePhone:
 *           type: string
 *           label: Office Phone
 *         officeEmail:
 *           $ref: '#/components/schemas/emailTemplate'
 *         address:
 *           $ref: '#/components/schemas/addressTemplate'
 *         registrationNumber:
 *           type: string
 *           label: Registration Number
 *         industry:
 *           type: string
 *           label: Industry
 *         purposeOfUse:
 *           type: array
 *           items:
 *             type: string
 *           label: Purpose of Use
 *         organisationalLogo:
 *           $ref: '#/components/schemas/fileMetaInfo'
 *       required:
 *         - name
 *     updateOrganisationData:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           required: true
 *           label: Name
 *         officeEmail:
 *           $ref: '#/components/schemas/emailTemplate'
 *         address:
 *           $ref: '#/components/schemas/addressTemplate'
 */

/**
 * @swagger
 * /organisations/:
 *   post:
 *     summary: Create a new organisation
 *     tags: [Organisation]
 *     security:
 *       - apiKey: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/createOrganisationData'
 *     responses:
 *       '200':
 *         description: Organisation created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "organisation created successfully."
 *               details:
 *                 organisation:
 *                   deleteMarker:
 *                     status: false
 *                     deletedAt: null
 *                     dateScheduled: null
 *                   purposeOfUse:
 *                     - "Sales"
 *                     - "Marketing"
 *                   _id: "6569f9ce8e0bf2006ef914a4"
 *                   name: "ims systems"
 *                   officePhone: "123-456-7890"
 *                   officeEmail: "contact@example.com"
 *                   address:
 *                     street: "123 Main Street"
 *                     aptSuiteEtc: "Apt 4B"
 *                     city: "San Francisco"
 *                     stateOrProvince: "CA"
 *                     country: "USA"
 *                     postCode: "94101"
 *                     googlePlaceLocation: "Google HQ"
 *                   registrationNumber: "123456789"
 *                   industry: "Technology"
 *                   createdBy: "655b4b264e5343001f071744"
 *                   createdAt: "2023-12-01T15:20:46.927Z"
 *                   updatedAt: "2023-12-01T15:20:46.927Z"
 *                   __v: 0
 */

router.post(
  "/",
  [validateBody(validations.createOrganisationData)],
  createOrganisation
);

/**
 * @swagger
 * /organisations/{id}:
 *   get:
 *     summary: Get organisation by ID
 *     tags: [Organisation]
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
 *         description: Organisation details retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "organisation retrived."
 *               details:
 *                 organisation:
 *                   address:
 *                     street: "123 Main Street"
 *                     aptSuiteEtc: "Apt 4B"
 *                     city: "San Francisco"
 *                     stateOrProvince: "CA"
 *                     country: "USA"
 *                     postCode: "94101"
 *                     googlePlaceLocation: "Google HQ"
 *                   deleteMarker:
 *                     status: false
 *                     deletedAt: null
 *                     dateScheduled: null
 *                   purposeOfUse:
 *                     - "Sales"
 *                     - "Marketing"
 *                   _id: "6569f9ce8e0bf2006ef914a4"
 *                   name: "ims systems"
 *                   officePhone: "123-456-7890"
 *                   officeEmail: "contact@example.com"
 *                   registrationNumber: "123456789"
 *                   industry: "Technology"
 *                   createdBy: "655b4b264e5343001f071744"
 *                   createdAt: "2023-12-01T15:20:46.927Z"
 *                   updatedAt: "2023-12-01T15:20:46.927Z"
 */

router.get("/:id", [], getOrganisation);

/**
 * @swagger
 * /organisations:
 *   get:
 *     summary: Get a list of organisations
 *     tags: [Organisation]
 *     security:
 *       - apiKey: []
 *     responses:
 *       '200':
 *         description: Multiple organisations retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Organisations retrived."
 *               details:
 *                 organisations: []
 *                 pagination:
 *                   totalPages: 1
 *                   totalResults: 10
 *                   currentPage: 1
 *                   size: 0
 *                   hasPrevPage: false
 *                   hasNextPage: false
 *                   prevPage: null
 *                   nextPage: null
 */

router.get("/", [], listOrganisations);

/**
 * @swagger
 * /organisations/{id}:
 *   put:
 *     summary: Update organisation information by ID
 *     tags: [Organisation]
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
 *             $ref: '#/components/schemas/updateOrganisationData'
 *     responses:
 *       '200':
 *         description: Organisation updated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Organisation updated."
 *               details:
 *                 organisation:
 *                   deleteMarker:
 *                     status: false
 *                     deletedAt: null
 *                     dateScheduled: null
 *                   purposeOfUse: ["Sales", "Marketing"]
 *                   _id: "6569f9ce8e0bf2006ef914a4"
 *                   name: "ims systems"
 *                   officePhone: "123-456-7890"
 *                   officeEmail: "contact@example.com"
 *                   registrationNumber: "123456789"
 *                   industry: "Technology"
 *                   createdBy: "655b4b264e5343001f071744"
 *                   createdAt: "2023-12-01T15:20:46.927Z"
 *                   updatedAt: "2023-12-01T15:28:34.446Z"
 */

router.put(
  "/:id",
  [validateBody(validations.updateOrganisationData)],
  updateOrganisationInformation
);

/**
 * @swagger
 * /organisations/{id}/soft:
 *   delete:
 *     summary: Soft remove organisation by ID
 *     tags: [Organisation]
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
 *         description: Organisation moved to trash successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Organisation moved to trash."
 *               details:
 *                 organisation:
 *                   deleteMarker:
 *                     status: false
 *                     deletedAt: null
 *                     dateScheduled: null
 *                   purposeOfUse: ["Sales", "Marketing"]
 *                   _id: "6569f9ce8e0bf2006ef914a4"
 *                   name: "ims systems"
 *                   officePhone: "123-456-7890"
 *                   officeEmail: "contact@example.com"
 *                   registrationNumber: "123456789"
 *                   industry: "Technology"
 *                   createdBy: "655b4b264e5343001f071744"
 *                   createdAt: "2023-12-01T15:20:46.927Z"
 *                   updatedAt: "2023-12-01T15:28:34.446Z"
 */

router.delete("/:id/soft", [], softRemoveOrganisation);

/**
 * @swagger
 * /organisations/{id}/hard:
 *   delete:
 *     summary: Hard remove organisation by ID
 *     tags: [Organisation]
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
 *         description: Organisation removed successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Organisation removed."
 *               details:
 *                 organisation:
 *                   deleteMarker:
 *                     status: false
 *                     deletedAt: null
 *                     dateScheduled: null
 *                   purposeOfUse: ["Sales", "Marketing"]
 *                   _id: "6569f9ce8e0bf2006ef914a4"
 *                   name: "ims systems"
 *                   officePhone: "123-456-7890"
 *                   officeEmail: "contact@example.com"
 *                   registrationNumber: "123456789"
 *                   industry: "Technology"
 *                   createdBy: "655b4b264e5343001f071744"
 *                   createdAt: "2023-12-01T15:20:46.927Z"
 *                   updatedAt: "2023-12-01T15:30:00.208Z"
 */

router.delete("/:id/hard", [], hardRemoveOrganisation);

/**
 * @swagger
 * /organisations/{id}/restore:
 *   put:
 *     summary: Restore soft-removed organisation by ID
 *     tags: [Organisation]
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
 *         description: Organisation restored successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Organisation restored."
 *               details:
 *                 organisation:
 *                   deleteMarker:
 *                     status: true
 *                     deletedAt: "2023-12-01T15:29:21.079Z"
 *                     dateScheduled: "2023-12-01T15:29:21.079Z"
 *                   purposeOfUse: ["Sales", "Marketing"]
 *                   _id: "6569f9ce8e0bf2006ef914a4"
 *                   name: "ims systems"
 *                   officePhone: "123-456-7890"
 *                   officeEmail: "contact@example.com"
 *                   registrationNumber: "123456789"
 *                   industry: "Technology"
 *                   createdBy: "655b4b264e5343001f071744"
 *                   createdAt: "2023-12-01T15:20:46.927Z"
 *                   updatedAt: "2023-12-01T15:29:21.082Z"
 */

router.put("/:id/restore", [], restoreOrganisation);

module.exports = router;
