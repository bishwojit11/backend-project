const router = require("express").Router();
const {
  login,
  startRegistration,
  verifyRegistration,
  resendVerification,
  refreshToken,
  startAccountRecovery,
  recoverAccount,
  logout,
} = require("../controllers");
/**
 * @swagger
 * components:
 *   schemas:
 *     Registration:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *         lastName:
 *            type: string
 *         password:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *       required:
 *         - username
 *         - password
 *     Login:
 *        type: object
 *        properties:
 *          email:
 *           type: string
 *          password:
 *           type: string
 *        required:
 *          - firstName
 *          - lastName
 *          - email
 *          - password
 *     resendVerification:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           required: true
 *           label: Admin Id
 *
 *   securitySchemes:
 *     apiKey:
 *       type: apiKey
 *       in: header
 *       name: x-auth-accesstoken
 *
 *
 */

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API for user authentication
 */

/**
 * @swagger
 * /accounts/auth/login:
 *   post:
 *     summary: Login to the application
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       '200':
 *         description: Successful login
 *         content:
 *           application/json:
 *             example:
 *               message: "Login successful."
 *               details:
 *                 accessToken: "your_access_token"
 *                 refreshToken: "your_new_refresh_token"
 *                 user:
 *                   _id: "655b4b264e5343001f071741"
 *       '400':
 *         description: Bad Request, invalid credentials
 *         content:
 *           application/json:
 *             example:
 *               message: "Bad Request"
 *               details:
 *                 description: "Invalid credentials." 
 */


/**
 * @swagger
 * /accounts/registration:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Registration'
 *     responses:
 *       '200':
 *         description: User registration successful
 *         content:
 *           application/json:
 *             example:
 *               message: "Registration Process Started."
 *               details:
 *                 user:
 *                   _id: "65689bdc8acd12002ff71fd4"
 *                   fullName: "firstName lastName"
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               message: "Bad Request"
 *               details:
 *                 description: "An account is already registered with this email."
 */

/**
 * @swagger
 * /accounts/registration/verification:
 *   post:
 *     summary: Verify user registration
 *     tags: [Authentication]
 *     parameters:
 *       - in: header
 *         name: x-register-token
 *         schema:
 *           type: string
 *         required: true
 *         description: The registration token in the header
 *     responses:
 *       '200':
 *         description: User account validation complete
 *         content:
 *           application/json:
 *             example:
 *               message: "User account validation complete."
 *               details:
 *                 user:
 *                   _id: "65689bdc8acd12002ff71fc5"
 *                   firstName: "string"
 *                   lastName: "malo"
 *                   email: "example@gmail.com"
 *                   fullName: "firstName lastName"
 *                   createdAt: "2023-11-30T14:27:40.427Z"
 *                   updatedAt: "2023-11-30T14:33:30.229Z"
 *                   emailVerification:
 *                     token: null
 *                     status: "Verified"
 *                     verificationDate: "2023-11-30T14:33:30.228Z"
 *                   deleteMarker:
 *                     status: false
 *                     deletedAt: null
 *                     dateScheduled: null
 *                   jobTitle: ""
 *                   purposeOfUse: []
 *                   isActive: false
 *                   refreshTokens: []
 *                   recoveryToken: ""
 *                   __v: 0
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             example:
 *               message: "Forbidden"
 *               details:
 *                 description: "Token expired."

 */

/**
 * @swagger
 * /accounts/registration/verification/emails:
 *   post:
 *     summary: Resend user verification email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/resendVerification'
 *     responses:
 *       '200':
 *         description: User account verification email sent
 *         content:
 *           application/json:
 *             example:
 *               message: "User account verification email sent."
 *               details:
 *                 user:
 *                   _id: "65689f3f7dfccc009ca2ec22"
 *                   fullName: "firstName lastName"
 * 
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               message: "Bad Request"
 *               details:
 *                 description: "User is already verified."
 */

/**
 * @swagger
 * /accounts/recovery:
 *   post:
 *     summary: Start account recovery
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/requestRecovery'
 *     responses:
 *       '200':
 *         description: Recovery email sent successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Recovery email sent for verification."
 *               details:
 *                 email: "example@gmail.com"
 * 
 *       '400':
 *         description: Bad Request, user not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Bad Request"
 *               details:
 *                 description: "User not found." 
 */

/**
 * @swagger
 * /accounts/recovery/verification:
 *   post:
 *     summary: Verify account recovery
 *     tags: [Authentication]
 *     parameters:
 *       - in: header
 *         name: x-recovery-token
 *         schema:
 *           type: string
 *         required: true
 *         description: The recovery token in the header
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/verifyRecovery'
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example: { message: 'Account recovery verified successfully' }
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     verifyRecovery:
 *       type: object
 *       properties:
 *         password:
 *           type: string
 */


/**
 * @swagger
 * /accounts/auth/logout:
 *   delete:
 *     summary: User logout
 *     tags: [Authentication]
 *     security:
 *       - apiKey: []
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example: { message: 'User logged out successfully' }
 */

/**
 * @swagger
 * /accounts/auth/refresh-token:
 *   get:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     security:
 *       - apiKey: []
 *     responses:
 *       '200':
 *         description: Successful token refresh
 *         content:
 *           application/json:
 *             example:
 *               token: "your_new_access_token"
 */



const { validate } = require("../../common/middlewares/validator");
const validations = require("../validations");
const validateBody = validate("body");
const { postLimiter } = require("../../common/middlewares/rateLimiter");

router.post("/auth/login", [validateBody(validations.login)], login);

router.post("/auth/refresh-token", [], refreshToken);

router.post(
  "/registration",
  [postLimiter, validateBody(validations.register)],
  startRegistration
);

router.post("/registration/verification", verifyRegistration);

router.post(
  "/registration/verification/emails",
  [validateBody(validations.resendVerification)],
  resendVerification
);

router.post(
  "/recovery",
  [postLimiter, validateBody(validations.requestRecovery)],
  startAccountRecovery
);

router.post(
  "/recovery/verification",
  [validateBody(validations.verifyRecovery)],
  recoverAccount
);

router.delete("/auth/logout", logout);

module.exports = router;
