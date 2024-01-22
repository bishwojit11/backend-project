const router = require("express").Router();
const {
  changePassword,
  getUser,
  updateProfileInformation,
  listUsers,
  softRemoveUser,
  restoreUser,
  hardRemoveUser,
} = require("../controllers");

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateProfileData:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           description: First name of the user
 *         lastName:
 *           type: string
 *           description: Last name of the user
 *       required:
 *         - firstName
 *         - lastName
 *
 *     ChangePassword:
 *       type: object
 *       properties:
 *         oldPassword:
 *           type: string
 *           minLength: 8
 *           maxLength: 50
 *           description: Old password of the user
 *         password:
 *           type: string
 *           minLength: 8
 *           maxLength: 50
 *           description: New password of the user
 *       required:
 *         - oldPassword
 *         - password
 *
 *
 */

/**
 * @swagger
 * tags:
 *   name: User Management
 *   description: API for managing users
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [User Management]
 *     security:
 *       - apiKey: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to get
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "User retrieved."
 *               details:
 *                 user:
 *                   emailVerification:
 *                     token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJiaXNod29qaXQiLCJsYXN0TmFtZSI6Im1hbG8iLCJlbWFpbCI6Im1lLmJpc2h3b2ppdEBnbWFpbC5jb20iLCJpYXQiOjE3MDA0ODE4MjksImV4cCI6MTcwMDQ4MjQyOX0.dQkyErqAErO1NhhZ0ded5IsJfO5xvoIYtj45hWduqqk"
 *                     status: "Pending"
 *                     verificationDate: null
 *                   deleteMarker:
 *                     status: false
 *                     deletedAt: null
 *                     dateScheduled: null
 *                   jobTitle: ""
 *                   purposeOfUse: []
 *                   isActive: false
 *                   refreshTokens: [
 *                     "token1",
 *                     "token2",
 *                     "token3",
 *                     "token4",
 *                     "token5"
 *                   ]
 *                   recoveryToken: ""
 *                   _id: "655b4b264e5343001f071744"
 *                   firstName: "string"
 *                   lastName: "string"
 *                   email: "me.bishwojit@gmail.com"
 *                   password: "$2a$10$vDl1uWtXZa6omUQt5wtKv.l.QUzh8bIv74IRKj5w/wBL/6gzjPggW"
 *                   fullName: "firstName lastzName"
 *                   createdAt: "2023-11-20T12:03:50.094Z"
 *                   updatedAt: "2023-12-01T15:20:36.832Z"
 * 
 *       '404':
 *         description: Not Found
 *         content:
 *           application/json:
 *             example:
 *               message: "Not Found"
 *               details:
 *                 description: "User not found with the given ID." 
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get a list of users
 *     tags: [User Management]
 *     security:
 *       - apiKey: []
 *     responses:
 *       '200':
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Users retrieved."
 *               details:
 *                 users: []
 *                 pagination:
 *                   totalPages: 1
 *                   totalResults: 6
 *                   currentPage: 1
 *                   size: 0
 *                   hasPrevPage: false
 *                   hasNextPage: false
 *                   prevPage: null
 *                   nextPage: null
 */

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user profile information
 *     tags: [User Management]
 *     security:
 *       - apiKey: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileData'
 *     responses:
 *       '200':
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "User updated."
 *               details:
 *                 user:
 *                   emailVerification:
 *                     token: "NewTokenValue"
 *                     status: "Pending"
 *                     verificationDate: null
 *                   deleteMarker:
 *                     status: true
 *                     deletedAt: "2023-12-01T15:34:48.720Z"
 *                     dateScheduled: "2023-12-01T15:34:48.720Z"
 *                   jobTitle: ""
 *                   purposeOfUse: []
 *                   isActive: false
 *                   refreshTokens: [
 *                     "newToken1",
 *                     "newToken2",
 *                     "newToken3",
 *                     "newToken4",
 *                     "newToken5"
 *                   ]
 *                   recoveryToken: ""
 *                   _id: "655b4b264e5343001f071744"
 *                   firstName: "NewFirstName"
 *                   lastName: "NewLastName"
 *                   email: "me.bishwojit@gmail.com"
 *                   password: "$2a$10$vDl1uWtXZa6omUQt5wtKv.l.QUzh8bIv74IRKj5w/wBL/6gzjPggW"
 *                   fullName: "NewFirstName NewLastName"
 *                   createdAt: "2023-11-20T12:03:50.094Z"
 *                   updatedAt: "2023-12-01T15:43:05.026Z"
 *                   __v: 30
 *       '404':
 *         description: Not Found
 *         content:
 *           application/json:
 *             example:
 *               message: "Not Found"
 *               details:
 *                 description: "User not found with the given ID." 
 * 
 */

/**
 * @swagger
 * /users/{id}/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [User Management]
 *     security:
 *       - apiKey: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to change password
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePassword'
 *     responses:
 *       '200':
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Password changed."
 *               details:
 *                 user:
 *                   emailVerification:
 *                     token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJiaXNod29qaXQiLCJsYXN0TmFtZSI6Im1hbG8iLCJlbWFpbCI6Im1lLmJpc2h3b2ppdEBnbWFpbC5jb20iLCJpYXQiOjE3MDA0ODE4MjksImV4cCI6MTcwMDQ4MjQyOX0.dQkyErqAErO1NhhZ0ded5IsJfO5xvoIYtj45hWduqqk"
 *                     status: "Pending"
 *                     verificationDate: null
 *                   deleteMarker:
 *                     status: true
 *                     deletedAt: "2023-12-01T15:34:48.720Z"
 *                     dateScheduled: "2023-12-01T15:34:48.720Z"
 *                   jobTitle: ""
 *                   purposeOfUse: []
 *                   isActive: false
 *                   refreshTokens: [...]
 *                   recoveryToken: ""
 *                   _id: "655b4b264e5343001f071744"
 *                   firstName: "firstName"
 *                   lastName: "lastName"
 *                   email: "me.bishwojit@gmail.com"
 *                   password: "$2a$10$frpfQ8bQE5P4QYCMjnOLSujPzTMaOT5j.EbGfh0CBW5XxERpE0/yW"
 *                   fullName: "firstName lastName"
 *                   createdAt: "2023-11-20T12:03:50.094Z"
 *                   updatedAt: "2023-12-01T15:47:08.091Z"
 *                   __v: 30
 *       '400':
 *         description: Bad Request, current password can not be used
 *         content:
 *           application/json:
 *             example:
 *               message: "Bad Request"
 *               details:
 *                 description: "Current password can not be used."
 *       '404':
 *         description: Not Found
 *         content:
 *           application/json:
 *             example:
 *               message: "Not Found"
 *               details:
 *                 description: "User not found with the given ID." 
 */

/**
 * @swagger
 * /users/{id}/soft:
 *   delete:
 *     summary: Soft remove user
 *     tags: [User Management]
 *     security:
 *       - apiKey: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to soft remove
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: User moved to trash successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "User moved to trash."
 *               details:
 *                 user:
 *                   emailVerification:
 *                     token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJiaXNod29qaXQiLCJsYXN0TmFtZSI6Im1hbG8iLCJlbWFpbCI6Im1lLmJpc2h3b2ppdEBnbWFpbC5jb20iLCJpYXQiOjE3MDA0ODE4MjksImV4cCI6MTcwMDQ4MjQyOX0.dQkyErqAErO1NhhZ0ded5IsJfO5xvoIYtj45hWduqqk"
 *                     status: "Pending"
 *                     verificationDate: null
 *                   deleteMarker:
 *                     status: false
 *                     deletedAt: null
 *                     dateScheduled: null
 *                   jobTitle: ""
 *                   purposeOfUse: []
 *                   isActive: false
 *                   refreshTokens: [
 *                     "token1",
 *                     "token2",
 *                     "token3",
 *                     "token4",
 *                     "token5"
 *                   ]
 *                   recoveryToken: ""
 *                   _id: "655b4b264e5343001f071744"
 *                   firstName: "string"
 *                   lastName: "string"
 *                   email: "me.bishwojit@gmail.com"
 *                   password: "$2a$10$vDl1uWtXZa6omUQt5wtKv.l.QUzh8bIv74IRKj5w/wBL/6gzjPggW"
 *                   fullName: "firstzName lastName"
 *                   createdAt: "2023-11-20T12:03:50.094Z"
 *                   updatedAt: "2023-12-01T15:20:36.832Z"
 *       '404':
 *         description: Not Found
 *         content:
 *           application/json:
 *             example:
 *               message: "Not Found"
 *               details:
 *                 description: "User not found with the given ID." 
 */

/**
 * @swagger
 * /users/{id}/hard:
 *   delete:
 *     summary: Hard remove user
 *     tags: [User Management]
 *     security:
 *       - apiKey: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to hard remove
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: User hard removed successfully
 *         content:
 *           application/json:
 *             example:
 *               // working on this api
 */

/**
 * @swagger
 * /users/{id}/restore:
 *   put:
 *     summary: Restore user
 *     tags: [User Management]
 *     security:
 *       - apiKey: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to restore
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: User restored successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "User restored."
 *               details:
 *                 user:
 *                   emailVerification:
 *                     token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJiaXNod29qaXQiLCJsYXN0TmFtZSI6Im1hbG8iLCJlbWFpbCI6Im1lLmJpc2h3b2ppdEBnbWFpbC5jb20iLCJpYXQiOjE3MDA0ODE4MjksImV4cCI6MTcwMDQ4MjQyOX0.dQkyErqAErO1NhhZ0ded5IsJfO5xvoIYtj45hWduqqk"
 *                     status: "Pending"
 *                     verificationDate: null
 *                   deleteMarker:
 *                     status: false
 *                     deletedAt: null
 *                     dateScheduled: null
 *                   jobTitle: ""
 *                   purposeOfUse: []
 *                   isActive: false
 *                   refreshTokens: [
 *                     "token1",
 *                     "token2",
 *                     "token3",
 *                     "token4",
 *                     "token5"
 *                   ]
 *                   recoveryToken: ""
 *                   _id: "655b4b264e5343001f071744"
 *                   firstName: "string"
 *                   lastName: "string"
 *                   email: "me.bishwojit@gmail.com"
 *                   password: "$2a$10$vDl1uWtXZa6omUQt5wtKv.l.QUzh8bIv74IRKj5w/wBL/6gzjPggW"
 *                   fullName: "firstzName lastName"
 *                   createdAt: "2023-11-20T12:03:50.094Z"
 *                   updatedAt: "2023-12-01T15:20:36.832Z"
 *
 *       '404':
 *         description: Not Found
 *         content:
 *           application/json:
 *             example:
 *               message: "Not Found"
 *               details:
 *                 description: "User not found with the given ID."  
 */



const { validate } = require("../../common/middlewares/validator");
const validaions = require("../validations");
const { postLimiter } = require("../../common/middlewares/rateLimiter");

const validateBody = validate("body");
// middlewares ...

router.get("/:id", [], getUser);
router.get("/", [], listUsers);
router.put(
  "/:id",
  [validateBody(validaions.updateProfileData)],
  updateProfileInformation
);
router.post(
  "/:id/change-password",
  [postLimiter, validateBody(validaions.changePassword)],
  changePassword
);

router.delete("/:id/soft", [], softRemoveUser);
router.delete("/:id/hard", [], hardRemoveUser);
router.put("/:id/restore", [], restoreUser);

module.exports = router;
