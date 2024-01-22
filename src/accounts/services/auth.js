const { Manager } = require("./manager");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Token, logger } = require("../../common/helper");
const { APIError } = require("../../common/helper/errors/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
class Auth extends Manager {
  constructor() {
    super();
  }
  validateOrganisationId(orgId) {
    if (!orgId) return null;
    if (!mongoose.Types.ObjectId.isValid(orgId))
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "invalid mongodb ObjectId"
      );
    return orgId;
  }
  async authenticateUserIdendity({
    availableToken,
    email,
    password,
    userAgent,
  }) {
    let user = await this.User.findOne({ email });
    if (!user)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "User does not exist."
      );

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Invalid Credentials."
      );
    }
    const newTokens = await this.getSignature({
      user,
      userAgent,
    });
    const newRefreshTokens = !availableToken
      ? [...user.refreshTokens]
      : user.refreshTokens?.filter((rt) => rt !== availableToken);
    user.refreshTokens = [...newRefreshTokens, newTokens.refreshToken];
    await user.save();
    return newTokens;
  }
  async handleRefreshToken(refreshToken, data) {
    /**
     * PROBLEM: what if user is deleted and tokens are still valid.
     */
    if (!refreshToken)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "No refresh token found."
      );
    const foundUser = await this.User.findOne({ refreshTokens: refreshToken });
    /**
     * Detected refresh token reuse.
     * Handling security on reuse of a token.
     */
    if (!foundUser) {
      const validationResponse = await Token.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      if (!validationResponse.valid)
        throw new APIError(
          ReasonPhrases.BAD_REQUEST,
          StatusCodes.BAD_REQUEST,
          "Invalid refresh token"
        );
      logger.info(
        "Refresh token reuse attempt detected, protecting hacked user...",
        { ...validationResponse.decoded }
      );
      const hackedUser = await this.User.findOne({
        _id: validationResponse.decoded.user._id,
      });
      logger.info(hackedUser);
      hackedUser.refreshTokens = [];
      const result = await hackedUser.save();
      logger.info("Printing user information...", { result });
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Reuse of refresh token."
      );
    }

    /**
     * Evaluation of refresh token to execute a token pair iteration.
     */
    const newRefreshTokenArray = foundUser.refreshTokens.filter(
      (rt) => rt !== refreshToken
    );
    const validationResponse = await Token.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    if (!validationResponse.valid) {
      foundUser.refreshTokens = [...newRefreshTokenArray];
      const result = await foundUser.save();
      logger.info("Refresh token expired, login required.", result);
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Refresh token expired, login required."
      );
    }
    if (
      foundUser._id?.toString() !==
      validationResponse.decoded.user._id?.toString()
    )
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "User id don't match with refresh token."
      );

    /**
     * Refresh token passed all checks and is still valid.
     */
    const newTokenPair = await this.getSignature({
      user: foundUser,
      organisationId: data.organisationId || null,
    });
    /**
     * Adding new refresh token for this current users refresh token family
     */
    foundUser.refreshTokens = [
      ...newRefreshTokenArray,
      newTokenPair.refreshToken,
    ];
    await foundUser.save();
    return { ...newTokenPair };
  }
  async invalidateRefreshToken(refreshToken) {
    if (!refreshToken)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "No refresh token found."
      );
    const foundUser = await this.User.findOne({ refreshTokens: refreshToken });
    if (!foundUser)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Token is too old."
      );
    const newRefreshTokenArray = foundUser.refreshTokens.filter(
      (rt) => rt !== refreshToken
    );
    foundUser.refreshTokens = [...newRefreshTokenArray];
    return foundUser.save();
  }
  async getSignature(data) {
    let user = data?.user;
    let userAgent = data?.userAgent;
    /**
     * org if that user have access to. if no value provided system will detect default org.
     * if no default org found, sends null in token so atleast user can access public routes
     */
    let organisationId = this.validateOrganisationId(
      data?.organisationId || null
    );
    /** we are trying to match users access to organisation if provided. */
    const accessPolicy = await this.AccessPolicy.findOne({
      invitedUserId: user._id,
      organisationId: organisationId,
    });
    const orgDetails = await this.Organisation.findOne({
      _id: accessPolicy?.organisationId,
    });
    const accessPayload = {
      user: {
        _id: user._id,
        name: user.firstName,
        email: user.email,
        /**
         * if membership not found users will have following values 'null' in the tokens
         * and they will be unable to access proper org api.
         */
        organisationId: accessPolicy?.organisationId || null,
        organisationName: orgDetails?.name,
        role: accessPolicy?.role || null,
      },
    };

    let accessToken = await Token.signToken(
      accessPayload,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_TTL }
    );
    let refreshToken = await Token.signToken(
      {
        user: {
          _id: user._id,
          organisationId: accessPolicy?.organisationId || null,
        },
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_TTL }
    );

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      accessToken,
      refreshToken,
    };
  }
}
module.exports = { Auth };
