/**
 * @swagger
 * tags:
 *   name: Location
 *   description: API for managing locations
 */

const router = require("express").Router();
const {
  createLocation,
  getLocation,
  updateLocationInfo,
  listLocation,
  softRemoveLocation,
  hardRemoveLocation,
  restoreLocation,
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
 *     createLocationData:
 *       type: object
 *       properties:
 *         organisationId:
 *           type: string
 *           required: true
 *           label: Organisation Id
 *         name:
 *           type: string
 *           required: true
 *           label: name
 *         geometry:
 *           type: any
 *           label: geometry
 *         direction:
 *           type: any
 *           label: direction
 *       required:
 *         - organisationId
 *         - name
 *
 *     updateLocationData:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           required: true
 *           label: name
 *         geometry:
 *           type: any
 *           label: geometry
 *         direction:
 *           type: any
 *           label: direction
 */

/**
 * @swagger
 * /locations/:
 *   post:
 *     summary: Create a new location
 *     tags: [Location]
 *     security:
 *       - apiKey: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/createLocationData'
 *     responses:
 *       '200':
 *         description: Location created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Location created successfully."
 *               details:
 *                 deleteMarker:
 *                   status: false
 *                   deletedAt: null
 *                   dateScheduled: null
 *                 _id: "6568c705a4c3bb03d6832bd4"
 *                 name: "new location"
 *                 geometry:
 *                   type: "Point"
 *                   coordinates: [-73.987898, 40.743676]
 *                 organisationId: "655b4b894e5343001f07174a"
 */
router.post(
  "/",
  [
    [
      enforceRbac({
        service: GNS_SERVICES.LOCATIONS,
        action: ACTIONS.CREATE,
      }),
    ],
    validateBody(validations.createLocationData),
  ],
  createLocation
);

/**
 * @swagger
 * /locations/{id}:
 *   get:
 *     summary: Get location by ID
 *     tags: [Location]
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
 *         description: Location retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Location retrieved successfully."
 *               details:
 *                 location:
 *                   deleteMarker:
 *                     status: false
 *                     deletedAt: null
 *                     dateScheduled: null
 *                   _id: "6568c705a4c3bb03d6832bd4"
 *                   name: "new location"
 *                   geometry:
 *                     type: "Point"
 *                     coordinates: [-73.987898, 40.743676]
 *                   organisationId: "655b4b894e5343001f07174a"
 *       '404':
 *         description: Location not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Not Found"
 *               details:
 *                 description: "Location not found with given query."
 */
router.get(
  "/:id",
  [
    enforceRbac({
      service: GNS_SERVICES.LOCATIONS,
      action: ACTIONS.READ,
    }),
  ],
  getLocation
);

/**
 * @swagger
 * /locations:
 *   get:
 *     summary: Get a list of locations
 *     tags: [Location]
 *     security:
 *       - apiKey: []
 *     responses:
 *       '200':
 *         description: Locations retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Location retrieved successfully."
 *               details:
 *                 locations: []
 *                 pagination:
 *                   totalPages: 1
 *                   totalResults: 2
 *                   currentPage: 1
 *                   size: 0
 *                   hasPrevPage: false
 *                   hasNextPage: false
 *                   prevPage: null
 *                   nextPage: null
 */
router.get(
  "/",
  [
    enforceRbac({
      service: GNS_SERVICES.LOCATIONS,
      action: ACTIONS.READ,
    }),
  ],
  listLocation
);

/**
 * @swagger
 * /locations/{id}:
 *   put:
 *     summary: Update location information by ID
 *     tags: [Location]
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
 *             $ref: '#/components/schemas/updateLocationData'
 *     responses:
 *       '200':
 *         description: Location info updated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Location info updated."
 *               details:
 *                 location:
 *                   deleteMarker:
 *                     status: true
 *                     deletedAt: "2023-11-30T17:35:21.491Z"
 *                     dateScheduled: "2023-11-30T17:35:21.492Z"
 *                   _id: "6568c705a4c3bb03d6832bd4"
 *                   name: "Updated Location Name"
 *                   geometry:
 *                     type: "Point"
 *                     coordinates: [2.34, 5.67]
 *                   organisationId: "655b4b894e5343001f07174a"
 *                   __v: 0
 *                   direction: "South"
 *       '404':
 *         description: Location not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Not Found"
 *               details:
 *                 description: "Location not found with given query."
 */
router.put(
  "/:id",
  [
    [
      enforceRbac({
        service: GNS_SERVICES.LOCATIONS,
        action: ACTIONS.CREATE,
      }),
    ],
    validateBody(validations.updateLocationData),
  ],
  updateLocationInfo
);

/**
 * @swagger
 * /locations/{id}/soft:
 *   delete:
 *     summary: Soft remove location by ID
 *     tags: [Location]
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
 *         description: Location moved to trash successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Location moved to trash."
 *               details:
 *                 location:
 *                   deleteMarker:
 *                     status: false
 *                     deletedAt: null
 *                     dateScheduled: null
 *                   _id: "6568c705a4c3bb03d6832bd4"
 *                   name: "new location"
 *                   geometry:
 *                     type: "Point"
 *                     coordinates: [-73.987898, 40.743676]
 *                   organisationId: "655b4b894e5343001f07174a"
 *       '404':
 *         description: Location not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Not Found"
 *               details:
 *                 description: "Location not found with given query."
 */
router.delete("/:id/soft", [], softRemoveLocation);

/**
 * @swagger
 * /locations/{id}/hard:
 *   delete:
 *     summary: Hard remove location by ID
 *     tags: [Location]
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
 *         description: Location removed successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Location removed."
 *               details:
 *                 location:
 *                   deleteMarker:
 *                     status: false
 *                     deletedAt: null
 *                     dateScheduled: null
 *                   _id: "6568c705a4c3bb03d6832bd4"
 *                   name: "Updated Location Name"
 *                   geometry:
 *                     type: "Point"
 *                     coordinates: [2.34, 5.67]
 *                   organisationId: "655b4b894e5343001f07174a"
 *                   __v: 0
 *                   direction: "South"
 *       '404':
 *         description: Location not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Not Found"
 *               details:
 *                 description: "Location not found with given query."
 */
router.delete("/:id/hard", [], hardRemoveLocation);

/**
 * @swagger
 * /locations/{id}/restore:
 *   put:
 *     summary: Restore soft-removed location by ID
 *     tags: [Location]
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
 *         description: Location restored successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Location restored."
 *               details:
 *                 location:
 *                   deleteMarker:
 *                     status: true
 *                     deletedAt: "2023-11-30T17:35:21.491Z"
 *                     dateScheduled: "2023-11-30T17:35:21.492Z"
 *                   _id: "6568c705a4c3bb03d6832bd4"
 *                   name: "Updated Location Name"
 *                   geometry:
 *                     type: "Point"
 *                     coordinates: [2.34, 5.67]
 *                   organisationId: "655b4b894e5343001f07174a"
 *                   __v: 0
 *                   direction: "South"
 *
 *       '404':
 *         description: Location not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Not Found"
 *               details:
 *                 description: "Location not found with given query."
 */
router.put("/:id/restore", [], restoreLocation);

module.exports = router;
